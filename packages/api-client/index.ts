import axios, { AxiosInstance } from 'axios';

export interface MLServiceConfig {
  baseURL: string;
  timeout?: number;
}

export interface AnomalySpikeResponse {
  success: boolean;
  anomalies: Array<{
    index: number;
    value: number;
    evidence: Record<string, any>;
    narrative: string;
    severity: string;
  }>;
}

export interface AnomalyDuplicateResponse {
  success: boolean;
  duplicates: Array<{
    original: Record<string, any>;
    duplicate: Record<string, any>;
    reason: string;
    severity: string;
  }>;
}

export interface ForecastResponse {
  success: boolean;
  original_series: number[];
  predictions: number[];
}

export interface ModuleClassificationResponse {
  module: string;
  confidence: number;
  scores?: Record<string, number>;
  note?: string;
}

export class GenAISAPMLClient {
  private client: AxiosInstance;

  constructor(config: MLServiceConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout ?? 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  /**
   * Performs Z-score spike anomaly checks.
   */
  public async detectSpikes(data: number[], relatedModules: Record<string, boolean> = {}): Promise<AnomalySpikeResponse> {
    const response = await this.client.post<AnomalySpikeResponse>('/anomaly/detect-spikes', {
      data,
      related_modules: relatedModules,
    });
    return response.data;
  }

  /**
   * Scans postings for exact vendor/amount duplicate patterns.
   */
  public async findDuplicates(postings: Array<Record<string, any>>): Promise<AnomalyDuplicateResponse> {
    const response = await this.client.post<AnomalyDuplicateResponse>('/anomaly/find-duplicates', {
      postings,
    });
    return response.data;
  }

  /**
   * Runs Prophet predictive forecast loops.
   */
  public async predictForecast(series: number[], periods: number = 3): Promise<ForecastResponse> {
    const response = await this.client.post<ForecastResponse>('/forecast/predict', {
      series,
      periods,
    });
    return response.data;
  }

  /**
   * Routes user queries into specific SAP module structures.
   */
  public async classifyModule(description: string): Promise<ModuleClassificationResponse> {
    const response = await this.client.post<ModuleClassificationResponse>('/classify/module', {
      description,
    });
    return response.data;
  }

  /**
   * Healthcheck validator.
   */
  public async checkHealth(): Promise<Record<string, any>> {
    const response = await this.client.get('/health');
    return response.data;
  }
}
