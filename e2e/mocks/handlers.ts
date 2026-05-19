import { http, HttpResponse } from 'msw';

export const handlers = [
  // FastAPI ML service mock
  http.get('http://localhost:8000/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      engine: 'GenAISAP-ML v1.0 (MSW Mocked)',
      orchestration: 'active',
      timestamp: 'mock-timestamp'
    });
  }),

  http.post('http://localhost:8000/forecast/predict', () => {
    return HttpResponse.json({
      success: true,
      predictions: [15.4, 16.2, 15.9]
    });
  }),

  http.post('http://localhost:8000/anomaly/detect-spikes', () => {
    return HttpResponse.json({
      success: true,
      anomalies: [
        {
          index: 3,
          value: 500,
          narrative: 'Mock spike detected at index 3',
          severity: 'warning'
        }
      ]
    });
  }),

  // Next.js internal endpoints mocks
  http.get('*/api/health', () => {
    return HttpResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: { status: 'healthy', responseTime: 5 },
        redis: { status: 'healthy', responseTime: 2 },
        intelligence: { status: 'healthy', engine: 'Mock' }
      }
    });
  }),

  http.get('*/api/dashboard/metrics', () => {
    return HttpResponse.json({
      success: true,
      data: {
        revenue: '$12.45M',
        anomalyCount: 1,
        activeNodes: 3
      }
    });
  })
];
