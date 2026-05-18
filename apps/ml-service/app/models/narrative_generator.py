import os
import json
import urllib.request
import urllib.error
from typing import Dict, Any

class NarrativeGenerator:
    def __init__(self):
        self.ollama_url = os.getenv("OLLAMA_URL", "http://localhost:11434/api/generate")
        self.model = os.getenv("OLLAMA_MODEL", "llama3")

    def _generate(self, prompt: str) -> str:
        try:
            data = json.dumps({
                "model": self.model,
                "prompt": prompt,
                "stream": False
            }).encode('utf-8')
            
            req = urllib.request.Request(self.ollama_url, data=data, headers={'Content-Type': 'application/json'})
            with urllib.request.urlopen(req, timeout=30) as response:
                result = json.loads(response.read().decode('utf-8'))
                return result.get("response", "Error: No response from Ollama")
        except Exception as e:
            return f"Error connecting to local Ollama: {str(e)}"

    def generate_alert_narrative(self, anomaly_type: str, evidence: str) -> str:
        """
        Generates a high-fidelity narrative using compiled evidence.
        """
        prompt = f"""
        System: You are a GenAISAP Institutional Intelligence Agent.
        Task: Synthesize the following technical evidence into a professional executive narrative.
        
        Anomaly: {anomaly_type}
        Evidence Trace:
        {evidence}
        
        Requirements:
        1. Professional, authoritative tone.
        2. Focus on institutional impact and risk mitigation.
        3. Max 3 sentences.
        4. Output ONLY the narrative.
        """
        return self._generate(prompt)

    def analyze_variance(self, budget: float, actual: float, department: str) -> str:
        variance = actual - budget
        pct = (variance / budget) * 100
        
        prompt = f"""
        System: You are an SAP Financial Analyst AI.
        Task: Analyze this budget variance for {department}:
        Budget: ${budget}
        Actual: ${actual}
        Variance: ${variance} ({pct:.1f}%)
        
        Provide a professional explanation focusing on whether this is a structural issue or a one-time event.
        Output ONLY the analysis.
        """
        return self._generate(prompt)
