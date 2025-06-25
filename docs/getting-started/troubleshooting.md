# 🔧 Troubleshooting Guide - Mokin Recruit

## 🎯 よくある問題と解決方法

開発中に発生する一般的な問題とその解決方法をまとめています。

---

## 🐳 Docker関連の問題

### **Docker起動エラー**

**症状**: `docker-compose up` で起動しない

**解決方法**:

```bash
# 1. コンテナとボリュームをクリーンアップ
docker-compose down -v
docker system prune -f

# 2. 再ビルド
docker-compose build --no-cache

# 3. 再起動
docker-compose up -d
```

### **ポートが使用中エラー**

**症状**: `Port 3000 is already in use`

**解決方法**:

```bash
# 使用中のプロセスを確認
lsof -i :3000
netstat -tulpn | grep :3000

# プロセスを終了
sudo kill -9 <PID>

# または別のポートを使用
docker-compose up -d --scale client=0
docker run -p 3001:3000 mokin-recruit-client
```

### **Docker Compose接続エラー**

**症状**: サービス間の通信が失敗する

**解決方法**:

```bash
# ネットワーク状態確認
docker network ls
docker network inspect mokin-recruit_mokin-recruit-network

# DNS設定確認
docker-compose exec client nslookup redis
docker-compose exec client ping redis
```

---

## 🗄️ データベース関連の問題

### **Supabase接続エラー**

**症状**: `FATAL: Tenant or user not found`

**解決方法**:

```bash
# 1. 環境変数確認
echo $SUPABASE_URL
echo $SUPABASE_ANON_KEY

# 2. 接続テスト
curl -H "apikey: $SUPABASE_ANON_KEY" \
     -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
     "$SUPABASE_URL/rest/v1/"

# 3. 環境変数再設定
cp .env.example .env
# .envファイルを正しく設定
```

### **スキーマ初期化エラー**

**症状**: テーブルが存在しない

**解決方法**:

