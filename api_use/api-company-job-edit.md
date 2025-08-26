# 求人編集API（取得）

## 基本情報
- **エンドポイント**: `GET /api/company/job/edit`
- **目的**: 編集対象の求人情報を取得
- **認証**: 必要（企業ユーザーのJWTトークン）

## 機能概要
このAPIは、企業ユーザーが編集する求人の詳細情報を取得します。求人編集フォームの初期データとして使用されます。認証されたユーザーは自社の求人のみ取得可能です。

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
?id=string (required)
```

#### パラメータ詳細
- **id**: 取得したい求人のID
  - 必須
  - 自社で作成した求人のIDのみ有効

### リクエスト例
```
GET /api/company/job/edit?id=job-12345
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "job": {
    "id": "string",
    "title": "string",
    "job_description": "string",
    "position_summary": "string",
    "required_skills": "string",
    "preferred_skills": "string",
    "salary_min": number,
    "salary_max": number,
    "salary_note": "string",
    "employment_type": "string",
    "employment_type_note": "string",
    "work_location": "string",
    "location_note": "string",
    "remote_work_available": boolean,
    "working_hours": "string",
    "overtime_info": "string",
    "holidays": "string",
    "job_type": "string",
    "industry": "string",
    "selection_process": "string",
    "appeal_points": "string",
    "smoking_policy": "string",
    "smoking_policy_note": "string",
    "required_documents": "string",
    "internal_memo": "string",
    "publication_type": "string",
    "status": "string",
    "application_deadline": "string (ISO date)",
    "group_id": "string",
    "image_urls": ["string"],
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "published_at": "string (ISO date)",
    "created_by": "string",
    "company_account_id": "string"
  }
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "error": "求人IDが必要です"
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "error": "認証トークンがありません"
}
```

### エラー時（404 Not Found）
```json
{
  "success": false,
  "error": "求人情報が見つかりません"
}
```

### エラー時（403 Forbidden）
```json
{
  "success": false,
  "error": "この求人を編集する権限がありません"
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
2. 編集したい求人のIDを取得（URLパラメータやリンクから）
3. APIにGETリクエストを送信
4. 取得した求人データで編集フォームを初期化
5. ユーザーが編集を行い、更新APIで保存

### 基本的な実装例（JavaScript/TypeScript）
```typescript
interface JobEditData {
  id: string;
  title: string;
  job_description: string;
  position_summary?: string;
  required_skills?: string;
  preferred_skills?: string;
  salary_min?: number;
  salary_max?: number;
  salary_note?: string;
  employment_type: string;
  employment_type_note?: string;
  work_location: string;
  location_note?: string;
  remote_work_available: boolean;
  working_hours?: string;
  overtime_info?: string;
  holidays?: string;
  job_type?: string;
  industry?: string;
  selection_process?: string;
  appeal_points?: string;
  smoking_policy?: string;
  smoking_policy_note?: string;
  required_documents?: string;
  internal_memo?: string;
  publication_type?: string;
  status: string;
  application_deadline?: string;
  group_id?: string;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
  published_at?: string;
  created_by: string;
  company_account_id: string;
}

const fetchJobForEdit = async (jobId: string) => {
  try {
    const token = localStorage.getItem('authToken');

    const response = await fetch(`/api/company/job/edit?id=${jobId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        job: data.job,
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
const useJobEdit = (jobId: string) => {
  const [job, setJob] = useState<JobEditData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJob = useCallback(async () => {
    if (!jobId) {
      setError('求人IDが指定されていません');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await fetchJobForEdit(jobId);

    if (result.success) {
      setJob(result.job);
    } else {
      setError(result.error || '求人情報の取得に失敗しました');
    }

    setIsLoading(false);
  }, [jobId]);

  useEffect(() => {
    loadJob();
  }, [loadJob]);

  return {
    job,
    isLoading,
    error,
    refetch: loadJob,
  };
};
```

### React コンポーネントの実装例
```typescript
const JobEditPage = () => {
  const { id: jobId } = useParams<{ id: string }>();
  const { job, isLoading, error } = useJobEdit(jobId || '');
  const [formData, setFormData] = useState<Partial<JobEditData>>({});

  // 求人データが取得されたらフォームデータを初期化
  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        job_description: job.job_description,
        position_summary: job.position_summary,
        required_skills: job.required_skills,
        preferred_skills: job.preferred_skills,
        salary_min: job.salary_min,
        salary_max: job.salary_max,
        salary_note: job.salary_note,
        employment_type: job.employment_type,
        employment_type_note: job.employment_type_note,
        work_location: job.work_location,
        location_note: job.location_note,
        remote_work_available: job.remote_work_available,
        working_hours: job.working_hours,
        overtime_info: job.overtime_info,
        holidays: job.holidays,
        job_type: job.job_type,
        industry: job.industry,
        selection_process: job.selection_process,
        appeal_points: job.appeal_points,
        smoking_policy: job.smoking_policy,
        smoking_policy_note: job.smoking_policy_note,
        required_documents: job.required_documents,
        internal_memo: job.internal_memo,
        publication_type: job.publication_type,
        status: job.status,
        application_deadline: job.application_deadline,
        group_id: job.group_id,
        image_urls: job.image_urls,
      });
    }
  }, [job]);

  if (isLoading) {
    return <div>求人情報を読み込み中...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>エラーが発生しました</h2>
        <p>{error}</p>
        <button onClick={() => window.history.back()}>戻る</button>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="not-found">
        <h2>求人が見つかりません</h2>
        <button onClick={() => window.history.back()}>戻る</button>
      </div>
    );
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 更新APIを呼び出し（別のエンドポイント）
    // await updateJob(job.id, formData);
  };

  return (
    <div className="job-edit-container">
      <h1>求人編集</h1>
      <div className="job-meta">
        <p>作成日: {new Date(job.created_at).toLocaleDateString()}</p>
        <p>更新日: {new Date(job.updated_at).toLocaleDateString()}</p>
        <p>ステータス: {job.status}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div>
          <label>求人タイトル *</label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
          />
        </div>

        <div>
          <label>仕事内容 *</label>
          <textarea
            value={formData.job_description || ''}
            onChange={(e) => handleInputChange('job_description', e.target.value)}
            required
          />
        </div>

        <div>
          <label>職種概要</label>
          <textarea
            value={formData.position_summary || ''}
            onChange={(e) => handleInputChange('position_summary', e.target.value)}
          />
        </div>

        <div>
          <label>雇用形態 *</label>
          <select
            value={formData.employment_type || ''}
            onChange={(e) => handleInputChange('employment_type', e.target.value)}
            required
          >
            <option value="">選択してください</option>
            <option value="正社員">正社員</option>
            <option value="契約社員">契約社員</option>
            <option value="パート・アルバイト">パート・アルバイト</option>
            <option value="フリーランス">フリーランス</option>
          </select>
        </div>

        <div>
          <label>勤務地 *</label>
          <input
            type="text"
            value={formData.work_location || ''}
            onChange={(e) => handleInputChange('work_location', e.target.value)}
            required
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={formData.remote_work_available || false}
              onChange={(e) => handleInputChange('remote_work_available', e.target.checked)}
            />
            リモートワーク可能
          </label>
        </div>

        <div>
          <label>ステータス</label>
          <select
            value={formData.status || ''}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="draft">下書き</option>
            <option value="published">公開</option>
            <option value="closed">募集終了</option>
          </select>
        </div>

        <button type="submit">更新</button>
        <button type="button" onClick={() => window.history.back()}>
          キャンセル
        </button>
      </form>
    </div>
  );
};
```

### URLパラメータからの求人ID取得例
```typescript
// React Routerを使用する場合
const JobEditWrapper = () => {
  const { id } = useParams<{ id: string }>();
  
  if (!id) {
    return <div>求人IDが指定されていません</div>;
  }
  
  return <JobEditPage jobId={id} />;
};

