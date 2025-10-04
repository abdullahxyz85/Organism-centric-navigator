// API service for connecting to FastAPI backend

const API_BASE_URL = 'http://localhost:8000';

export interface SearchRequest {
  query: string;
  condition?: string;
}

export interface ScientificDetails {
  classification: string;
  response_mechanisms: string[];
  experimental_findings: string;
  applications: string;
}

export interface SearchResponse {
  organism_name: string;
  condition?: string;
  description: string;
  scientific_details: ScientificDetails;
  relevant_chunks: string[];
}

export interface HealthResponse {
  api: string;
  mongodb: string;
  openai: string;
}

export interface TestLLMResponse {
  status: string;
  llm_response: string | null;
  response_length: number;
  is_json: boolean;
  error?: string;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async searchOrganism(request: SearchRequest): Promise<SearchResponse> {
    return this.request<SearchResponse>('/search', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  async testLLM(): Promise<TestLLMResponse> {
    return this.request<TestLLMResponse>('/test-llm');
  }

  async getRoot(): Promise<{ message: string; status: string }> {
    return this.request<{ message: string; status: string }>('/');
  }
}

// Export singleton instance
export const apiService = new APIService();

// Export for testing with custom base URL
export const createAPIService = (baseURL: string) => new APIService(baseURL);
