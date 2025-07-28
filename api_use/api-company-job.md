# 企業求人一覧API

## 基本情報
- **エンドポイント**: `GET /api/company/job`
- **目的**: 企業が投稿した求人一覧の取得とフィルタリング
- **認証**: 必要（企業ユーザーのJWTトークン）

## 機能概要
このAPIは、認証された企業ユーザーが自社で投稿した求人一覧を取得します。ステータス、グループ、キーワード検索など、様々なフィルタリング機能を提供します。

## リクエスト

### HTTPメソッド
`GET`

### リクエストヘッダー
```
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
```

### クエリパラメータ
```
?status=string&groupId=string&scope=string&search=string
```

#### パラメータ詳細
- **status**: 求人のステータスでフィルタリング
  - オプション
  - 例: `published`, `draft`, `closed`
- **groupId**: 特定のグループIDでフィルタリング
  - オプション
  - 企業内のグループIDを指定
- **scope**: 検索範囲の指定
  - オプション
  - 例: `all`, `active`, `inactive`
- **search**: キーワード検索
  - オプション
  - 求人タイトルや説明文から検索

### リクエスト例
```
GET /api/company/job
GET /api/company/job?status=published
GET /api/company/job?status=published&groupId=group-123
GET /api/company/job?search=エンジニア&status=published
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "jobs": [
    {
      "id": "string",
      "title": "string",
      "job_description": "string",
      "required_skills": "string",
      "preferred_skills": "string",
      "salary_min": number,
      "salary_max": number,
      "employment_type": "string",
      "work_location": "string",
      "remote_work_available": boolean,
      "job_type": "string",
      "industry": "string",
      "status": "string",
      "application_deadline": "string (ISO date)",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)",
      "published_at": "string (ISO date)",
      "position_summary": "string",
      "salary_note": "string",
      "location_note": "string",
      "employment_type_note": "string",
      "working_hours": "string",
      "overtime_info": "string",
      "holidays": "string",
      "selection_process": "string",
      "appeal_points": "string",
      "smoking_policy": "string",
      "smoking_policy_note": "string",
      "required_documents": "string",
      "internal_memo": "string",
      "publication_type": "string",
      "image_urls": ["string"],
      "group_id": "string",
      "created_by": "string",
      "company_account_id": "string"
    }
  ],
  "pagination": {
    "total": number,
    "page": number,
    "limit": number,
    "totalPages": number
  },
  "filters": {
    "status": "string",
    "groupId": "string",
    "scope": "string",
    "search": "string"
  }
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "error": "認証トークンがありません"
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "error": "企業アカウント情報の取得に失敗しました"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "error": "サーバーエラーが発生しました"
}
```

## フロントエンドでの使用方法

### 期待される処理フロー
1. 企業ユーザーのログイン状態を確認
2. 必要に応じてフィルタパラメータを設定
3. APIにGETリクエストを送信
4. 求人一覧を取得して表示
5. ページネーションやフィルタリング機能を提供

