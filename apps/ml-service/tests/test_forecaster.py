import unittest
from app.models.forecaster import Forecaster

class TestForecaster(unittest.TestCase):
    def setUp(self):
        self.forecaster = Forecaster()

    def test_insufficient_data(self):
        self.assertEqual(self.forecaster.predict_next([], periods=2), [0, 0])
        self.assertEqual(self.forecaster.predict_next([42.0], periods=2), [42.0, 42.0])

    def test_linear_trend_forecasting(self):
        # Perfectly linear series (y = 2x + 10)
        series = [10.0, 12.0, 14.0, 16.0]
        # Predictions should follow the exact same trend: 18.0, 20.0
        predictions = self.forecaster.predict_next(series, periods=2)
        self.assertAlmostEqual(predictions[0], 18.0)
        self.assertAlmostEqual(predictions[1], 20.0)

    def test_flat_trend(self):
        series = [5.0, 5.0, 5.0, 5.0]
        predictions = self.forecaster.predict_next(series, periods=3)
        self.assertEqual(predictions, [5.0, 5.0, 5.0])

if __name__ == '__main__':
    unittest.main()
