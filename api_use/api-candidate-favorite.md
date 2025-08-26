# 候補者お気に入り求人API

## 基本情報
- **エンドポイント**: `/api/candidate/favorite`
- **目的**: 候補者が求人をお気に入りに追加・削除・一覧取得する機能
- **認証**: 必要（候補者のJWTトークン）

## 機能概要
このAPIは、認証された候補者が求人をお気に入りに追加、削除、および一覧取得を行います。お気に入りに追加した求人の詳細情報も含めて返却し、候補者の求人検索・応募活動をサポートします。

## API一覧

### 1. お気に入り一覧取得 (GET)

#### HTTPメソッド
`GET`

#### リクエストヘッダー
```
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

#### クエリパラメータ
```
?page=number&limit=number
```

##### パラメータ詳細
- **page**: ページ番号
  - オプション
  - デフォルト: 1
  - 例: `1`, `2`, `3`
- **limit**: 1ページあたりの件数
  - オプション
  - デフォルト: 20
  - 最大: 50

#### リクエスト例
```
GET /api/candidate/favorite
GET /api/candidate/favorite?page=1&limit=10
GET /api/candidate/favorite?page=2
```

#### 成功時レスポンス（200 OK）
```json
{
  "success": true,
  "favorites": [
    {
      "id": "string",
      "created_at": "string (ISO date)",
      "job_posting_id": "string",
      "job_postings": {
        "id": "string",
        "title": "string",
        "position_summary": "string",
        "job_description": "string",
        "salary_min": number,
        "salary_max": number,
        "employment_type": "string",
        "work_location": "string[]",
        "remote_work_available": boolean,
        "job_type": "string[]",
        "industry": "string[]",
        "application_deadline": "string (ISO date)",
        "created_at": "string (ISO date)",
        "updated_at": "string (ISO date)",
        "status": "string",
        "company_account_id": "string",
        "company_accounts": {
          "company_name": "string",
          "industry": "string"
        }
      }
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  }
}
```

### 2. お気に入り追加 (POST)

#### HTTPメソッド
`POST`

#### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

#### リクエストボディ
```json
{
  "job_posting_id": "string (required)"
}
```

##### パラメータ詳細
- **job_posting_id**: 求人投稿ID
  - 必須
  - 公開中（PUBLISHED）の求人のみ追加可能

#### リクエスト例
```json
{
  "job_posting_id": "12345678-1234-5678-9012-123456789012"
}
```

#### 成功時レスポンス（201 Created）
```json
{
  "success": true,
  "message": "お気に入りに追加しました",
  "favorite": {
    "id": "string",
    "created_at": "string (ISO date)",
    "job_posting_id": "string",
    "job_postings": {
      "id": "string",
      "title": "string",
      "position_summary": "string",
      "company_accounts": {
        "company_name": "string"
      }
    }
  }
}
```

### 3. お気に入り削除 (DELETE)

#### HTTPメソッド
`DELETE`

#### リクエストヘッダー
```
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

#### クエリパラメータ
```
?job_posting_id=string
```

##### パラメータ詳細
- **job_posting_id**: 削除する求人投稿ID
  - 必須

#### リクエスト例
```
DELETE /api/candidate/favorite?job_posting_id=12345678-1234-5678-9012-123456789012
```

#### 成功時レスポンス（200 OK）
```json
{
  "success": true,
  "message": "お気に入りから削除しました"
}
```

## エラーレスポンス

### 認証エラー（401 Unauthorized）
```json
{
  "success": false,
  "error": "認証トークンが無効です"
}
```

### バリデーションエラー（400 Bad Request）
```json
{
  "success": false,
  "error": "求人IDは必須です",
  "errors": [
    {
      "field": "job_posting_id",
      "message": "求人IDは必須です"
    }
  ]
}
```

### 求人が見つからない（404 Not Found）
```json
{
  "success": false,
  "error": "指定された求人が見つからないか、公開されていません"
}
```

### 重複エラー（409 Conflict）
```json
{
  "success": false,
  "error": "この求人は既にお気に入りに追加されています"
}
```

### サーバーエラー（500 Internal Server Error）
```json
{
  "success": false,
  "error": "サーバーエラーが発生しました"
}
```

## フロントエンドでの使用方法

### 期待される処理フロー
1. 候補者のログイン状態を確認
2. お気に入り一覧の表示、追加・削除操作を実行
3. 適切なエラーハンドリングとユーザーフィードバック
4. お気に入り状態の管理と UI への反映

### TypeScript型定義
```typescript
interface FavoriteItem {
  id: string;
  created_at: string;
  job_posting_id: string;
  job_postings: {
    id: string;
    title: string;
    position_summary: string;
    job_description: string;
    salary_min: number;
    salary_max: number;
    employment_type: string;
    work_location: string[];
    remote_work_available: boolean;
    job_type: string[];
    industry: string[];
    application_deadline: string;
    created_at: string;
    updated_at: string;
    status: string;
    company_account_id: string;
    company_accounts: {
      company_name: string;
      industry: string;
    };
  };
}

interface FavoriteListResponse {
  success: boolean;
  favorites?: FavoriteItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
}

interface FavoriteAddResponse {
  success: boolean;
  message?: string;
  favorite?: {
    id: string;
    created_at: string;
    job_posting_id: string;
    job_postings: {
      id: string;
      title: string;
      position_summary: string;
      company_accounts: {
        company_name: string;
      };
    };
  };
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

interface FavoriteDeleteResponse {
  success: boolean;
  message?: string;
  error?: string;
}
```

### 基本的なAPI関数実装例
```typescript
const getFavorites = async (params: {
  page?: number;
  limit?: number;
} = {}): Promise<FavoriteListResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = `/api/candidate/favorite${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'ネットワークエラーが発生しました',
    };
  }
};

