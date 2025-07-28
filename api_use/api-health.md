# 健康チェックAPI

## 基本情報
- **エンドポイント**: `GET /api/health`
- **目的**: アプリケーションとインフラの健康状態監視
- **認証**: 不要（監視用途のため）

## 機能概要
このAPIは、アプリケーションサーバーの稼働状況、データベース接続、外部サービスの状態など、システム全体の健康状態を確認するためのエンドポイントです。Dockerコンテナの監視やロードバランサーの健康チェックに使用されます。

## リクエスト

### HTTPメソッド
`GET`

### リクエストヘッダー
```
なし（認証不要）
```

### リクエストパラメータ
なし

### リクエスト例
```
GET /api/health
```

## レスポンス

### 成功時（200 OK）
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 86400,
  "environment": "production",
  "version": "1.0.0",
  "memory": {
    "used": 256,
    "total": 512
  },
  "checks": {
    "database": {
      "status": "ok",
      "responseTime": 50,
      "connection": "active"
    },
    "redis": {
      "status": "ok",
      "responseTime": 10,
      "connection": "active"
    }
  },
  "supabaseEnv": {
    "SUPABASE_URL": true,
    "SUPABASE_ANON_KEY": true
  }
}
```

### エラー時（503 Service Unavailable）
```json
{
  "status": "error",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "error": "Database connection failed",
  "checks": {
    "database": {
      "status": "error",
      "error": "Connection timeout",
      "responseTime": null
    },
    "redis": {
      "status": "ok",
      "responseTime": 15,
      "connection": "active"
    }
  }
}
```

## レスポンス詳細

### 基本情報
- **status**: 全体的な健康状態（"ok" または "error"）
- **timestamp**: チェック実行時刻（ISO 8601形式）
- **uptime**: サーバーの稼働時間（秒）
- **environment**: 実行環境（"development", "production"等）
- **version**: アプリケーションバージョン

### メモリ使用量
- **memory.used**: 使用中ヒープメモリ（MB）
- **memory.total**: 総ヒープメモリ（MB）

### 外部サービスチェック
- **checks.database**: データベース接続状態
- **checks.redis**: Redis接続状態（利用している場合）

### 環境変数チェック
- **supabaseEnv**: 必要な環境変数の存在確認

## フロントエンドでの使用方法

### 基本的な実装例（JavaScript/TypeScript）
```typescript
interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  memory: {
    used: number;
    total: number;
  };
  checks: {
    database: {
      status: 'ok' | 'error';
      responseTime?: number;
      connection?: string;
      error?: string;
    };
    redis: {
      status: 'ok' | 'error';
      responseTime?: number;
      connection?: string;
      error?: string;
    };
  };
  supabaseEnv: {
    SUPABASE_URL: boolean;
    SUPABASE_ANON_KEY: boolean;
  };
  error?: string;
}