// 通常のJavaScriptでURLパラメータを取得する場合
const getJobIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
};
```

## エラーハンドリング
- 求人IDが未指定の場合は400エラー
- 認証トークンが無効または未提供の場合は401エラー
- 存在しない求人IDの場合は404エラー
- 他社の求人にアクセスしようとした場合は403エラー
- サーバーエラーは500ステータス
- フロントエンドでは適切にエラーメッセージを表示すること

## セキュリティ考慮事項
- 認証されたユーザーは自社の求人のみ取得可能
- 求人の所有権を確認してからデータを返却
- 内部メモなど機密情報も含まれるため、適切に管理
- HTTPS必須

## パフォーマンス考慮事項
- 単一の求人データのため、レスポンスは軽量
- 必要に応じてキャッシュ戦略を実装
- 画像URLは別途ロードすることを推奨

## 使用シナリオ
1. **求人編集画面**: 編集フォームの初期データ取得
2. **求人詳細確認**: 投稿前の内容確認
3. **求人複製**: 既存求人をテンプレートとして使用
4. **求人状況確認**: 現在のステータスや設定の確認

## 注意事項
- この API は求人データの取得のみを行います
- 実際の更新処理は別の更新APIエンドポイントを使用してください
- 取得したデータは編集フォームの初期値として使用されます
- 機密情報（内部メモ等）の表示には注意してください 