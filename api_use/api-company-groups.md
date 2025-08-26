# 企業グループAPI

## 基本情報
- **エンドポイント**: `GET /api/company/groups`
- **目的**: 企業に属するグループ一覧の取得
- **認証**: 必要（企業ユーザーのJWTトークン）

## 機能概要
このAPIは、認証された企業ユーザーが所属する会社のグループ一覧を取得します。グループは求人投稿時の分類や管理に使用されます。

## リクエスト

### HTTPメソッド
`GET`

### リクエストヘッダー
```
Authorization: Bearer <jwt_token> (optional)
Cookie: supabase-auth-token=<jwt_token> (optional)
X-User-Id: <company_user_id> (optional, パフォーマンス最適化用)
```

### リクエストパラメータ
なし（クエリパラメータなし）

### 認証について
以下のいずれかの方法で認証トークンを提供：
1. **Authorizationヘッダー**: `Bearer <jwt_token>`
2. **Cookie**: `supabase-auth-token=<jwt_token>`
3. **最適化ヘッダー**: `X-User-Id` - 企業ユーザーIDを指定することで検索を最適化

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "groups": [
    {
      "id": "string",
      "name": "string",
      "company_account_id": "string",
      "description": "string",
      "created_at": "string (ISO date)",
      "updated_at": "string (ISO date)"
    }
  ],
  "company": {
    "id": "string",
    "name": "string",
    "company_account_id": "string"
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
1. 企業ユーザーがログイン済みであることを確認
2. APIにGETリクエストを送信
3. グループ一覧を取得
4. UIでグループ一覧を表示（求人投稿フォームのドロップダウンなど）

### 実装例（JavaScript/TypeScript）
```typescript
interface CompanyGroup {
  id: string;
  name: string;
  company_account_id: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

interface CompanyGroupsResponse {
  success: boolean;
  groups?: CompanyGroup[];
  company?: {
    id: string;
    name: string;
    company_account_id: string;
  };
  error?: string;
}

const fetchCompanyGroups = async (): Promise<CompanyGroupsResponse> => {
  try {
    const token = localStorage.getItem('authToken');
    const companyUserId = localStorage.getItem('companyUserId'); // 最適化用

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${token}`,
    };

    // パフォーマンス最適化のためのヘッダー
    if (companyUserId) {
      headers['X-User-Id'] = companyUserId;
    }

    const response = await fetch('/api/company/groups', {
      method: 'GET',
      headers,
    });

    const data = await response.json();

    if (data.success) {
      return {
        success: true,
        groups: data.groups,
        company: data.company,
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
const useCompanyGroups = () => {
  const [groups, setGroups] = useState<CompanyGroup[]>([]);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadGroups = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const result = await fetchCompanyGroups();

    if (result.success) {
      setGroups(result.groups || []);
      setCompany(result.company || null);
    } else {
      setError(result.error || '不明なエラーが発生しました');
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  return {
    groups,
    company,
    isLoading,
    error,
    refetch: loadGroups,
  };
};
```

### React コンポーネントの実装例
```typescript
const CompanyGroupSelector = ({ onGroupSelect, selectedGroupId }) => {
  const { groups, isLoading, error } = useCompanyGroups();

  if (isLoading) {
    return <div>グループを読み込み中...</div>;
  }

  if (error) {
    return <div className="error">エラー: {error}</div>;
  }

  return (
    <select
      value={selectedGroupId || ''}
      onChange={(e) => onGroupSelect(e.target.value)}
    >
      <option value="">グループを選択してください</option>
      {groups.map((group) => (
        <option key={group.id} value={group.id}>
          {group.name}
        </option>
      ))}
    </select>
  );
};
```

### キャッシュ機能付きの実装例
```typescript
class CompanyGroupsCache {
  private static cache: CompanyGroup[] | null = null;
  private static cacheTime: number = 0;
  private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5分

  static async getGroups(): Promise<CompanyGroupsResponse> {
    const now = Date.now();
    
    // キャッシュが有効な場合はキャッシュを返す
    if (this.cache && (now - this.cacheTime) < this.CACHE_DURATION) {
      return {
        success: true,
        groups: this.cache,
      };
    }

    // APIから取得
    const result = await fetchCompanyGroups();
    
    if (result.success && result.groups) {
      this.cache = result.groups;
      this.cacheTime = now;
    }

    return result;
  }

  static clearCache() {
    this.cache = null;
    this.cacheTime = 0;
  }
}
```

## エラーハンドリング
- 認証トークンが無効または未提供の場合は401エラー
- 企業アカウント情報の取得に失敗した場合は400エラー
- サーバーエラーは500ステータス
- フロントエンドでは適切にエラーメッセージを表示すること

## パフォーマンス最適化
- `X-User-Id`ヘッダーを使用することで、データベース検索を最適化可能
- グループ情報は比較的変更頻度が低いため、適切なキャッシュ戦略を推奨
- レスポンスサイズが大きくなる場合は、ページネーションの実装を検討

## セキュリティ考慮事項
- 認証されたユーザーは自社のグループのみ取得可能
- セッション検証により、メールアドレスとユーザーIDの整合性をチェック
- HTTPS必須

## 使用シナリオ
1. **求人投稿フォーム**: グループ選択ドロップダウンの選択肢
2. **求人管理画面**: グループによる求人のフィルタリング
3. **組織管理**: グループ一覧の表示と管理
4. **分析・レポート**: グループ別の求人統計

## 注意事項
- グループが存在しない場合は空の配列が返される
- 同一企業内の他のユーザーと同じグループ情報を共有
- グループの作成・編集・削除は別のAPIエンドポイントで行います 