const checkHealth = async (): Promise<HealthCheckResponse> => {
  try {
    const response = await fetch('/api/health', {
      method: 'GET',
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error('Health check request failed');
  }
};
```

### React監視コンポーネントの実装例
```typescript
const SystemHealthMonitor = () => {
  const [healthData, setHealthData] = useState<HealthCheckResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const performHealthCheck = useCallback(async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const data = await checkHealth();
      setHealthData(data);
      setLastCheck(new Date());
    } catch (err) {
      setError('健康チェックに失敗しました');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 定期的な健康チェック
  useEffect(() => {
    performHealthCheck();
    
    const interval = setInterval(performHealthCheck, 30000); // 30秒ごと
    return () => clearInterval(interval);
  }, [performHealthCheck]);

  const getStatusColor = (status: string) => {
    return status === 'ok' ? 'green' : 'red';
  };

  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}時間 ${minutes}分`;
  };

  if (isLoading && !healthData) {
    return <div>システム状態を確認中...</div>;
  }

  if (error && !healthData) {
    return (
      <div className="health-error">
        <p>❌ {error}</p>
        <button onClick={performHealthCheck}>再試行</button>
      </div>
    );
  }

  return (
    <div className="health-monitor">
      <h2>システム健康状態</h2>
      
      <div className="overall-status">
        <span 
          className="status-indicator"
          style={{ color: getStatusColor(healthData?.status || 'error') }}
        >
          ● {healthData?.status === 'ok' ? '正常' : 'エラー'}
        </span>
        {lastCheck && (
          <span className="last-check">
            最終確認: {lastCheck.toLocaleTimeString()}
          </span>
        )}
      </div>

      {healthData && (
        <>
          <div className="basic-info">
            <div>稼働時間: {formatUptime(healthData.uptime)}</div>
            <div>環境: {healthData.environment}</div>
            <div>バージョン: {healthData.version}</div>
          </div>

          <div className="memory-info">
            <h3>メモリ使用量</h3>
            <div>
              使用中: {healthData.memory.used}MB / {healthData.memory.total}MB
            </div>
            <div className="memory-bar">
              <div 
                className="memory-usage"
                style={{
                  width: `${(healthData.memory.used / healthData.memory.total) * 100}%`,
                  backgroundColor: healthData.memory.used / healthData.memory.total > 0.8 ? 'red' : 'green'
                }}
              />
            </div>
          </div>

          <div className="service-checks">
            <h3>外部サービス</h3>
            <div className="service-item">
              <span>データベース: </span>
              <span style={{ color: getStatusColor(healthData.checks.database.status) }}>
                {healthData.checks.database.status === 'ok' ? '接続OK' : 'エラー'}
              </span>
              {healthData.checks.database.responseTime && (
                <span> ({healthData.checks.database.responseTime}ms)</span>
              )}
            </div>
            
            <div className="service-item">
              <span>Redis: </span>
              <span style={{ color: getStatusColor(healthData.checks.redis.status) }}>
                {healthData.checks.redis.status === 'ok' ? '接続OK' : 'エラー'}
              </span>
              {healthData.checks.redis.responseTime && (
                <span> ({healthData.checks.redis.responseTime}ms)</span>
              )}
            </div>
          </div>

          <div className="env-checks">
            <h3>環境設定</h3>
            <div>Supabase URL: {healthData.supabaseEnv.SUPABASE_URL ? '✅' : '❌'}</div>
            <div>Supabase Key: {healthData.supabaseEnv.SUPABASE_ANON_KEY ? '✅' : '❌'}</div>
          </div>
        </>
      )}

      <button onClick={performHealthCheck} disabled={isLoading}>
        {isLoading ? '確認中...' : '手動チェック'}
      </button>
    </div>
  );
};
```

### 管理者向けシンプル監視の実装例
```typescript
const SimpleHealthIndicator = () => {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const data = await checkHealth();
        setIsHealthy(data.status === 'ok');
      } catch {
        setIsHealthy(false);
      }
    };

    checkStatus();
    const interval = setInterval(checkStatus, 60000); // 1分ごと
    return () => clearInterval(interval);
  }, []);

  if (isHealthy === null) {
    return <div className="health-unknown">⚪ 状態確認中</div>;
  }

  return (
    <div className={`health-indicator ${isHealthy ? 'healthy' : 'unhealthy'}`}>
      {isHealthy ? '🟢 システム正常' : '🔴 システム異常'}
    </div>
  );
};
```

### アラート機能付きの実装例
```typescript
const HealthAlertSystem = () => {
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const data = await checkHealth();
        
        if (data.status === 'ok') {
          setConsecutiveFailures(0);
          setAlertShown(false);
        } else {
          setConsecutiveFailures(prev => prev + 1);
        }
      } catch {
        setConsecutiveFailures(prev => prev + 1);
      }
    };

    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  // 3回連続で失敗したらアラート
  useEffect(() => {
    if (consecutiveFailures >= 3 && !alertShown) {
      alert('⚠️ システムに問題が発生しています。管理者に連絡してください。');
      setAlertShown(true);
    }
  }, [consecutiveFailures, alertShown]);

  return null; // バックグラウンドで動作
};
```

## 監視・運用での使用

### Docker健康チェック設定例
```dockerfile
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

### ロードバランサー設定例（nginx）
```nginx
upstream app {
    server app1:3000;
    server app2:3000;
}

# 健康チェック設定
location /health {
    proxy_pass http://app/api/health;
    proxy_connect_timeout 1s;
    proxy_send_timeout 1s;
    proxy_read_timeout 1s;
}
```

### 監視スクリプト例
```bash
#!/bin/bash
# health-check.sh

ENDPOINT="https://your-app.com/api/health"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $ENDPOINT)

if [ $RESPONSE -eq 200 ]; then
    echo "✅ Health check passed"
    exit 0
else
    echo "❌ Health check failed with status: $RESPONSE"
    exit 1
fi
```

## エラーハンドリング
- サービス正常時は200ステータス
- 一部サービス異常時は503ステータス
- 完全なサービス停止時は応答なし
- タイムアウト設定を適切に行うこと

## セキュリティ考慮事項
- 認証不要だが、機密情報は含まない
- 内部サービスの詳細は最小限に留める
- DDoS攻撃の対象になり得るため、レート制限を検討
- 本番環境では詳細なエラー情報を制限

## パフォーマンス考慮事項
- 軽量で高速なレスポンスを維持
- データベースクエリは最小限に
- キャッシュ機能は使用しない（リアルタイム性重視）
- タイムアウト設定は短めに（1-3秒）

## 使用シナリオ
1. **インフラ監視**: Dockerコンテナの健康状態チェック
2. **ロードバランサー**: トラフィック振り分けの判断材料
3. **自動復旧**: 異常検知時の自動再起動トリガー
4. **監視ダッシュボード**: システム状態の可視化
5. **デプロイ確認**: 新バージョンの動作検証

## 注意事項
- このAPIは外部監視ツールから頻繁にアクセスされる
- レスポンス形式の変更は慎重に行う
- 障害時は可能な限り503ステータスで応答する
- ログ出力は適度に制限する（大量アクセスのため） 