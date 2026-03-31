/**
 * Paypack Payment Service
 * Handles all payment operations via Paypack API
 */

import crypto from 'crypto';

interface PaypackConfig {
  clientId: string;
  clientSecret: string;
  webhookSecret: string;
  baseUrl: string;
  environment: 'development' | 'production';
}

interface TokenCache {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface CashinRequest {
  amount: number;
  number: string;
  idempotencyKey?: string;
}

interface CashinResponse {
  amount: number;
  created_at: string;
  kind: 'CASHIN';
  ref: string;
  status: 'pending' | 'success' | 'failed';
  instructions?: string;
  user_message?: string;
}

interface TransactionStatus {
  ref: string;
  amount: number;
  client: string;
  fee: number;
  kind: 'CASHIN' | 'CASHOUT';
  merchant: string;
  status: 'pending' | 'successful' | 'failed';
  timestamp: string;
}

export type NormalizedPaymentStatus = 'pending' | 'successful' | 'failed';

export class PaypackService {
  private tokenCache: TokenCache | null = null;
  private config: PaypackConfig;

  constructor(config: PaypackConfig) {
    this.config = config;
  }

  /**
   * Generate unique idempotency key
   */
  private generateIdempotencyKey(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  /**
   * Normalize Paypack status variants to our DB enum values
   */
  normalizeStatus(status?: string): NormalizedPaymentStatus {
    const value = (status || '').toLowerCase().trim();

    if (value === 'success' || value === 'successful') {
      return 'successful';
    }

    if (
      value === 'fail' ||
      value === 'failed' ||
      value === 'error' ||
      value === 'cancelled' ||
      value === 'canceled'
    ) {
      return 'failed';
    }

    return 'pending';
  }

  /**
   * Authenticate and get access token
   */
  async getAccessToken(): Promise<string> {
    // Return cached token if still valid (with 1 minute buffer)
    if (
      this.tokenCache &&
      this.tokenCache.expiresAt > Date.now() + 60000
    ) {
      return this.tokenCache.accessToken;
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/auth/agents/authorize`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            client_id: this.config.clientId,
            client_secret: this.config.clientSecret,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Paypack auth failed: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        access: string;
        refresh: string;
        expires?: number;
      };
      const expiresIn = data.expires || 900000; // 15 minutes default

      this.tokenCache = {
        accessToken: data.access,
        refreshToken: data.refresh,
        expiresAt: Date.now() + expiresIn,
      };

      return data.access;
    } catch (error) {
      console.error('Failed to get Paypack access token:', error);
      throw error;
    }
  }

  /**
   * Refresh access token
   */
  async refreshAccessToken(): Promise<string> {
    if (!this.tokenCache) {
      return this.getAccessToken();
    }

    try {
      const response = await fetch(
        `${this.config.baseUrl}/auth/agents/refresh/${this.tokenCache.refreshToken}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.statusText}`);
      }

      const data = (await response.json()) as {
        access: string;
        refresh: string;
        expires?: number;
      };
      const expiresIn = data.expires || 900000;

      this.tokenCache = {
        accessToken: data.access,
        refreshToken: data.refresh,
        expiresAt: Date.now() + expiresIn,
      };

      return data.access;
    } catch (error) {
      console.error('Failed to refresh Paypack token:', error);
      // Fall back to getting new token
      return this.getAccessToken();
    }
  }

  /**
   * Initiate a CASHIN transaction (deposit from mobile money)
   */
  async initiatePayment(request: CashinRequest): Promise<CashinResponse> {
    const token = await this.getAccessToken();
    const idempotencyKey = request.idempotencyKey || this.generateIdempotencyKey();

    try {
      const response = await fetch(
        `${this.config.baseUrl}/transactions/cashin`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: `Bearer ${token}`,
            'Idempotency-Key': idempotencyKey,
            'X-Webhook-Mode': this.config.environment,
          },
          body: JSON.stringify({
            amount: request.amount,
            number: request.number,
          }),
        }
      );

      if (!response.ok) {
        const error = (await response.json()) as any;
        throw new Error(
          `CASHIN request failed: ${JSON.stringify(error)}`
        );
      }

      const data = (await response.json()) as CashinResponse;
      return data;
    } catch (error) {
      console.error('Failed to initiate payment:', error);
      throw error;
    }
  }

  /**
   * Get transaction status
   */
  async getTransactionStatus(ref: string): Promise<TransactionStatus> {
    const token = await this.getAccessToken();

    try {
      console.log(`Fetching Paypack status for ref: ${ref}`);
      const response = await fetch(
        `${this.config.baseUrl}/transactions/find/${ref}`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('NOT_FOUND');
        }
        throw new Error(`Failed to get transaction status: ${response.statusText}`);
      }

      const rawData = await response.json() as any;
      console.log('Raw Paypack response:', JSON.stringify(rawData));

      // Paypack sometimes wraps the response in a data property or returns it directly
      const data = (rawData?.data || rawData) as TransactionStatus;
      
      if (!data || (!data.status && !data.ref)) {
        throw new Error('Invalid response structure from Paypack');
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.message !== 'NOT_FOUND') {
        console.error('Failed to fetch transaction status:', error);
      }
      throw error;
    }
  }

  /**
   * List transactions with optional filters
   */
  async listTransactions(filters?: {
    status?: string;
    client?: string;
    ref?: string;
    kind?: 'CASHIN' | 'CASHOUT';
  }): Promise<any> {
    const token = await this.getAccessToken();

    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.client) params.append('client', filters.client);
    if (filters?.ref) params.append('ref', filters.ref);
    if (filters?.kind) params.append('kind', filters.kind);

    const url = `${this.config.baseUrl}/events/transactions${
      params.toString() ? '?' + params.toString() : ''
    }`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to list transactions: ${response.statusText}`);
      }