1. [Supabase Dashboard](https://supabase.com/dashboard) にアクセス
2. SQL Editorで `docs/database/schema.sql` を実行
3. 実行結果を確認

```sql
-- テーブル存在確認
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

### **マイグレーションエラー**

**症状**: データベース構造の不整合

**解決方法**:

```bash
# Supabase CLI使用（推奨）
npx supabase db reset
npx supabase db push

# 手動リセット（注意：データ消失）
# Supabase Dashboard > Database > Reset Database
```

---

## 🔐 認証関連の問題

### **JWT トークンエラー**

**症状**: `Invalid JWT token`

**解決方法**:

```bash
# 1. JWT_SECRET確認
echo $JWT_SECRET

# 2. トークン検証
node -e "
const jwt = require('jsonwebtoken');
const token = 'your-token-here';
const secret = process.env.JWT_SECRET;
try {
  const decoded = jwt.verify(token, secret);
  console.log('Valid token:', decoded);
} catch (err) {
  console.error('Invalid token:', err.message);
}
"
```

### **Supabase Auth設定エラー**

**症状**: 認証機能が動作しない

**解決方法**:

1. Supabase Dashboard > Authentication > Settings確認
2. Site URL設定: `http://localhost:3000`
3. Redirect URLs追加: `http://localhost:3000/auth/callback`

---

## 📦 Node.js / npm関連の問題

### **依存関係エラー**

**症状**: `Module not found` エラー

**解決方法**:

```bash
# 1. node_modules削除
rm -rf node_modules package-lock.json

# 2. 再インストール
npm install

# 3. 特定パッケージの問題
npm ls --depth=0
npm audit fix
```

### **TypeScript型エラー**

**症状**: 型定義が見つからない

**解決方法**:

```bash
# 1. 型定義再生成
npm run supabase:types

# 2. 型チェック
npm run type-check

# 3. TypeScript設定確認
npx tsc --showConfig
```

### **ESLint / Prettier エラー**

**症状**: リンターエラーが大量発生

**解決方法**:

```bash
# 1. 自動修正
npm run lint:fix
npm run format

# 2. 設定確認
npx eslint --print-config src/app/page.tsx
```

---

## 🌐 ネットワーク関連の問題

### **IPv6接続エラー (WSL2)**

**症状**: `Network is unreachable`

**解決方法**:

```bash
# 1. DNS設定変更
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
echo "nameserver 8.8.4.4" | sudo tee -a /etc/resolv.conf

# 2. IPv6無効化
sudo sysctl -w net.ipv6.conf.all.disable_ipv6=1
sudo sysctl -w net.ipv6.conf.default.disable_ipv6=1

# 3. 設定永続化
echo "net.ipv6.conf.all.disable_ipv6 = 1" | sudo tee -a /etc/sysctl.conf
```

### **CORS エラー**

**症状**: `Access-Control-Allow-Origin` エラー

**解決方法**:

```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },
};
```

---

## 🚀 パフォーマンス関連の問題

### **ビルド時間が長い**

**症状**: `npm run build` が遅い

**解決方法**:

```bash
# 1. Turbopack使用
npm run dev -- --turbo

# 2. キャッシュクリア
rm -rf .next
npm run build

# 3. 並列ビルド設定
export NODE_OPTIONS="--max-old-space-size=4096"
```

### **メモリ不足エラー**

**症状**: `JavaScript heap out of memory`

**解決方法**:

```bash
# 1. Node.jsメモリ制限拡張
export NODE_OPTIONS="--max-old-space-size=8192"

# 2. スワップファイル作成（Linux）
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

---

## 🔍 デバッグ方法

### **ログ確認**

```bash
# Docker ログ
docker-compose logs -f client
docker-compose logs -f redis

# アプリケーションログ
tail -f client/logs/app.log
tail -f client/logs/error.log
```

### **デバッグモード**

```bash
# Node.js デバッグ
NODE_ENV=development DEBUG=* npm run dev

# TypeScript デバッグ
npx tsc --noEmit --pretty
```

### **ネットワークデバッグ**

```bash
# API接続テスト
curl -v http://localhost:3000/api/health

# Supabase接続テスト
curl -H "apikey: $SUPABASE_ANON_KEY" \
     "$SUPABASE_URL/rest/v1/candidates?select=*&limit=1"
```

---

## 📞 サポート・エスカレーション

### **問題が解決しない場合**

1. **ログ収集**: エラーメッセージとスタックトレースを保存
2. **環境情報**: OS、Node.js、Docker バージョンを記録
3. **再現手順**: 問題を再現する最小限の手順を文書化

### **連絡先**

- **開発チーム**: Slack `#mokin-recruit-dev`
- **緊急時**: 技術リーダーまで直接連絡
- **バグレポート**: GitHub Issues

### **情報提供テンプレート**

```markdown
## 問題の概要

[問題の簡潔な説明]

## 環境情報

- OS: [Windows/macOS/Linux]
- Node.js: [バージョン]
- Docker: [バージョン]
- ブラウザ: [ブラウザとバージョン]

## 再現手順

1. [ステップ1]
2. [ステップ2]
3. [ステップ3]

## 期待される結果

[期待していた動作]

## 実際の結果

[実際に起こった動作]

## エラーメッセージ
```

[エラーメッセージをここに貼り付け]

```

## 試行した解決方法
[すでに試したことがあれば記載]
```

---

## 🔄 定期メンテナンス

### **週次メンテナンス**

```bash
# 依存関係更新
npm update
npm audit fix

# Docker イメージ更新
docker-compose pull
docker-compose build --no-cache

# ログローテーション
find ./logs -name "*.log" -mtime +7 -delete
```

### **月次メンテナンス**

```bash
# 未使用リソースクリーンアップ
docker system prune -a
npm cache clean --force

# セキュリティ更新
npm audit
npm outdated
```

---

_このガイドは継続的に更新されます。新しい問題や解決方法があれば、開発チームまでお知らせください。_
