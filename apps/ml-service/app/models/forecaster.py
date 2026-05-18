import math
from typing import List

class Forecaster:
    def predict_next(self, series: List[float], periods: int = 3) -> List[float]:
        """
        Simple linear regression based forecasting for demo purposes,
        implemented in pure Python.
        """
        if len(series) < 2:
            return [series[-1]] * periods if series else [0] * periods
            
        n = len(series)
        x_mean = (n - 1) / 2.0
        y_mean = sum(series) / n
        
        # Calculate slope (m) and intercept (c)
        numerator = sum((i - x_mean) * (y - y_mean) for i, y in enumerate(series))
        denominator = sum((i - x_mean) ** 2 for i in range(n))
        
        m = numerator / denominator if denominator != 0 else 0
        c = y_mean - m * x_mean
        
        predictions = []
        for i in range(periods):
            next_x = n + i
            predictions.append(float(m * next_x + c))
            
        return predictions
