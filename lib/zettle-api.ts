/**
 * Zettle (iZettle) API Integration Service
 * Handles authentication, payments, inventory, and transaction management
 */
import { prisma } from '@/lib/prisma';

interface ZettleConfig {
  clientId?: string;
  clientSecret?: string;
  apiKey?: string;
  apiUrl: string;
  environment: 'sandbox' | 'production';
  currency: string;
  country: string;
  locale: string;
  authMethod?: 'oauth' | 'apikey';
  productsBaseUrl?: string;
  purchasesBaseUrl?: string;
  organizationId?: string;
}

interface ZettleAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface ZettleProduct {
  uuid?: string;
  name: string;
  description?: string;
  price: {
    amount: number;
    currencyId: string;
  };
  costPrice?: {
    amount: number;
    currencyId: string;
  };
  category?: {
    uuid: string;
    name: string;
  };
  taxRate?: number;
  unitName?: string;
  barcode?: string;
  externalReference?: string;
  etag?: string;
  updatedAt?: string;
  createdAt?: string;
}

interface ZettlePurchase {
  uuid?: string;
  amount: number;
  currencyId: string;
  reference?: string;
  description?: string;
  products?: Array<{
    name: string;
    price: number;
    quantity: number;
    vatRate?: number;
  }>;
}

interface ZettleTransaction {
  uuid: string;
  amount: number;
  currencyId: string;
  timestamp: string;
  reference?: string;
  description?: string;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  paymentMethod: string;
}

export class ZettleAPIService {
  private config: ZettleConfig;
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;
  private organizationId: string | null = null;

  constructor(config: ZettleConfig) {
    this.config = config;
  }

