# 求人新規作成API

## 基本情報
- **エンドポイント**: `POST /api/company/job/new`
- **目的**: 企業が新しい求人を作成・投稿
- **認証**: 必要（企業ユーザーのJWTトークン）

## 機能概要
このAPIは、認証された企業ユーザーが新しい求人を作成します。求人の基本情報から詳細条件まで、幅広い情報を受け取り、データベースに保存します。

## リクエスト

### HTTPメソッド
`POST`

### リクエストヘッダー
```
Content-Type: application/json
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
X-User-Id: <company_user_id> (optional, パフォーマンス最適化用)
```

### リクエストボディ
```json
{
  "title": "string (required)",
  "job_description": "string (required)",
  "position_summary": "string (optional)",
  "required_skills": "string (optional)",
  "preferred_skills": "string (optional)",
  "salary_min": number,
  "salary_max": number,
  "salary_note": "string (optional)",
  "employment_type": "string (required)",
  "employment_type_note": "string (optional)",
  "work_location": "string (required)",
  "location_note": "string (optional)",
  "remote_work_available": boolean,
  "working_hours": "string (optional)",
  "overtime_info": "string (optional)",
  "holidays": "string (optional)",
  "job_type": "string (optional)",
  "industry": "string (optional)",
  "selection_process": "string (optional)",
  "appeal_points": "string (optional)",
  "smoking_policy": "string (optional)",
  "smoking_policy_note": "string (optional)",
  "required_documents": "string (optional)",
  "internal_memo": "string (optional)",
  "publication_type": "string (optional)",
  "status": "string (optional)",
  "application_deadline": "string (ISO date, optional)",
  "group_id": "string (optional)",
  "image_urls": ["string"]
}
```

#### パラメータ詳細

##### 必須フィールド
- **title**: 求人タイトル
- **job_description**: 仕事内容の詳細説明
- **employment_type**: 雇用形態（正社員、契約社員、パート等）
- **work_location**: 勤務地

##### 給与関連
- **salary_min**: 最低給与（数値）
- **salary_max**: 最高給与（数値）
- **salary_note**: 給与に関する補足説明

##### 勤務条件
- **remote_work_available**: リモートワーク可否（boolean）
- **working_hours**: 勤務時間
- **overtime_info**: 残業に関する情報
- **holidays**: 休日・休暇情報

##### その他の詳細
- **required_skills**: 必須スキル
- **preferred_skills**: 歓迎スキル
- **selection_process**: 選考プロセス
- **appeal_points**: アピールポイント
- **smoking_policy**: 喫煙ポリシー
- **required_documents**: 必要書類
- **internal_memo**: 内部メモ（社内用）
- **group_id**: 企業内グループID
- **image_urls**: 求人画像のURL配列

### リクエスト例
```json
{
  "title": "フロントエンドエンジニア募集",
  "job_description": "React.jsを使用したWebアプリケーション開発",
  "position_summary": "最新技術を使った開発に携われます",
  "required_skills": "React.js, TypeScript, HTML/CSS",
  "preferred_skills": "Next.js, GraphQL, AWS経験",
  "salary_min": 4000000,
  "salary_max": 7000000,
  "salary_note": "経験・スキルに応じて決定",
  "employment_type": "正社員",
  "work_location": "東京都渋谷区",
  "remote_work_available": true,
  "working_hours": "9:00-18:00（フレックスタイム制）",
  "holidays": "土日祝、夏季休暇、年末年始",
  "job_type": "エンジニア",
  "industry": "IT・Web",
  "selection_process": "書類選考 → 一次面接 → 最終面接",
  "appeal_points": "最新技術への挑戦、フルリモート可",
  "status": "draft",
  "group_id": "group-123"
}
```

## レスポンス

### 成功時（201 Created）
```json
{
  "success": true,
  "message": "求人が正常に作成されました",
  "job": {
    "id": "string",
    "title": "string",
    "job_description": "string",
    "status": "string",
    "created_at": "string (ISO date)",
    "updated_at": "string (ISO date)",
    "created_by": "string",
    "company_account_id": "string"
  }
}
```

### エラー時（400 Bad Request）
```json
{
  "success": false,
  "message": "入力データが無効です",
  "errors": [
    {
      "field": "title",
      "message": "求人タイトルは必須です"
    },
    {
      "field": "salary_min",
      "message": "最低給与は数値で入力してください"
    }
  ]
}
```

### エラー時（401 Unauthorized）
```json
{
  "success": false,
  "error": "認証トークンがありません"
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
2. 求人作成フォームでデータを入力
3. フロントエンドでバリデーションを実行
4. APIにPOSTリクエストを送信
5. 成功時は求人一覧ページまたは詳細ページにリダイレクト

### 基本的な実装例（JavaScript/TypeScript）
```typescript
interface JobCreateData {
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
  remote_work_available?: boolean;
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
  status?: string;
  application_deadline?: string;
  group_id?: string;
  image_urls?: string[];
}

