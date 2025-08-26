# 管理者環境変数監査API

## 基本情報
- **エンドポイント**: `GET /api/admin/env-audit`
- **目的**: 管理者向けの環境変数設定状況確認
- **認証**: 基本認証（開発環境のみ）

## 機能概要
このAPIは、管理者が環境変数の設定状況を確認するためのエンドポイントです。セキュリティ上の理由から開発環境でのみ利用可能で、本番環境では無効化されます。システムの設定状況やセキュリティ監査に使用されます。

## 利用制限
- **開発環境のみ**: 本番環境では403エラーで利用不可
- **基本認証必須**: Basic認証が必要
- **管理者権限**: システム管理者のみアクセス可能

## リクエスト

### HTTPメソッド
`GET`

### リクエストヘッダー
```
Authorization: Basic <base64_encoded_credentials>
```

### 認証について
Basic認証が必要です：
```
Username: admin（またはシステムで設定された管理者ID）
Password: システムで設定された管理者パスワード
```

### リクエスト例
```bash
curl -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" \
     https://your-app.com/api/admin/env-audit
```

## レスポンス

### 成功時（200 OK）
```json
{
  "success": true,
  "timestamp": "2024-01-15T10:30:00.000Z",
  "audit": {
    "environment": "development",
    "nodeEnv": "development",
    "criticalVariables": {
      "SUPABASE_URL": {
        "status": "present",
        "value": "https://xxx.supabase.co",
        "masked": "https://xxx...co"
      },
      "SUPABASE_ANON_KEY": {
        "status": "present",
        "value": "eyJhbGc...",
        "masked": "eyJhbGc..."
      },
      "NEXTAUTH_SECRET": {
        "status": "present",
        "masked": "***"
      },
      "DATABASE_URL": {
        "status": "present",
        "masked": "postgresql://***@***:5432/***"
      }
    },
    "optionalVariables": {
      "REDIS_URL": {
        "status": "missing",
        "recommendation": "Redis接続が設定されていません"
      },
      "SMTP_HOST": {
        "status": "present",
        "masked": "smtp.***"
      }
    },
    "securityChecks": {
      "productionSecrets": {
        "status": "ok",
        "message": "本番用の秘密鍵は適切に設定されています"
      },
      "debugMode": {
        "status": "warning",
        "message": "デバッグモードが有効です（開発環境では正常）"
      }
    },
    "recommendations": [
      "REDIS_URLを設定してキャッシュ機能を有効化することを推奨",
      "本番環境では環境変数の値をマスクしてください"
    ]
  }
}
```

### エラー時（403 Forbidden - 本番環境）
```json
{
  "error": "Environment audit is not available in production",
  "message": "This endpoint is disabled for security reasons in production"
}
```

### エラー時（401 Unauthorized - 認証失敗）
```json
{
  "error": "Unauthorized"
}
```

### エラー時（500 Internal Server Error）
```json
{
  "success": false,
  "error": "Environment audit failed",
  "message": "Internal server error occurred during audit"
}
```

## フロントエンドでの使用方法