  /**
   * Authenticate with Zettle API using OAuth 2.0 or API Key
   */
  async authenticate(): Promise<ZettleAuthResponse> {
    // Load stored tokens (Authorization Code flow)
    const stored = await prisma.zettleAuth.findUnique({ where: { id: 'singleton' } });
    if (!stored) {
      throw new Error('Zettle is not connected. Please connect via /api/zettle/oauth/start');
    }

    // If token is valid for >30s, reuse
    const now = Date.now();
    const expiresAt = new Date(stored.expiresAt).getTime();
    if (expiresAt - now > 30_000 && stored.accessToken) {
      this.accessToken = stored.accessToken;
      this.tokenExpiry = new Date(expiresAt);
      return {
        access_token: stored.accessToken,
        token_type: stored.tokenType || 'Bearer',
        expires_in: Math.max(1, Math.floor((expiresAt - now) / 1000)),
        refresh_token: stored.refreshToken || undefined,
        scope: stored.scope || '',
      };
    }

    // Refresh token if available
    if (!this.config.clientId || !this.config.clientSecret) {
      throw new Error('Missing client credentials for token refresh');
    }
    if (!stored.refreshToken) {
      throw new Error('Missing refresh token. Please reconnect Zettle.');
    }

    const tokenUrl = `${this.config.apiUrl}/token`;
    const basic = Buffer.from(`${this.config.clientId}:${this.config.clientSecret}`).toString('base64');
    const body = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: stored.refreshToken,
    });

    const resp = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${basic}`,
      },
      body: body.toString(),
    });

    const txt = await resp.text();
    if (!resp.ok) {
      console.error('Zettle token refresh failed:', resp.status, txt);
      throw new Error(`Zettle token refresh failed: ${resp.status} ${txt}`);
    }

    const data = JSON.parse(txt) as ZettleAuthResponse;
    const newExpiry = new Date(Date.now() + data.expires_in * 1000);
    await prisma.zettleAuth.update({
      where: { id: 'singleton' },
      data: {
        accessToken: data.access_token,
        refreshToken: data.refresh_token || stored.refreshToken,
        tokenType: data.token_type,
        scope: data.scope,
        expiresAt: newExpiry,
      },
    });

    this.accessToken = data.access_token;
    this.tokenExpiry = newExpiry;
    return data;
  }

  /**
   * Check if current token is valid
   */
  private isTokenValid(): boolean {
    return this.accessToken !== null && 
           this.tokenExpiry !== null && 
           new Date() < this.tokenExpiry;
  }

  /**
   * Make authenticated API request
   */
  private async makeRequest(endpoint: string, options: RequestInit = {}, baseUrlOverride?: string): Promise<any> {
    if (!this.isTokenValid()) {
      throw new Error('No valid access token. Please authenticate first.');
    }

    // Use different base URLs for different environments
    const apiBaseUrl = baseUrlOverride || this.getApiBaseUrl();
    const url = `${apiBaseUrl}${endpoint}`;
    
    console.log(`Making API request to: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API request failed: ${response.status} ${response.statusText} - ${errorText}`);
    }

    return response.json();
  }

  /**
   * Discover and cache the organization UUID.
   * Tries multiple OAuth endpoints as Zettle docs have evolved.
   */
  private async getOrganizationId(): Promise<string> {
    if (this.organizationId) return this.organizationId;
    if (this.config.organizationId) {
      this.organizationId = this.config.organizationId;
      return this.organizationId;
    }
    if (!this.isTokenValid()) {
      await this.authenticate();
    }

    const candidates = [
      // Common variants observed historically
      `${this.config.apiUrl}/organizations/self`,
      `${this.config.apiUrl}/organizations`,
      `${this.config.apiUrl}/users/self/organizations`,
      `${this.config.apiUrl}/merchants/self/organizations`,
    ];

    for (const url of candidates) {
      try {
        console.log(`Discovering organization via ${url}`);
        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) {
          const txt = await res.text();
          console.log(`Org discovery failed ${url}: ${res.status} - ${txt}`);
          continue;
        }

        const data = await res.json();
        // Accept several response shapes
        const id = data?.id || data?.uuid || data?.organizationUuid || data?.organizationId
          || (Array.isArray(data) && (data[0]?.id || data[0]?.uuid));
        if (id) {
          this.organizationId = id;
          console.log(`Discovered organizationId=${id}`);
          return id;
        }
      } catch (e: any) {
        console.log(`Org discovery error for ${url}: ${e?.message || e}`);
      }
    }

    throw new Error('Could not discover organization ID from OAuth service');
  }

  /**
   * Get the correct API base URL based on environment
   */
  private getApiBaseUrl(): string {
    // Zettle API base URLs - different from OAuth URL
    if (this.config.environment === 'production') {
      return 'https://inventory.izettle.com'; // Production API
    } else {
      return 'https://inventory.izettle.com'; // Sandbox API (adjust if different)
    }
  }

  /**
   * Get all products from Zettle inventory
   */
  async getProducts(): Promise<ZettleProduct[]> {
    await this.authenticate();
    // Prepare org-aware endpoints
    let orgId: string | null = null;
    try {
      orgId = await this.getOrganizationId();
    } catch (e) {
      console.log('Proceeding without orgId, will try self paths only');
    }
    
    // Try multiple API configurations based on official Zettle documentation
    const productsBase = this.config.productsBaseUrl || 'https://products.izettle.com';
    const inventoryBase = 'https://inventory.izettle.com';
    const purchaseBase = this.config.purchasesBaseUrl || 'https://purchase.izettle.com';
    const apiConfigs = [
      {
        baseUrl: productsBase,
        endpoints: [
          orgId ? `/organizations/${orgId}/products/v2` : '/organizations/self/products/v2',
          orgId ? `/organizations/${orgId}/products` : '/organizations/self/products',
          '/products/v2',
          '/products'
        ]
      },
      {
        baseUrl: inventoryBase,
        endpoints: [
          // Keep a few fallbacks in case docs differ
          '/product-library/v1/products',
          '/product-library/products',
          orgId ? `/organizations/${orgId}/products` : '/organizations/self/products',
          orgId ? `/organizations/${orgId}/products/v2` : '/organizations/self/products/v2'
        ]
      },
      {
        baseUrl: purchaseBase,
        endpoints: [
          orgId ? `/organizations/${orgId}/products/v2` : '/organizations/self/products/v2',
          orgId ? `/organizations/${orgId}/products` : '/organizations/self/products'
        ]
      }
    ];

    let lastError: Error | null = null;

    for (const config of apiConfigs) {
      for (const endpoint of config.endpoints) {
        try {
          console.log(`Trying ${config.baseUrl}${endpoint}`);
          
          // Use makeRequest with per-service base URL
          const data = await this.makeRequest(endpoint, { method: 'GET' }, config.baseUrl);
          console.log(`Success with ${config.baseUrl}${endpoint}`);
          return data.products || data;
        } catch (error: any) {
          const status = error?.message?.match(/^API request failed: (\d+)/)?.[1] || 'unknown';
          console.log(`Failed ${config.baseUrl}${endpoint}: ${status} - ${error?.message || error}`);
          lastError = error;
          continue;
        }
      }
    }

    throw lastError || new Error('All product API configurations failed. Please check your API credentials and Zettle API documentation.');
  }

  /**
   * Create a new product in Zettle inventory
   */
  async createProduct(product: Omit<ZettleProduct, 'uuid' | 'etag' | 'updatedAt' | 'createdAt'>): Promise<ZettleProduct> {
    try {
      const response = await this.makeRequest(
        '/organizations/self/products/v2',
        {
          method: 'POST',
          body: JSON.stringify(product),
        },
        this.config.productsBaseUrl || 'https://products.izettle.com'
      );
      return response;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  /**
   * Update an existing product
   */
  async updateProduct(uuid: string, product: Partial<ZettleProduct>, etag: string): Promise<ZettleProduct> {
    try {
      const response = await this.makeRequest(
        `/organizations/self/products/v2/${uuid}`,
        {
          method: 'PUT',
          headers: {
            'If-Match': etag,
          },
          body: JSON.stringify(product),
        },
        this.config.productsBaseUrl || 'https://products.izettle.com'
      );
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async deleteProduct(uuid: string, etag: string): Promise<void> {
    try {
      await this.makeRequest(
        `/organizations/self/products/v2/${uuid}`,
        {
          method: 'DELETE',
          headers: {
            'If-Match': etag,
          },
        },
        this.config.productsBaseUrl || 'https://products.izettle.com'
      );
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  /**
   * Get purchase history
   */
  async getPurchases(startDate?: Date, endDate?: Date, limit: number = 100): Promise<ZettleTransaction[]> {
    try {
      let basePath = '/organizations/self/purchases/v2';
      try {
        const orgId = await this.getOrganizationId();
        basePath = `/organizations/${orgId}/purchases/v2`;
      } catch (e) {
        // fallback to self
      }
      let endpoint = `${basePath}?limit=${limit}`;
      
      if (startDate) {
        endpoint += `&startDate=${startDate.toISOString()}`;
      }
      if (endDate) {
        endpoint += `&endDate=${endDate.toISOString()}`;
      }

      const response = await this.makeRequest(endpoint, {}, this.config.purchasesBaseUrl || 'https://purchase.izettle.com');
      return response.purchases || [];
    } catch (error) {
      console.error('Error fetching purchases:', error);
      throw error;
    }
  }

  /**
   * Create a purchase (for record keeping)
   */
  async createPurchase(purchase: ZettlePurchase): Promise<any> {
    try {
      let path = '/organizations/self/purchases/v2';
      try {
        const orgId = await this.getOrganizationId();
        path = `/organizations/${orgId}/purchases/v2`;
      } catch (e) {
        // fallback to self
      }
      const response = await this.makeRequest(
        path,
        {
          method: 'POST',
          body: JSON.stringify(purchase),
        },
        this.config.purchasesBaseUrl || 'https://purchase.izettle.com'
      );
      return response;
    } catch (error) {
      console.error('Error creating purchase:', error);
      throw error;
    }
  }

  /**
   * Get financial data and reports
   */
  async getFinancialData(startDate: Date, endDate: Date): Promise<any> {
    try {
      const endpoint = `/organizations/self/finance/reports/payout-info?start=${startDate.toISOString()}&end=${endDate.toISOString()}`;
      const response = await this.makeRequest(endpoint);
      return response;
    } catch (error) {
      console.error('Error fetching financial data:', error);
      throw error;
    }
  }

  /**
   * Sync products between webapp and Zettle
   */
  async syncProducts(localProducts: any[]): Promise<{ created: number; updated: number; errors: string[] }> {
    const results = { created: 0, updated: 0, errors: [] as string[] };
    
    try {
      // Get existing Zettle products
      const zettleProducts = await this.getProducts();
      const zettleProductMap = new Map(zettleProducts.map(p => [p.externalReference, p]));

      for (const localProduct of localProducts) {
        try {
          const existingProduct = zettleProductMap.get(localProduct.id?.toString());
          
          const zettleProduct: Omit<ZettleProduct, 'uuid' | 'etag' | 'updatedAt' | 'createdAt'> = {
            name: localProduct.name,
            description: localProduct.description || '',
            price: {
              amount: Math.round(localProduct.price * 100), // Convert to öre (Swedish cents)
              currencyId: this.config.currency, // Use configured currency (SEK for Sweden)
            },
            externalReference: localProduct.id?.toString(),
            unitName: 'st', // Swedish unit name
          };

          if (existingProduct) {
            // Update existing product
            await this.updateProduct(existingProduct.uuid!, zettleProduct, existingProduct.etag!);
            results.updated++;
          } else {
            // Create new product
            await this.createProduct(zettleProduct);
            results.created++;
          }
        } catch (error) {
          results.errors.push(`Error syncing product ${localProduct.name}: ${error}`);
        }
      }
    } catch (error) {
      results.errors.push(`General sync error: ${error}`);
    }

    return results;
  }
}

// Factory function to create Zettle API service
export function createZettleService(): ZettleAPIService {
  const config: ZettleConfig = {
    clientId: process.env.ZETTLE_CLIENT_ID || '',
    clientSecret: process.env.ZETTLE_CLIENT_SECRET || '',
    apiUrl: process.env.ZETTLE_API_URL || 'https://oauth.zettle.com',
    environment: ((process.env.ZETTLE_ENVIRONMENT?.trim()) as 'sandbox' | 'production') || 'sandbox',
    currency: process.env.ZETTLE_CURRENCY || 'SEK',
    country: process.env.ZETTLE_COUNTRY || 'SE',
    locale: process.env.ZETTLE_LOCALE || 'sv-SE',
    authMethod: 'oauth',
    productsBaseUrl: process.env.ZETTLE_PRODUCTS_BASE_URL,
    purchasesBaseUrl: process.env.ZETTLE_PURCHASE_BASE_URL,
    organizationId: process.env.ZETTLE_ORGANIZATION_ID,
  };

  if (!config.clientId || !config.clientSecret) {
    throw new Error('Zettle API credentials not configured. Please set ZETTLE_CLIENT_ID and ZETTLE_CLIENT_SECRET environment variables.');
  }

  return new ZettleAPIService(config);
}