const createJob = async (jobData: JobCreateData) => {
  try {
    const token = localStorage.getItem('authToken');
    const companyUserId = localStorage.getItem('companyUserId');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    if (companyUserId) {
      headers['X-User-Id'] = companyUserId;
    }

    const response = await fetch('/api/company/job/new', {
      method: 'POST',
      headers,
      body: JSON.stringify(jobData),
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        job: data.job,
        message: data.message,
      };
    } else {
      return {
        success: false,
        error: data.message,
        errors: data.errors,
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
const useJobCreate = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const submitJob = useCallback(async (jobData: JobCreateData) => {
    setIsSubmitting(true);
    setError('');
    setErrors({});

    const result = await createJob(jobData);

    if (result.success) {
      setIsSubmitting(false);
      return { success: true, job: result.job };
    } else {
      setError(result.error || '求人の作成に失敗しました');
      
      if (result.errors) {
        const errorMap: Record<string, string> = {};
        result.errors.forEach((err: any) => {
          errorMap[err.field] = err.message;
        });
        setErrors(errorMap);
      }
      
      setIsSubmitting(false);
      return { success: false };
    }
  }, []);

  return {
    submitJob,
    isSubmitting,
    error,
    errors,
  };
};
```

### React コンポーネントの実装例
```typescript
const JobCreateForm = () => {
  const { submitJob, isSubmitting, error, errors } = useJobCreate();
  const [formData, setFormData] = useState<JobCreateData>({
    title: '',
    job_description: '',
    employment_type: '',
    work_location: '',
    remote_work_available: false,
    status: 'draft',
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = await submitJob(formData);
    
    if (result.success) {
      alert('求人が作成されました');
      // リダイレクト処理
      window.location.href = '/company/job';
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>求人タイトル *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          required
          disabled={isSubmitting}
        />
        {errors.title && <div className="error">{errors.title}</div>}
      </div>

      <div>
        <label>仕事内容 *</label>
        <textarea
          value={formData.job_description}
          onChange={(e) => handleInputChange('job_description', e.target.value)}
          required
          disabled={isSubmitting}
        />
        {errors.job_description && <div className="error">{errors.job_description}</div>}
      </div>

      <div>
        <label>雇用形態 *</label>
        <select
          value={formData.employment_type}
          onChange={(e) => handleInputChange('employment_type', e.target.value)}
          required
          disabled={isSubmitting}
        >
          <option value="">選択してください</option>
          <option value="正社員">正社員</option>
          <option value="契約社員">契約社員</option>
          <option value="パート・アルバイト">パート・アルバイト</option>
          <option value="フリーランス">フリーランス</option>
        </select>
        {errors.employment_type && <div className="error">{errors.employment_type}</div>}
      </div>

      <div>
        <label>勤務地 *</label>
        <input
          type="text"
          value={formData.work_location}
          onChange={(e) => handleInputChange('work_location', e.target.value)}
          required
          disabled={isSubmitting}
        />
        {errors.work_location && <div className="error">{errors.work_location}</div>}
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            checked={formData.remote_work_available}
            onChange={(e) => handleInputChange('remote_work_available', e.target.checked)}
            disabled={isSubmitting}
          />
          リモートワーク可能
        </label>
      </div>

      <div>
        <label>ステータス</label>
        <select
          value={formData.status}
          onChange={(e) => handleInputChange('status', e.target.value)}
          disabled={isSubmitting}
        >
          <option value="draft">下書き</option>
          <option value="published">公開</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? '作成中...' : '求人を作成'}
      </button>

      {error && <div className="error-message">{error}</div>}
    </form>
  );
};
```

### バリデーション例
```typescript
const validateJobData = (data: JobCreateData) => {
  const errors: Record<string, string> = {};

  if (!data.title) {
    errors.title = '求人タイトルは必須です';
  } else if (data.title.length < 5) {
    errors.title = '求人タイトルは5文字以上で入力してください';
  }

  if (!data.job_description) {
    errors.job_description = '仕事内容は必須です';
  } else if (data.job_description.length < 50) {
    errors.job_description = '仕事内容は50文字以上で入力してください';
  }

  if (!data.employment_type) {
    errors.employment_type = '雇用形態は必須です';
  }

  if (!data.work_location) {
    errors.work_location = '勤務地は必須です';
  }

  if (data.salary_min && data.salary_max && data.salary_min > data.salary_max) {
    errors.salary_max = '最高給与は最低給与以上で入力してください';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
```

## エラーハンドリング
- バリデーションエラーは400ステータスで詳細なフィールドエラーを含む
- 認証エラーは401ステータス
- サーバーエラーは500ステータス
- フロントエンドでは各フィールドのエラーを適切に表示すること

## セキュリティ考慮事項
- 認証されたユーザーのみ求人作成可能
- 企業アカウントIDは自動的に設定される
- 内部メモは企業内のみで共有される
- HTTPS必須

## パフォーマンス考慮事項
- 画像アップロードがある場合は別のAPIエンドポイントを使用
- 大きなテキストデータは適切に処理
- X-User-Idヘッダーによるパフォーマンス最適化

## 使用シナリオ
1. **新規求人投稿**: 企業が新しい求人を作成
2. **下書き保存**: 作成途中の求人を一時保存
3. **即時公開**: 作成と同時に求人を公開
4. **テンプレート保存**: 似た求人を作成するためのテンプレート

## 注意事項
- 作成者（created_by）は自動的に設定される
- 求人IDは自動生成される
- ステータスが'published'の場合は即座に公開される
- 求人の編集は別のAPIエンドポイントで行う 