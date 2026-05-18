import numpy as np
from typing import List, Dict, Any, Optional

class BaselineProfiler:
    """
    Computes and maintains institutional baselines for SAP metrics.
    Used to reduce false positives in anomaly detection.
    """
    
    def __init__(self, window_size: int = 12):
        self.window_size = window_size

    def compute_baseline(self, historical_values: List[float]) -> Dict[str, float]:
        """
        Calculates the statistical baseline for a given metric.
        """
        if not historical_values:
            return {"mean": 0.0, "std": 0.0, "upper_bound": 0.0, "lower_bound": 0.0}
            
        data = np.array(historical_values)
        mean = np.mean(data)
        std = np.std(data)
        
        # 2-Sigma confidence interval (95.4%)
        return {
            "mean": float(mean),
            "std": float(std),
            "upper_bound": float(mean + (2 * std)),
            "lower_bound": float(max(0, mean - (2 * std)))
        }

    def check_drift(self, current_value: float, baseline: Dict[str, float]) -> Dict[str, Any]:
        """
        Determines if a value represents a significant baseline drift.
        """
        upper = baseline.get("upper_bound", 0.0)
        lower = baseline.get("lower_bound", 0.0)
        
        is_drift = current_value > upper or current_value < lower
        variance = 0.0
        if baseline.get("mean", 0.0) != 0:
            variance = ((current_value - baseline["mean"]) / baseline["mean"]) * 100
            
        return {
            "is_drift": is_drift,
            "variance_pct": float(variance),
            "severity": "high" if abs(variance) > 25 else "medium" if is_drift else "stable"
        }
