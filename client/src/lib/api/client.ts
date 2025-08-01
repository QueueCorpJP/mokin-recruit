// import { authStore } from '../../stores/authStore'; // 現在未使用
import { 
  createErrorFromResponse, 
  createErrorFromException
} from '../errors/errorHandler';
import type { AppError, ApiResponse } from '../errors/types';

interface ApiClientOptions {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

class ApiClient {
  private baseURL: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(options: ApiClientOptions = {}) {
    this.baseURL = options.baseURL || '/api';
    this.timeout = options.timeout || 10000;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {}
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        credentials: 'include', // Cookie-based認証のため
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw createErrorFromException(error);
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await this.fetchWithTimeout(url, options);

      // レスポンスが成功でない場合
      if (!response.ok) {
        throw await createErrorFromResponse(response);
      }

      // レスポンスボディが空の場合
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return response.text() as T;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error && !(error.name === 'AppError')) {
        throw createErrorFromException(error);
      }
      throw error;
    }
  }

  async get<T = any>(
    endpoint: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(
    endpoint: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

// デフォルトインスタンス
export const apiClient = new ApiClient();

// React Query用のカスタムfetcher
export const createQueryFn = <T>(endpoint: string, options?: RequestInit) => {
  return async (): Promise<T> => {
    return apiClient.get<T>(endpoint, options);
  };
};

// Mutation用のカスタムfetcher
export const createMutationFn = <TData, TVariables = void>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST'
) => {
  return async (variables: TVariables): Promise<TData> => {
    switch (method) {
      case 'POST':
        return apiClient.post<TData>(endpoint, variables);
      case 'PUT':
        return apiClient.put<TData>(endpoint, variables);
      case 'PATCH':
        return apiClient.patch<TData>(endpoint, variables);
      case 'DELETE':
        return apiClient.delete<TData>(endpoint);
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  };
};

// 認証が必要なエンドポイント用のインターセプター
export const createAuthenticatedApiClient = () => {
  return new ApiClient({
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export default apiClient;