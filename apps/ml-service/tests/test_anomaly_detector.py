import unittest
from app.models.anomaly_detector import AnomalyDetector

class TestAnomalyDetector(unittest.TestCase):
    def setUp(self):
        self.detector = AnomalyDetector(threshold=2.0)

    def test_empty_timeseries(self):
        self.assertEqual(self.detector.detect_spikes([]), [])
        self.assertEqual(self.detector.detect_spikes([1.0]), [])

    def test_no_anomalies(self):
        # Evenly spread data points should have no spikes
        data = [10.0, 10.0, 10.0, 10.0, 10.0]
        self.assertEqual(self.detector.detect_spikes(data), [])

    def test_spike_detection(self):
        # A significant outlier (100.0) in standard series
        data = [10.0, 10.0, 11.0, 10.0, 9.0, 100.0, 10.0]
        anomalies = self.detector.detect_spikes(data)
        self.assertIn(5, anomalies) # Index 5 is the outlier 100.0

    def test_duplicate_postings(self):
        postings = [
            {"id": "1", "vendor_id": "V100", "amount": 25000},
            {"id": "2", "vendor_id": "V200", "amount": 15000},
            {"id": "3", "vendor_id": "V100", "amount": 25000}, # Duplicate!
        ]
        duplicates = self.detector.find_duplicate_postings(postings)
        self.assertEqual(len(duplicates), 1)
        self.assertEqual(duplicates[0]["duplicate"]["id"], "3")
        self.assertEqual(duplicates[0]["original"]["id"], "1")

if __name__ == '__main__':
    unittest.main()