const addToFavorites = async (jobPostingId: string): Promise<FavoriteAddResponse> => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch('/api/candidate/favorite', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ job_posting_id: jobPostingId }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'ネットワークエラーが発生しました',
    };
  }
};

const removeFromFavorites = async (jobPostingId: string): Promise<FavoriteDeleteResponse> => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`/api/candidate/favorite?job_posting_id=${jobPostingId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: 'ネットワークエラーが発生しました',
    };
  }
};
```

### React Hookの実装例
```typescript
const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [pagination, setPagination] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadFavorites = useCallback(async (page = 1, limit = 20) => {
    setIsLoading(true);
    setError('');

    const result = await getFavorites({ page, limit });

    if (result.success) {
      setFavorites(result.favorites || []);
      setPagination(result.pagination || null);
    } else {
      setError(result.error || 'お気に入りの取得に失敗しました');
    }

    setIsLoading(false);
  }, []);

  const addFavorite = useCallback(async (jobPostingId: string) => {
    const result = await addToFavorites(jobPostingId);
    
    if (result.success) {
      // お気に入り一覧を再読み込み
      await loadFavorites();
      return { success: true, message: result.message };
    } else {
      return { success: false, error: result.error };
    }
  }, [loadFavorites]);

  const removeFavorite = useCallback(async (jobPostingId: string) => {
    const result = await removeFromFavorites(jobPostingId);
    
    if (result.success) {
      // お気に入り一覧を再読み込み
      await loadFavorites();
      return { success: true, message: result.message };
    } else {
      return { success: false, error: result.error };
    }
  }, [loadFavorites]);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  return {
    favorites,
    pagination,
    isLoading,
    error,
    loadFavorites,
    addFavorite,
    removeFavorite,
  };
};
```

### お気に入り一覧コンポーネント例
```typescript
const FavoritesList = () => {
  const { favorites, pagination, isLoading, error, loadFavorites, removeFavorite } = useFavorites();
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadFavorites(page);
  };

  const handleRemoveFavorite = async (jobPostingId: string, jobTitle: string) => {
    if (confirm(`「${jobTitle}」をお気に入りから削除しますか？`)) {
      const result = await removeFavorite(jobPostingId);
      
      if (result.success) {
        alert(result.message);
      } else {
        alert(`エラー: ${result.error}`);
      }
    }
  };

  if (isLoading) {
    return <div className="loading">お気に入りを読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  if (favorites.length === 0) {
    return (
      <div className="empty-state">
        <p>お気に入りに追加した求人はありません。</p>
        <a href="/candidate/search">求人を探す</a>
      </div>
    );
  }

  return (
    <div className="favorites-list">
      <h2>お気に入り求人一覧</h2>
      
      <div className="favorites-grid">
        {favorites.map((favorite) => (
          <div key={favorite.id} className="favorite-card">
            <div className="job-header">
              <h3>{favorite.job_postings.title}</h3>
              <button
                className="remove-btn"
                onClick={() => handleRemoveFavorite(
                  favorite.job_posting_id, 
                  favorite.job_postings.title
                )}
              >
                ♥ お気に入りから削除
              </button>
            </div>
            
            <div className="company-info">
              <span>{favorite.job_postings.company_accounts.company_name}</span>
              <span>{favorite.job_postings.industry.join(', ')}</span>
            </div>
            
            <div className="job-summary">
              <p>{favorite.job_postings.position_summary}</p>
            </div>
            
            <div className="job-details">
              <div className="salary">
                {favorite.job_postings.salary_min && favorite.job_postings.salary_max && (
                  <span>
                    年収: {favorite.job_postings.salary_min.toLocaleString()}〜
                    {favorite.job_postings.salary_max.toLocaleString()}万円
                  </span>
                )}
              </div>
              
              <div className="location">
                勤務地: {favorite.job_postings.work_location.join(', ')}
                {favorite.job_postings.remote_work_available && (
                  <span className="remote-badge">リモート可</span>
                )}
              </div>
              
              <div className="employment-type">
                雇用形態: {favorite.job_postings.employment_type}
              </div>
            </div>
            
            <div className="job-actions">
              <a 
                href={`/candidate/job/${favorite.job_posting_id}`}
                className="view-detail-btn"
              >
                詳細を見る
              </a>
              <button className="apply-btn">
                応募する
              </button>
            </div>
            
            <div className="favorite-date">
              お気に入り追加日: {new Date(favorite.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            前のページ
          </button>
          
          <span>
            {currentPage} / {pagination.totalPages} ページ
            （全 {pagination.total} 件）
          </span>
          
          <button
            disabled={currentPage === pagination.totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            次のページ
          </button>
        </div>
      )}
    </div>
  );
};
```

