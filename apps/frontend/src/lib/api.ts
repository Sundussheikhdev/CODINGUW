import { Company, Document, Notification, InvestabilityScore, CreateCompanyData, KycData, FinancialsData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiClient {
  private baseUrl: string;
  private userEmail: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.userEmail = 'demo@example.com'; // For demo purposes
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Only set Content-Type for requests with a body
    const hasBody = options.body !== undefined;
    const headers: Record<string, string> = {
      'x-user-email': this.userEmail,
      ...options.headers,
    };
    
    if (hasBody) {
      headers['Content-Type'] = 'application/json';
    }
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    // Handle 204 No Content responses
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();
    return data.data || data;
  }

  // Company endpoints
  async createCompany(data: CreateCompanyData): Promise<Company> {
    return this.request<Company>('/api/company', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCompany(): Promise<Company> {
    return this.request<Company>('/api/company');
  }

  // KYC endpoints
  async verifyKyc(data: KycData): Promise<{ verified: boolean; company: Company }> {
    return this.request<{ verified: boolean; company: Company }>('/api/kyc/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Financials endpoints
  async linkFinancials(data: FinancialsData): Promise<{ financials_linked: boolean; company: Company }> {
    return this.request<{ financials_linked: boolean; company: Company }>('/api/financials/link', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Files endpoints
  async uploadFile(file: File, companyId: string): Promise<Document> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('companyId', companyId);

    const response = await fetch(`${this.baseUrl}/api/files`, {
      method: 'POST',
      headers: {
        'x-user-email': this.userEmail,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`File upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.data;
  }

  async getFiles(): Promise<Document[]> {
    return this.request<Document[]>('/api/files');
  }

  // Score endpoints
  async getScore(): Promise<InvestabilityScore> {
    return this.request<InvestabilityScore>('/api/score');
  }

  // Notifications endpoints
  async getNotifications(): Promise<Notification[]> {
    return this.request<Notification[]>('/api/notifications');
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.request(`/api/notifications/${id}/read`, {
      method: 'PATCH',
    });
  }

  async markAllNotificationsAsRead(): Promise<void> {
    await this.request('/api/notifications/read-all', {
      method: 'PATCH',
    });
  }
}

export const apiClient = new ApiClient();