### 基本的な実装例（JavaScript/TypeScript）
```typescript
interface EnvironmentAuditResponse {
  success: boolean;
  timestamp: string;
  audit: {
    environment: string;
    nodeEnv: string;
    criticalVariables: Record<string, {
      status: 'present' | 'missing';
      value?: string;
      masked?: string;
    }>;
    optionalVariables: Record<string, {
      status: 'present' | 'missing';
      masked?: string;
      recommendation?: string;
    }>;
    securityChecks: Record<string, {
      status: 'ok' | 'warning' | 'error';
      message: string;
    }>;
    recommendations: string[];
  };
  error?: string;
  message?: string;
}

const performEnvironmentAudit = async (credentials: { username: string; password: string }) => {
  try {
    const encodedCredentials = btoa(`${credentials.username}:${credentials.password}`);
    
    const response = await fetch('/api/admin/env-audit', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${encodedCredentials}`,
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return {
        success: true,
        audit: data.audit,
        timestamp: data.timestamp,
      };
    } else {
      return {
        success: false,
        error: data.error || data.message || 'Unknown error',
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

### React管理者コンポーネントの実装例
```typescript
const EnvironmentAuditPanel = () => {
  const [auditData, setAuditData] = useState<EnvironmentAuditResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showCredentials, setShowCredentials] = useState(true);

  const handleAudit = async () => {
    if (!credentials.username || !credentials.password) {
      setError('ユーザー名とパスワードを入力してください');
      return;
    }

    setIsLoading(true);
    setError('');

    const result = await performEnvironmentAudit(credentials);

    if (result.success) {
      setAuditData(result);
      setShowCredentials(false);
    } else {
      setError(result.error || '監査に失敗しました');
    }

    setIsLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
      case 'present':
        return 'green';
      case 'warning':
        return 'orange';
      case 'error':
      case 'missing':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
      case 'present':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
      case 'missing':
        return '❌';
      default:
        return '❓';
    }
  };

  if (showCredentials) {
    return (
      <div className="audit-login">
        <h2>環境変数監査</h2>
        <div className="credential-form">
          <input
            type="text"
            placeholder="管理者ユーザー名"
            value={credentials.username}
            onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
          />
          <input
            type="password"
            placeholder="管理者パスワード"
            value={credentials.password}
            onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
          />
          <button onClick={handleAudit} disabled={isLoading}>
            {isLoading ? '監査実行中...' : '監査開始'}
          </button>
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    );
  }

  if (!auditData) {
    return <div>監査データを読み込み中...</div>;
  }

  return (
    <div className="audit-results">
      <div className="audit-header">
        <h2>環境変数監査結果</h2>
        <div className="audit-meta">
          <p>実行時刻: {new Date(auditData.timestamp).toLocaleString()}</p>
          <p>環境: {auditData.audit.environment}</p>
          <button onClick={() => setShowCredentials(true)}>再実行</button>
        </div>
      </div>

      <div className="critical-variables">
        <h3>重要な環境変数</h3>
        {Object.entries(auditData.audit.criticalVariables).map(([key, value]) => (
          <div key={key} className="variable-item">
            <div className="variable-name">{key}</div>
            <div className="variable-status" style={{ color: getStatusColor(value.status) }}>
              {getStatusIcon(value.status)} {value.status}
            </div>
            {value.masked && (
              <div className="variable-value">値: {value.masked}</div>
            )}
          </div>
        ))}
      </div>

      <div className="optional-variables">
        <h3>オプション環境変数</h3>
        {Object.entries(auditData.audit.optionalVariables).map(([key, value]) => (
          <div key={key} className="variable-item">
            <div className="variable-name">{key}</div>
            <div className="variable-status" style={{ color: getStatusColor(value.status) }}>
              {getStatusIcon(value.status)} {value.status}
            </div>
            {value.masked && (
              <div className="variable-value">値: {value.masked}</div>
            )}
            {value.recommendation && (
              <div className="variable-recommendation">推奨: {value.recommendation}</div>
            )}
          </div>
        ))}
      </div>

      <div className="security-checks">
        <h3>セキュリティチェック</h3>
        {Object.entries(auditData.audit.securityChecks).map(([key, check]) => (
          <div key={key} className="security-item">
            <div className="security-name">{key}</div>
            <div className="security-status" style={{ color: getStatusColor(check.status) }}>
              {getStatusIcon(check.status)} {check.status}
            </div>
            <div className="security-message">{check.message}</div>
          </div>
        ))}
      </div>

      <div className="recommendations">
        <h3>推奨事項</h3>
        <ul>
          {auditData.audit.recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};
```

### システム管理者向けダッシュボード例
```typescript
const AdminDashboard = () => {
  const [auditHistory, setAuditHistory] = useState<EnvironmentAuditResponse[]>([]);
  const [currentAudit, setCurrentAudit] = useState<EnvironmentAuditResponse | null>(null);

  const addAuditToHistory = (audit: EnvironmentAuditResponse) => {
    setAuditHistory(prev => [audit, ...prev.slice(0, 9)]); // 最新10件まで保持
    setCurrentAudit(audit);
  };

  const exportAuditReport = () => {
    if (!currentAudit) return;

    const report = {
      timestamp: currentAudit.timestamp,
      environment: currentAudit.audit.environment,
      summary: {
        criticalVariables: Object.keys(currentAudit.audit.criticalVariables).length,
        missingCritical: Object.values(currentAudit.audit.criticalVariables)
          .filter(v => v.status === 'missing').length,
        securityIssues: Object.values(currentAudit.audit.securityChecks)
          .filter(c => c.status === 'error').length,
      },
      recommendations: currentAudit.audit.recommendations,
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `env-audit-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-dashboard">
      <h1>システム管理ダッシュボード</h1>
      
      <div className="dashboard-actions">
        <button onClick={exportAuditReport} disabled={!currentAudit}>
          監査レポート出力
        </button>
      </div>

      <EnvironmentAuditPanel onAuditComplete={addAuditToHistory} />

      {auditHistory.length > 0 && (
        <div className="audit-history">
          <h3>監査履歴</h3>
          <ul>
            {auditHistory.map((audit, index) => (
              <li key={index}>
                {new Date(audit.timestamp).toLocaleString()} - 
                環境: {audit.audit.environment}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
```

## セキュリティ考慮事項
- **本番環境では完全無効**: セキュリティリスクを避けるため
- **Basic認証必須**: 不正アクセスを防止
- **機密情報のマスク**: 環境変数の値は適切にマスク表示
- **アクセスログ**: 監査実行のログを記録
- **HTTPS必須**: 認証情報の保護

## 開発・運用での使用
- **開発環境設定確認**: 必要な環境変数の設定確認
- **デプロイ前チェック**: 本番デプロイ前の設定確認
- **セキュリティ監査**: 定期的なセキュリティ設定確認
- **トラブルシューティング**: 設定関連の問題調査

## 使用制限と注意事項
- 開発環境でのみ利用可能
- 管理者権限が必要
- 機密情報の取り扱いに注意
- 監査結果の外部共有は禁止
- 定期的なパスワード変更を推奨

## エラーハンドリング
- 本番環境アクセスは403エラー
- 認証失敗は401エラー
- サーバーエラーは500ステータス
- 適切なエラーメッセージを表示すること

## 使用シナリオ
1. **開発環境構築**: 初期設定の確認
2. **定期監査**: セキュリティ設定の定期確認
3. **問題調査**: 設定関連のトラブルシューティング
4. **コンプライアンス**: セキュリティ監査対応 