      const data = (await response.json()) as any;
      return data;
    } catch (error) {
      console.error('Failed to list transactions:', error);
      throw error;
    }
  }

  /**
   * Verify webhook signature
   * This ensures the webhook is actually from Paypack
   */
  verifyWebhookSignature(payload: string, signature: string): boolean {
    try {
      const base64Hash = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('base64');

      const hexHash = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payload)
        .digest('hex');

      const normalizedSignature = signature.replace(/^sha256=/i, '').trim();

      return (
        normalizedSignature === base64Hash ||
        normalizedSignature === hexHash
      );
    } catch (error) {
      console.error('Failed to verify webhook signature:', error);
      return false;
    }
  }

  /**
   * Parse and validate webhook payload
   */
  parseWebhookPayload(payload: any): {
    transactionRef: string;
    status: NormalizedPaymentStatus;
    amount: number;
    clientNumber: string;
    fee: number;
  } {
    try {
      const transaction = (payload?.data || payload) as any;

      if (!transaction?.ref) {
        throw new Error('Missing transaction reference in webhook');
      }

      return {
        transactionRef: transaction.ref as string,
        status: this.normalizeStatus(transaction.status),
        amount: transaction.amount as number,
        clientNumber: transaction.client as string,
        fee: transaction.fee || 0,
      };
    } catch (error) {
      console.error('Failed to parse webhook payload:', error);
      throw error;
    }
  }
}

/**
 * Factory function to create Paypack service
 */
export function createPaypackService(): PaypackService {
  const clientId = process.env.PAYPACK_CLIENT_ID;
  const clientSecret = process.env.PAYPACK_CLIENT_SECRET;
  const webhookSecret = process.env.PAYPACK_WEBHOOK_SECRET;
  const baseUrl = process.env.PAYPACK_BASE_URL;
  const environment = process.env.PAYPACK_ENVIRONMENT;

  if (!clientId || !clientSecret || !webhookSecret || !baseUrl) {
    throw new Error('Missing Paypack configuration. Check environment variables.');
  }

  const config: PaypackConfig = {
    clientId,
    clientSecret,
    webhookSecret,
    baseUrl,
    environment: environment === 'development' ? 'development' : 'production',
  };

  return new PaypackService(config);
}
