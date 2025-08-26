# 🔧 Node.js SetCppgcReference Error Fix

## 問題の原因
Node.js v22系でのV8ガベージコレクション機構の変更により、以下のエラーが発生：
```
node::SetCppgcReference+16599
```

## 実装した修正内容

### 1. Node.jsバージョン制限
- `.nvmrc` ファイル追加（推奨: v20.18.2）
- `package.json` のengines設定を更新（v20.0.0以上、v23.0.0未満）
- バージョンチェックスクリプト追加

### 2. メモリ管理最適化
- Next.js設定でTurbopack無効化（メモリリーク防止）
- Webpack最適化設定の追加
- NODE_OPTIONSでヒープサイズ拡張（4GB）

### 3. 依存関係の最適化
- bcryptjsのブラウザ互換バージョン使用
- 不要なNode.jsポリフィル削除
- チャンクサイズの最適化

### 4. 監視・復旧ツール
- メモリ監視スクリプト（`monitor-memory.js`）
- 自動修復スクリプト（`fix-memory-leak.js`）
- PM2設定ファイル（自動再起動）

## 使用方法

### 初回セットアップ
```bash
# Node.js v20に切り替え
nvm install 20.18.2
nvm use 20.18.2

# クリーンインストール
npm run fix:memory
```

### 開発サーバー起動
```bash
# 通常起動（メモリ最適化済み）
npm run dev

# メモリ監視付き起動
npm run monitor:memory & npm run dev
```

### エラーが再発した場合
```bash
# 1. 完全クリーンアップ
npm run fix:memory

# 2. Node.jsバージョン確認
node --version  # v20.x.xであることを確認

# 3. 再起動
npm run dev
```

### プロダクション環境
```bash
# PM2で起動（自動再起動機能付き）
pm2 start ecosystem.config.js
pm2 logs
```

## 予防措置
1. **必ずNode.js v20.xを使用**（v22.xは使用しない）
2. 定期的にメモリ使用状況を確認
3. 長時間稼働時は定期的に再起動
4. `npm run monitor:memory`でメモリリークを監視

## トラブルシューティング
- エラーが続く場合は`NODE_OPTIONS`の値を調整
- Docker使用時は`docker-compose.override.yml`の設定を確認
- Windows環境では管理者権限で実行

## 関連ファイル
- `.nvmrc` - Node.jsバージョン指定
- `scripts/check-node-version.js` - バージョンチェック
- `scripts/fix-memory-leak.js` - 自動修復
- `scripts/monitor-memory.js` - メモリ監視
- `ecosystem.config.js` - PM2設定
- `docker-compose.override.yml` - Docker設定