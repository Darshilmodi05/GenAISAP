import re
from typing import Dict, Any

class IntentClassifier:
    """
    Formalized Intent Classifier for SAP Directives.
    Provides a placeholder for BERT-based classification while 
    maintaining high-performance heuristic matching.
    """
    
    def __init__(self):
        self.patterns = {
            "FICO": r"(vendor|payment|ledger|audit|tax|revenue|expense|invoice)",
            "MM": r"(stock|inventory|warehouse|po|goods|procurement|materials)",
            "SD": r"(order|shipment|customer|billing|delivery|sales|pipeline)"
        }

    def classify(self, text: str) -> Dict[str, Any]:
        """
        Classifies query intent using weighted heuristic matching.
        """
        text = text.lower()
        scores = {}
        
        for module, pattern in self.patterns.items():
            matches = re.findall(pattern, text)
            scores[module] = len(matches)
            
        best_module = max(scores, key=scores.get) if any(scores.values()) else "UNKNOWN"
        confidence = 0.95 if best_module != "UNKNOWN" else 0.0
        
        return {
            "module": best_module,
            "confidence": confidence,
            "intent": "analytical" if "analyze" in text or "report" in text else "transactional"
        }
