/**
 * SAP S/4HANA OData Client
 * Handles authenticated requests to SAP OData services.
 */

export interface SAPConnectionConfig {
  baseUrl: string;
  username?: string;
  password?: string;
  apiKey?: string;
}

export class SAPClient {
  private config: SAPConnectionConfig;

  constructor(config: SAPConnectionConfig) {
    this.config = config;
  }

  async fetchOData(servicePath: string, entitySet: string, options: { filter?: string; select?: string } = {}) {
    const url = new URL(`${this.config.baseUrl}/${servicePath}/${entitySet}`);
    
    if (options.filter) url.searchParams.append('$filter', options.filter);
    if (options.select) url.searchParams.append('$select', options.select);
    url.searchParams.append('$format', 'json');

    const headers: Record<string, string> = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    };

    if (this.config.apiKey) {
      headers['APIKey'] = this.config.apiKey;
    } else if (this.config.username && this.config.password) {
      const auth = btoa(`${this.config.username}:${this.config.password}`);
      headers['Authorization'] = `Basic ${auth}`;
    }

    try {
      const response = await fetch(url.toString(), { headers });
      if (!response.ok) {
        throw new Error(`SAP OData Error: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data.d.results || data.d || data.value;
    } catch (error) {
      console.error('Failed to fetch from SAP:', error);
      throw error;
    }
  }

  // Helper for FICO General Ledger
  async getGLPostings(companyCode: string, period: string) {
    return this.fetchOData('API_GL_ACCOUNT_LINE_ITEMS', 'GLAccountLineItems', {
      filter: `CompanyCode eq '${companyCode}' and FiscalPeriod eq '${period}'`
    });
  }

  // Helper for Sales Orders (SD)
  async getSalesOrders() {
    return this.fetchOData('API_SALES_ORDER_SRV', 'A_SalesOrder', {
      select: 'SalesOrder,SalesOrderType,TotalNetAmount,TransactionCurrency'
    });
  }
}

// Singleton instance for the app
export const sapClient = new SAPClient({
  baseUrl: process.env.SAP_BASE_URL || 'https://sandbox.api.sap.com/s4hanacloud/sap/opu/odata/sap',
  apiKey: process.env.SAP_API_KEY
});
