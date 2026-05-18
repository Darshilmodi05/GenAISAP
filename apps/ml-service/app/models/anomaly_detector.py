import math
from typing import List, Dict, Any

class AnomalyDetector:
    def __init__(self, threshold: float = 3.0):
        self.threshold = threshold

    def detect_spikes(self, timeseries: List[float]) -> List[int]:
        """
        Detects anomalies using Z-score analysis on time-series data.
        Fast and efficient pure Python implementation.
        """
        if not timeseries or len(timeseries) < 3:
            return []
            
        mean = sum(timeseries) / len(timeseries)
        variance = sum((x - mean) ** 2 for x in timeseries) / len(timeseries)
        std = math.sqrt(variance)
        
        if std == 0:
            return []
            
        anomalies = []
        for i, val in enumerate(timeseries):
            z_score = abs(val - mean) / std
            if z_score > self.threshold:
                anomalies.append(i)
                
        return anomalies

    def detect_multi_dim_anomalies(self, data: List[List[float]]) -> List[int]:
        """
        Pure Python fallback for multi-dimensional anomaly detection.
        Uses distance from centroid to flag outliers.
        """
        if not data or len(data) < 10:
            return []
            
        n = len(data)
        dims = len(data[0])
        
        # Calculate centroid
        centroid = [sum(row[d] for row in data) / n for d in range(dims)]
        
        # Calculate Euclidean distances from centroid
        distances = []
        for row in data:
            dist = math.sqrt(sum((row[d] - centroid[d]) ** 2 for d in range(dims)))
            distances.append(dist)
            
        mean_dist = sum(distances) / n
        var_dist = sum((d - mean_dist) ** 2 for d in distances) / n
        std_dist = math.sqrt(var_dist)
        
        if std_dist == 0:
            return []
            
        # Flag points that are unusually far from the center
        return [i for i, d in enumerate(distances) if (abs(d - mean_dist) / std_dist) > 2.5]

    def find_duplicate_postings(self, postings: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Identifies potential double-postings based on amount and vendor similarity.
        """
        duplicates = []
        seen = {} # key: (vendor, amount)
        
        for p in postings:
            key = (p.get('vendor_id'), p.get('amount'))
            if key in seen:
                duplicates.append({
                    "original": seen[key],
                    "duplicate": p,
                    "reason": "Exact amount and vendor match within same period",
                    "severity": "critical"
                })
            else:
                seen[key] = p
                
        return duplicates
