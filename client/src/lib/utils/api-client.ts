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
 * ローカルストレージから認証情報を取得（クッキーベース認証では使用しない）
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
 * クッキーから認証トークンを取得
 */
export const getCookieToken = (): string | null => {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'supabase-auth-token') {
      return decodeURIComponent(value);
    }
  }
  return null;
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
 * 認証ヘッダーを取得（クッキーベース認証対応）
 */
export const getAuthHeaders = () => {
  // まずクッキーからトークンを取得
  let token = getCookieToken();
  
  // クッキーにない場合はlocalStorageから取得（後方互換性のため）
  if (!token) {
    const authInfo = getAuthInfo();
    token = authInfo?.token || null;
  }
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // company_users.idがある場合はヘッダーに追加（localStorageベースの場合のみ）
  const authInfo = getAuthInfo();
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

interface JobSearchParams {
  keyword?: string;
  location?: string;
  salaryMin?: string;
  industries?: string[];
  jobTypes?: string[];
  page?: number;
  limit?: number;
}

interface JobSearchResponse {
  success: boolean;
  data?: {
    jobs: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  error?: string;
}

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResponse> {
  try {
    const authHeaders = getAuthHeaders();
    const searchParams = new URLSearchParams();
    
    if (params.keyword) searchParams.append('keyword', params.keyword);
    if (params.location) searchParams.append('location', params.location);
    if (params.salaryMin) searchParams.append('salaryMin', params.salaryMin);
    if (params.industries?.length) searchParams.append('industries', params.industries.join(','));
    if (params.jobTypes?.length) searchParams.append('jobTypes', params.jobTypes.join(','));
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());

    const response = await fetch(`/api/candidate/job/search?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });
    return await response.json();
  } catch (error) {
    console.error('Failed to search jobs:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました'
    };
  }
}

// お気に入り機能API関数
interface FavoriteResponse {
  success: boolean;
  data?: {
    favorites: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  favorite?: any;
  message?: string;
  error?: string;
  debug?: {
    hasAuthHeader?: boolean;
    hasCookieToken?: boolean;
    validationError?: string;
    authResult?: any;
    jobPostingId?: string;
    jobExists?: boolean;
    jobStatus?: string;
    errorCode?: string;
  };
}

/**
 * お気に入り一覧を取得
 */
export async function getFavorites(page: number = 1, limit: number = 20): Promise<FavoriteResponse> {
  try {
    const authHeaders = getAuthHeaders();
    const searchParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    });

    const response = await fetch(`/api/candidate/favorite?${searchParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to get favorites:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました'
    };
  }
}

/**
 * お気に入りに追加
 */
export async function addToFavorites(jobPostingId: string): Promise<FavoriteResponse> {
  try {
    const authHeaders = getAuthHeaders();
    
    console.log('お気に入り追加API呼び出し:', {
      jobPostingId,
      hasAuthHeaders: Object.keys(authHeaders).length > 0,
      authHeaders: Object.keys(authHeaders)
    });

    const response = await fetch('/api/candidate/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
      body: JSON.stringify({
        job_posting_id: jobPostingId
      }),
    });

    console.log('API応答ステータス:', response.status);
    
    const result = await response.json();
    console.log('API応答内容:', result);
    
    return result;
  } catch (error) {
    console.error('Failed to add to favorites:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました'
    };
  }
}

/**
 * お気に入りから削除
 */
export async function removeFromFavorites(jobPostingId: string): Promise<FavoriteResponse> {
  try {
    const authHeaders = getAuthHeaders();

    const response = await fetch(`/api/candidate/favorite?job_posting_id=${jobPostingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders,
      },
    });

    return await response.json();
  } catch (error) {
    console.error('Failed to remove from favorites:', error);
    return {
      success: false,
      error: 'ネットワークエラーが発生しました'
    };
  }
}

/**
 * お気に入り状態を確認（複数の求人ID）
 */
export async function checkFavoriteStatus(jobPostingIds: string[]): Promise<Record<string, boolean>> {
  try {
    const authHeaders = getAuthHeaders();
    
    // お気に入り一覧を取得してIDリストを作成
    const favorites = await getFavorites(1, 100); // 最大100件取得
    
    if (!favorites.success || !favorites.data) {
      return {};
    }

    const favoriteJobIds = new Set(
      favorites.data.favorites.map(fav => fav.job_posting_id)
    );

    const result: Record<string, boolean> = {};
    jobPostingIds.forEach(id => {
      result[id] = favoriteJobIds.has(id);
    });

    return result;
  } catch (error) {
    console.error('Failed to check favorite status:', error);
    return {};
  }
}

// デフォルトインスタンス
export const apiClient = new ApiClient();

// 型定義のエクスポート
export type { ApiResponse, ApiClientOptions };
