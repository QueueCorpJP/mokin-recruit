interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

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
    this.timeout = options.timeout || 10000; // 10秒
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
        headers: {
          ...this.defaultHeaders,
          ...options.headers,
        },
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    }
  }

  async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    try {
      const response = await this.fetchWithTimeout(url, options);

      let data: any;
      try {
        data = await response.json();
      } catch {
        // JSONパースに失敗した場合
        data = {
          success: response.ok,
          error: response.ok
            ? undefined
            : `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return data;
    } catch (error) {
      return {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  async get<T = any>(
    endpoint: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'GET' });
  }

  async post<T = any>(
    endpoint: string,
    data?: any,
    options: Omit<RequestInit, 'method' | 'body'> = {}
  ): Promise<ApiResponse<T>> {
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
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T = any>(
    endpoint: string,
    options: Omit<RequestInit, 'method'> = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: 'DELETE' });
  }
}

/**
 * ローカルストレージから認証情報を取得
 */
export const getAuthInfo = () => {
  if (typeof window === 'undefined') return null;
  
  const token = localStorage.getItem('auth_token') || 
                localStorage.getItem('auth-token') || 
                localStorage.getItem('supabase-auth-token');
  
  const userInfoStr = localStorage.getItem('user_info');
  let userInfo = null;
  
  if (userInfoStr) {
    try {
      userInfo = JSON.parse(userInfoStr);
    } catch (error) {
      console.warn('Failed to parse user info from localStorage:', error);
    }
  }
  
  return { token, userInfo };
};

/**
 * 現在のユーザーIDを取得
 */
export const getCurrentUserId = (): string | null => {
  const authInfo = getAuthInfo();
  if (!authInfo) return null;
  return authInfo.userInfo?.id || null;
};

/**
 * 現在のユーザータイプを取得
 */
export const getCurrentUserType = (): string | null => {
  const authInfo = getAuthInfo();
  if (!authInfo) return null;
  return authInfo.userInfo?.type || null;
};

/**
 * 企業ユーザーの場合、company_account_idを取得
 */
export const getCompanyAccountId = (): string | null => {
  const authInfo = getAuthInfo();
  if (!authInfo) return null;
  return authInfo.userInfo?.profile?.companyAccountId || null;
};

/**
 * 認証ヘッダーを取得
 */
export const getAuthHeaders = () => {
  const authInfo = getAuthInfo();
  const headers: HeadersInit = {};
  
  if (authInfo?.token) {
    headers['Authorization'] = `Bearer ${authInfo.token}`;
  }
  
  // company_users.idがある場合はヘッダーに追加
  if (authInfo?.userInfo?.id) {
    headers['X-User-Id'] = authInfo.userInfo.id;
  }
  
  return headers;
};

// APIクライアント関数を拡張
const createApiClient = (baseURL: string = '/api') => {
  return {
    // ... existing methods ...
    
    /**
     * 認証付きのGETリクエスト
     */
    getAuth: async (path: string, options: RequestInit = {}) => {
      const authHeaders = getAuthHeaders();
      
      return fetch(`${baseURL}${path}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        ...options,
      });
    },
    
    /**
     * 認証付きのPOSTリクエスト
     */
    postAuth: async (path: string, data?: any, options: RequestInit = {}) => {
      const authHeaders = getAuthHeaders();
      
      return fetch(`${baseURL}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...options.headers,
        },
        body: JSON.stringify(data),
        ...options,
      });
    },
  };
};

// デフォルトインスタンス
export const apiClient = new ApiClient();

// 型定義のエクスポート
export type { ApiResponse, ApiClientOptions };