### 基本的な実装例（JavaScript/TypeScript）
```typescript
interface JobPosting {
  id: string;
  title: string;
  job_description: string;
  status: string;
  created_at: string;
  updated_at: string;
  // その他のプロパティ...
}

interface JobListResponse {
  success: boolean;
  jobs?: JobPosting[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  filters?: {
    status?: string;
    groupId?: string;
    scope?: string;
    search?: string;
  };
  error?: string;
}

const fetchCompanyJobs = async (params: {
  status?: string;
  groupId?: string;
  scope?: string;
  search?: string;
} = {}): Promise<JobListResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    
    // クエリパラメータを構築
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    const url = `/api/company/job${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        jobs: data.jobs,
        pagination: data.pagination,
        filters: data.filters,
      };
    } else {
      return {
        success: false,
        error: data.error,
      };
    }
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
const useCompanyJobs = (initialFilters = {}) => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [pagination, setPagination] = useState(null);
  const [filters, setFilters] = useState(initialFilters);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = useCallback(async (newFilters = {}) => {
    setIsLoading(true);
    setError('');

    const currentFilters = { ...filters, ...newFilters };
    const result = await fetchCompanyJobs(currentFilters);

    if (result.success) {
      setJobs(result.jobs || []);
      setPagination(result.pagination || null);
      setFilters(currentFilters);
    } else {
      setError(result.error || '求人の取得に失敗しました');
    }

    setIsLoading(false);
  }, [filters]);

  useEffect(() => {
    loadJobs();
  }, []);

  return {
    jobs,
    pagination,
    filters,
    isLoading,
    error,
    refetch: loadJobs,
    updateFilters: (newFilters: any) => loadJobs(newFilters),
  };
};
```

### フィルタリング機能付きコンポーネント例
```typescript
const JobListPage = () => {
  const { jobs, pagination, isLoading, error, updateFilters } = useCompanyJobs();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      search: searchTerm,
      status: statusFilter,
      groupId: groupFilter,
    });
  };

  if (isLoading) {
    return <div>求人を読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  return (
    <div>
      <form onSubmit={handleSearch} className="filters">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="キーワード検索"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">全てのステータス</option>
          <option value="published">公開中</option>
          <option value="draft">下書き</option>
          <option value="closed">募集終了</option>
        </select>
        <button type="submit">検索</button>
      </form>

      <div className="job-list">
        {jobs.map((job) => (
          <div key={job.id} className="job-card">
            <h3>{job.title}</h3>
            <p>{job.position_summary}</p>
            <div className="job-meta">
              <span>ステータス: {job.status}</span>
              <span>作成日: {new Date(job.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {pagination && (
        <div className="pagination">
          <span>{pagination.total}件中 {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}件を表示</span>
        </div>
      )}
    </div>
  );
};
```

### 高度な検索機能付きの実装例
```typescript
const AdvancedJobFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    groupId: '',
    employment_type: '',
    remote_work_available: '',
    salary_min: '',
    salary_max: '',
  });

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  return (
    <div className="advanced-filters">
      <input
        type="text"
        value={filters.search}
        onChange={(e) => handleFilterChange('search', e.target.value)}
        placeholder="キーワード検索"
      />
      
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="">全てのステータス</option>
        <option value="published">公開中</option>
        <option value="draft">下書き</option>
        <option value="closed">募集終了</option>
      </select>

      <select
        value={filters.employment_type}
        onChange={(e) => handleFilterChange('employment_type', e.target.value)}
      >
        <option value="">雇用形態</option>
        <option value="full_time">正社員</option>
        <option value="part_time">パート・アルバイト</option>
        <option value="contract">契約社員</option>
        <option value="freelance">フリーランス</option>
      </select>

      <select
        value={filters.remote_work_available}
        onChange={(e) => handleFilterChange('remote_work_available', e.target.value)}
      >
        <option value="">リモートワーク</option>
        <option value="true">可能</option>
        <option value="false">不可</option>
      </select>
    </div>
  );
};
```

## エラーハンドリング
- 認証トークンが無効または未提供の場合は401エラー
- 企業アカウント情報の取得に失敗した場合は400エラー
- サーバーエラーは500ステータス
- 無効なフィルタパラメータは無視される
- フロントエンドでは適切にエラーメッセージを表示すること

## パフォーマンス考慮事項
- 大量の求人がある場合はページネーションを実装
- フィルタリングはサーバーサイドで実行
- 適切なインデックスによりデータベース検索を最適化
- レスポンスキャッシュの実装を推奨

## セキュリティ考慮事項
- 認証されたユーザーは自社の求人のみ取得可能
- セッション検証により、メールアドレスとユーザーIDの整合性をチェック
- HTTPS必須
- 機密情報（内部メモなど）は適切に管理

## 使用シナリオ
1. **求人管理ダッシュボード**: 全求人の一覧表示
2. **求人検索**: 特定の条件での求人検索
3. **ステータス管理**: 公開・非公開・下書きの管理
4. **分析・レポート**: 求人投稿状況の分析
5. **求人編集**: 編集対象求人の選択

## 注意事項
- 同一企業内の他のユーザーと同じ求人情報を共有
- 内部メモなどの機密情報も含まれるため、適切に表示制御すること
- 求人の作成・編集・削除は別のAPIエンドポイントで行います 