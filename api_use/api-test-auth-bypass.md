# テスト認証バイパスAPI

## 基本情報
- **エンドポイント**: `/api/test/auth-bypass`
- **目的**: 開発・テスト環境での認証バイパス機能
- **認証**: 不要（テスト用）
- **利用制限**: 開発・テスト環境のみ

## 機能概要
このAPIは、開発・テスト環境でのみ利用可能な認証バイパス機能を提供します。テストデータの生成、テストユーザーでの自動ログイン、開発効率の向上を目的としています。本番環境では完全に無効化されます。

## サポートするHTTPメソッド
- `GET`: 認証バイパス情報とテストユーザー一覧の取得
- `POST`: 認証バイパスログインまたはテストデータ生成

---

## GET - 認証バイパス情報の取得

### 目的
認証バイパス機能の状態確認とテストユーザー一覧の取得

### リクエスト

#### リクエストパラメータ
```
?action=string (optional)
```

##### パラメータ詳細
- **action**: 実行するアクション
  - `status`: バイパス機能の状態確認
  - `test-users`: テストユーザー一覧の取得
  - 未指定: 全体情報の取得

### レスポンス

#### デフォルト情報取得（200 OK）
```json
{
  "success": true,
  "message": "認証バイパス機能が利用可能です",
  "authBypass": {
    "enabled": true,
    "environment": "development",
    "predefinedUsers": [
      {
        "userType": "candidate",
        "email": "test-candidate@example.com",
        "name": "テスト候補者",
        "description": "候補者用テストアカウント"
      },
      {
        "userType": "company",
        "email": "test-company@example.com",
        "name": "テスト企業",
        "description": "企業用テストアカウント"
      }
    ]
  },
  "testData": {
    "enabled": true,
    "availableUsers": [
      {
        "id": "user-123",
        "email": "generated-user@example.com",
        "userType": "candidate",
        "created": "2024-01-15T10:30:00.000Z"
      }
    ]
  },
  "instructions": {
    "bypassLogin": "POST /api/test/auth-bypass with userType parameter",
    "generateTestData": "POST /api/test/auth-bypass with action=generate",
    "cleanupTestData": "DELETE /api/test/auth-bypass"
  }
}
```

#### ステータス確認（action=status）
```json
{
  "success": true,
  "authBypass": {
    "enabled": true,
    "environment": "development"
  },
  "testData": {
    "enabled": true
  },
  "predefinedUsers": [
    {
      "userType": "candidate",
      "email": "test-candidate@example.com",
      "name": "テスト候補者"
    }
  ]
}
```

---

## POST - 認証バイパスログインまたはテストデータ生成

### リクエストボディ
```json
{
  "action": "string (required)",
  "userType": "string (optional)",
  "customData": "object (optional)"
}
```

#### パラメータ詳細
- **action**: 実行するアクション
  - `bypass-login`: 認証バイパスログイン
  - `generate-test-data`: テストデータ生成
- **userType**: ユーザータイプ（bypass-loginの場合）
  - `candidate`: 候補者
  - `company`: 企業
- **customData**: カスタムデータ（テストデータ生成時）

### レスポンス

#### 認証バイパスログイン成功時（200 OK）
```json
{
  "success": true,
  "message": "認証バイパスログインが完了しました",
  "user": {
    "id": "test-user-123",
    "email": "test-candidate@example.com",
    "userType": "candidate",
    "name": "テスト候補者",
    "token": "jwt_token_string"
  },
  "bypassInfo": {
    "type": "predefined",
    "environment": "development",
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
}
```

#### テストデータ生成成功時（200 OK）
```json
{
  "success": true,
  "message": "テストデータが生成されました",
  "generated": {
    "users": 10,
    "companies": 3,
    "jobs": 15,
    "applications": 25
  },
  "summary": {
    "candidateUsers": [
      {
        "id": "candidate-1",
        "email": "candidate1@test.com",
        "name": "候補者1"
      }
    ],
    "companyUsers": [
      {
        "id": "company-1",
        "email": "company1@test.com",
        "name": "テスト企業1"
      }
    ]
  }
}
```

### エラー時（403 Forbidden - 本番環境）
```json
{
  "success": false,
  "error": "この機能は開発環境でのみ利用可能です"
}
```

## フロントエンドでの使用方法

### 基本的な実装例（JavaScript/TypeScript）
```typescript
interface AuthBypassResponse {
  success: boolean;
  message?: string;
  user?: {
    id: string;
    email: string;
    userType: string;
    name: string;
    token: string;
  };
  generated?: {
    users: number;
    companies: number;
    jobs: number;
    applications: number;
  };
  authBypass?: {
    enabled: boolean;
    environment: string;
    predefinedUsers: Array<{
      userType: string;
      email: string;
      name: string;
      description?: string;
    }>;
  };
  error?: string;
}

// 認証バイパス情報の取得
const getAuthBypassInfo = async () => {
  try {
    const response = await fetch('/api/test/auth-bypass', {
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// 認証バイパスログイン
const bypassLogin = async (userType: 'candidate' | 'company') => {
  try {
    const response = await fetch('/api/test/auth-bypass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'bypass-login',
        userType,
      }),
    });

    const data = await response.json();

    if (data.success && data.user) {
      // トークンをローカルストレージに保存
      localStorage.setItem('authToken', data.user.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      return { success: true, user: data.user };
    } else {
      return { success: false, error: data.error };
    }
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};

// テストデータ生成
const generateTestData = async (customData?: any) => {
  try {
    const response = await fetch('/api/test/auth-bypass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate-test-data',
        customData,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    return { success: false, error: 'Network error' };
  }
};
```

