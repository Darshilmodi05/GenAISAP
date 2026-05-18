import json
import os
from http.server import HTTPServer, BaseHTTPRequestHandler
from typing import Dict, Any

from app.models.anomaly_detector import AnomalyDetector
from app.models.narrative_generator import NarrativeGenerator
from app.models.forecaster import Forecaster
from app.utils.evidence_compiler import compiler

detector = AnomalyDetector()
narrator = NarrativeGenerator()
forecaster = Forecaster()

def classify_module_logic(tx: Dict[str, Any]) -> Dict[str, Any]:
    desc = tx.get('description', '').lower()
    
    scores = {"FICO": 0, "MM": 0, "SD": 0, "HCM": 0}
    
    fico_keys = ['vendor', 'payment', 'ledger', 'audit', 'tax', 'reconciliation', 'invoice', 'asset', 'accrual']
    for k in fico_keys:
        if k in desc: scores["FICO"] += 1
        
    mm_keys = ['stock', 'inventory', 'warehouse', 'po', 'goods', 'receipt', 'procurement', 'material']
    for k in mm_keys:
        if k in desc: scores["MM"] += 1
        
    sd_keys = ['order', 'shipment', 'customer', 'billing', 'delivery', 'quote', 'sales', 'return']
    for k in sd_keys:
        if k in desc: scores["SD"] += 1
        
    best_module = max(scores, key=scores.get)
    confidence = 0.5 + (scores[best_module] * 0.1)
    
    if scores[best_module] == 0:
        return {"module": "ROOT", "confidence": 0.4, "note": "Heuristic fallback to ROOT node"}
        
    return {
        "module": best_module,
        "confidence": min(0.99, confidence),
        "scores": scores
    }


class SimpleMLHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status: int = 200):
        self.send_response(status)
        self.send_header('Content-type', 'application/json')
        # Simple CORS
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers()

    def do_GET(self):
        if self.path == '/health':
            self._set_headers()
            response = {
                "status": "healthy", 
                "engine": "GenAISAP-ML v1.0 (Pure Python Fallback)",
                "orchestration": "active",
                "timestamp": os.getenv("HOSTNAME", "local-node")
            }
            self.wfile.write(json.dumps(response).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(b'{"error": "not found"}')

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)
        
        try:
            body = json.loads(post_data.decode('utf-8'))
        except:
            body = {}

        response = {}
        status = 200

        try:
            if self.path == '/anomaly/detect-spikes':
                data = body.get('data', [])
                related_modules = body.get('related_modules', {})
                indices = detector.detect_spikes(data)
                anomalies = []
                for idx in indices:
                    val = data[idx]
                    evidence = compiler.compile_evidence(
                        {"type": "Spike", "value": val},
                        {"related_modules": related_modules, "historical_avg": sum(data)/len(data) if data else 0}
                    )
                    narrative = narrator.generate_alert_narrative("Volume Spike", evidence)
                    anomalies.append({
                        "index": idx,
                        "value": val,
                        "evidence": evidence,
                        "narrative": narrative,
                        "severity": "warning"
                    })
                response = {"success": True, "anomalies": anomalies}

            elif self.path == '/anomaly/find-duplicates':
                postings = body.get('postings', [])
                duplicates = detector.find_duplicate_postings(postings)
                response = {"success": True, "duplicates": duplicates}

            elif self.path == '/forecast/predict':
                series = body.get('series', [])
                periods = body.get('periods', 3)
                predictions = forecaster.predict_next(series, periods)
                response = {
                    "success": True,
                    "original_series": series,
                    "predictions": predictions
                }

            elif self.path == '/classify/module':
                response = classify_module_logic(body)

            else:
                status = 404
                response = {"error": "Not Found"}
                
        except Exception as e:
            status = 500
            response = {"error": str(e)}

        self._set_headers(status)
        self.wfile.write(json.dumps(response).encode('utf-8'))


if __name__ == "__main__":
    port = 8000
    server_address = ('', port)
    httpd = HTTPServer(server_address, SimpleMLHandler)
    print(f"Starting pure Python ML Service on port {port}...")
    httpd.serve_forever()
