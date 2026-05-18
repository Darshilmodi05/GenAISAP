import math
from typing import List

class AnomalyIsolationForest:
    """
    Pure Python multi-dimensional outlier detection replacement 
    for Scikit-Learn's Isolation Forest. Uses distance-from-centroid 
    for SAP transactional clusters.
    """
    
    def __init__(self, contamination: float = 0.05):
        self.contamination = contamination

    def detect(self, data: List[List[float]]) -> List[int]:
        """
        Finds outliers by calculating Euclidean distance from the centroid
        and flagging the top X% furthest points based on contamination.
        """
        if not data or len(data) < 5:
            return []
            
        n = len(data)
        dims = len(data[0])
        
        # Centroid
        centroid = [sum(row[d] for row in data) / n for d in range(dims)]
        
        # Distances
        distances = []
        for i, row in enumerate(data):
            dist = math.sqrt(sum((row[d] - centroid[d]) ** 2 for d in range(dims)))
            distances.append((i, dist))
            
        # Sort by distance, descending
        distances.sort(key=lambda x: x[1], reverse=True)
        
        # Pick top contamination %
        num_outliers = max(1, int(n * self.contamination))
        return [item[0] for item in distances[:num_outliers]]
