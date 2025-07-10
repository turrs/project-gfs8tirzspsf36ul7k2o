import { config } from './config';

class ApiClient {
  constructor() {
    this.baseURL = config.api.baseUrl;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('supabase.auth.token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config); 
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Authentication endpoints
  async register(email, password, walletAddress = null) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, wallet_address: walletAddress }),
    });
  }

  async login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getProfile() {
    return this.request('/auth/profile');
  }

  async updateProfile(walletAddress) {
    return this.request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify({ wallet_address: walletAddress }),
    });
  }

  // Transaction endpoints
  async getRecentTransactions() {
    return this.request('/transactions/recent');
  }

  async getUserTransactions() {
    return this.request('/transactions/user');
  }

  async createTransaction(transactionData) {
    const response = await this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData),
    });
    return response;
  }

  async updateTransaction(id, updateData) {
    return this.request(`/transactions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updateData),
    });
  }

  async getTransaction(id) {
    return this.request(`/transactions/${id}`);
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient(); 