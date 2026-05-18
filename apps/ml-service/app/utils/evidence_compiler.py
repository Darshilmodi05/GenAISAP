from typing import List, Dict, Any

class EvidenceCompiler:
    def compile_evidence(self, anomaly: Dict[str, Any], context_data: Dict[str, Any]) -> str:
        """
        Aggregates data from multiple SAP modules to provide a holistic view of an anomaly.
        """
        evidence_lines = []
        
        # Primary Anomaly
        type_ = anomaly.get('type', 'Unknown')
        val = anomaly.get('value', 'N/A')
        evidence_lines.append(f"PRIMARY_ANOMALY: {type_} detected with magnitude {val}.")
        
        # Cross-Module Correlation
        if 'related_modules' in context_data:
            for mod, health in context_data['related_modules'].items():
                evidence_lines.append(f"CORRELATION: Module {mod} health at {health}%.")
                
        # Historical Context
        if 'historical_avg' in context_data:
            avg = context_data['historical_avg']
            drift = ((float(val) - avg) / avg * 100) if avg != 0 else 0
            evidence_lines.append(f"HISTORICAL: Baseline variance calculated at {drift:.2f}%.")
            
        return "\n".join(evidence_lines)

compiler = EvidenceCompiler()
