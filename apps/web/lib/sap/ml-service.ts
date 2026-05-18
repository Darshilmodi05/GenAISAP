import axios from 'axios';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

export interface MLAnomaly {
  type: string;
  data?: any;
  value?: number;
  narrative: string;
  severity: 'critical' | 'warning' | 'info';
}

export const mlService = {
  analyzePostings: async (postings: any[]): Promise<MLAnomaly[]> => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/anomaly/find-duplicates`, { postings });
      return response.data.duplicates || [];
    } catch (error: any) {
      console.error('ML Service Error (Duplicates):', error?.message);
      return [];
    }
  },

  analyzeSpikes: async (data: number[], context: string = "general"): Promise<MLAnomaly[]> => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/anomaly/detect-spikes`, { data, context });
      return response.data.anomalies || [];
    } catch (error: any) {
      console.error('ML Service Error (Spikes):', error?.message);
      return [];
    }
  },

  predictForecast: async (series: number[], periods: number = 3): Promise<number[]> => {
    try {
      const response = await axios.post(`${ML_SERVICE_URL}/forecast/predict`, { series, periods });
      return response.data.predictions || [];
    } catch (error: any) {
      console.error('ML Service Error (Forecast):', error?.message);
      return [];
    }
  },

  checkHealth: async () => {
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`);
      return response.data;
    } catch (error: any) {
      return { status: 'offline', error: error?.message };
    }
  }
};