### お気に入りボタンコンポーネント例
```typescript
const FavoriteButton = ({ jobPostingId, initialIsFavorite = false }: {
  jobPostingId: string;
  initialIsFavorite?: boolean;
}) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = async () => {
    setIsLoading(true);

    try {
      if (isFavorite) {
        const result = await removeFromFavorites(jobPostingId);
        if (result.success) {
          setIsFavorite(false);
          alert(result.message);
        } else {
          alert(`エラー: ${result.error}`);
        }
      } else {
        const result = await addToFavorites(jobPostingId);
        if (result.success) {
          setIsFavorite(true);
          alert(result.message);
        } else {
          alert(`エラー: ${result.error}`);
        }
      }
    } catch (error) {
      alert('エラーが発生しました');
    }

    setIsLoading(false);
  };

  return (
    <button
      className={`favorite-btn ${isFavorite ? 'favorited' : ''}`}
      onClick={handleToggleFavorite}
      disabled={isLoading}
    >
      {isLoading ? '処理中...' : (
        isFavorite ? '♥ お気に入り済み' : '♡ お気に入りに追加'
      )}
    </button>
  );
};
```

### お気に入り状態チェック用Hook
```typescript
const useFavoriteStatus = (jobPostingId: string) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const result = await getFavorites();
        if (result.success && result.favorites) {
          const favoriteExists = result.favorites.some(
            fav => fav.job_posting_id === jobPostingId
          );
          setIsFavorite(favoriteExists);
        }
      } catch (error) {
        console.error('お気に入り状態の確認に失敗:', error);
      }
      setIsLoading(false);
    };

    if (jobPostingId) {
      checkFavoriteStatus();
    }
  }, [jobPostingId]);

  return { isFavorite, isLoading, setIsFavorite };
};
```

## エラーハンドリング
- 認証トークンが無効または未提供の場合は401エラー
- 必須パラメータが不足している場合は400エラー
- 求人が見つからない場合は404エラー
- 重複したお気に入り追加は409エラー
- サーバーエラーは500ステータス
- フロントエンドでは適切にエラーメッセージを表示すること

## セキュリティ考慮事項
- 認証されたユーザーは自分のお気に入りのみ操作可能
- 公開中（PUBLISHED）の求人のみお気に入りに追加可能
- セッション検証により、候補者IDの整合性をチェック
- HTTPS必須

## パフォーマンス考慮事項
- お気に入り一覧はページネーション実装により大量データに対応
- 求人詳細情報は必要最小限のフィールドのみ取得
- 適切なデータベースインデックスにより検索性能を最適化
- お気に入り状態のクライアントサイドキャッシュを推奨

## 使用シナリオ
1. **求人詳細ページ**: お気に入りボタンによる追加・削除
2. **お気に入り一覧ページ**: 保存した求人の閲覧・管理
3. **求人検索結果**: 検索結果からのお気に入り追加
4. **求人比較機能**: 複数求人のお気に入り登録による比較検討
5. **応募前の整理**: お気に入りから応募する求人を選択

## 注意事項
- お気に入りは候補者ごとに個別管理される
- 公開停止された求人はお気に入り一覧に表示されない
- お気に入り追加時は重複チェックが自動実行される
- 削除時は確認ダイアログの表示を推奨
- お気に入り数に上限は設けていないが、UIでの表示性能を考慮すること 