### React開発者ツールコンポーネント
```typescript
const DeveloperToolsPanel = () => {
  const [authBypassInfo, setAuthBypassInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 開発環境チェック
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    loadAuthBypassInfo();
  }, []);

  const loadAuthBypassInfo = async () => {
    const info = await getAuthBypassInfo();
    if (info.success) {
      setAuthBypassInfo(info);
    }
  };

  const handleBypassLogin = async (userType: 'candidate' | 'company') => {
    setIsLoading(true);
    setMessage('');

    const result = await bypassLogin(userType);

    if (result.success) {
      setMessage(`${userType}としてログインしました`);
      // ページリロードまたはリダイレクト
      window.location.reload();
    } else {
      setMessage(`ログインに失敗しました: ${result.error}`);
    }

    setIsLoading(false);
  };

  const handleGenerateTestData = async () => {
    setIsLoading(true);
    setMessage('');

    const result = await generateTestData();

    if (result.success) {
      setMessage(`テストデータを生成しました: ${JSON.stringify(result.generated)}`);
      await loadAuthBypassInfo(); // 情報を更新
    } else {
      setMessage(`テストデータ生成に失敗しました: ${result.error}`);
    }

    setIsLoading(false);
  };

  // 本番環境では何も表示しない
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  if (!authBypassInfo || !authBypassInfo.success) {
    return (
      <div className="dev-tools-panel">
        <h3>🛠️ 開発者ツール</h3>
        <p>認証バイパス機能が利用できません</p>
      </div>
    );
  }

  return (
    <div className="dev-tools-panel">
      <h3>🛠️ 開発者ツール</h3>
      
      <div className="bypass-login-section">
        <h4>認証バイパスログイン</h4>
        <div className="user-types">
          {authBypassInfo.authBypass.predefinedUsers.map((user: any) => (
            <div key={user.userType} className="user-type-card">
              <h5>{user.name}</h5>
              <p>{user.email}</p>
              <p>{user.description}</p>
              <button
                onClick={() => handleBypassLogin(user.userType)}
                disabled={isLoading}
              >
                {user.userType}でログイン
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="test-data-section">
        <h4>テストデータ管理</h4>
        <button
          onClick={handleGenerateTestData}
          disabled={isLoading}
        >
          テストデータ生成
        </button>
        
        {authBypassInfo.testData?.availableUsers?.length > 0 && (
          <div className="existing-test-users">
            <h5>既存のテストユーザー</h5>
            <ul>
              {authBypassInfo.testData.availableUsers.map((user: any) => (
                <li key={user.id}>
                  {user.email} ({user.userType})
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {message && (
        <div className="dev-tools-message">
          {message}
        </div>
      )}

      {isLoading && (
        <div className="dev-tools-loading">
          処理中...
        </div>
      )}
    </div>
  );
};
```

### 簡易テストユーザー切り替え
```typescript
const QuickUserSwitch = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const switchUser = async (userType: 'candidate' | 'company') => {
    const result = await bypassLogin(userType);
    if (result.success) {
      setCurrentUser(result.user);
    }
  };

  // 本番環境では表示しない
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return (
    <div className="quick-user-switch">
      <div className="current-user">
        現在のユーザー: {currentUser ? `${currentUser.name} (${currentUser.userType})` : 'ログインしていません'}
      </div>
      <div className="switch-buttons">
        <button onClick={() => switchUser('candidate')}>
          候補者に切り替え
        </button>
        <button onClick={() => switchUser('company')}>
          企業に切り替え
        </button>
      </div>
    </div>
  );
};
```

## セキュリティ考慮事項
- **開発環境限定**: 本番環境では完全無効
- **テスト用途のみ**: 実際のユーザーデータは生成しない
- **一時的な使用**: セッション終了時にデータクリア
- **アクセスログ**: 使用履歴の記録

## 開発効率向上
- **素早いログイン**: 異なるユーザータイプでの動作確認
- **テストデータ生成**: 開発・テスト用データの自動生成
- **状態切り替え**: ユーザータイプ間の迅速な切り替え
- **デバッグ支援**: 認証フローのテスト

## 使用制限と注意事項
- 開発・テスト環境でのみ利用可能
- 生成されるデータはテスト用途のみ
- 本番データとの混在を避ける
- セキュリティテストには使用しない

## エラーハンドリング
- 本番環境アクセスは403エラー
- 無効なパラメータは400エラー
- サーバーエラーは500ステータス
- フロントエンドでは適切に環境チェックを実行

## 使用シナリオ
1. **開発時の動作確認**: 異なるユーザータイプでの機能テスト
2. **UI/UXテスト**: 様々なユーザー状態でのインターフェーステスト
3. **データ生成**: テスト用の求人・応募データ作成
4. **統合テスト**: 複数ユーザーでのワークフローテスト

## 注意事項
- このAPIは開発・テスト専用です
- 本番環境では絶対に使用しないでください
- 生成されるテストデータは定期的にクリアしてください
- セキュリティテストには適さないことを理解してください 