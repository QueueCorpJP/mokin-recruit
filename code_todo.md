本プロジェクトは納品後の運用・保守を前提としていないため、

**再現性・安全性・最低限の品質保証** を目的としたルールを適用します。

### 1. 命名規則

- 変数・関数：camelCase（例：userName）
- 型・コンポーネント：PascalCase（例：UserProfile）
- 定数：UPPER_SNAKE_CASE（例：MAX_RETRY_COUNT）
    
    👉 可読性を統一し、後続開発者にもわかりやすくします。
    

### 2. 秘密情報管理

- APIキー・パスワードは `.env` に保存、環境ごとに分離
- リポジトリへの直コミットは禁止
    
    👉 情報漏えいを防止。
    

### 3. 依存ライブラリ管理

- ロックファイルを必ず同梱（package-lock.json / pnpm-lock.yaml）
- `npm audit / pnpm audit` で High以上の脆弱性はブロック
    
    👉 誰がビルドしても同じ環境で再現可能、脆弱性を最小化。
    

### 4. 型とデータ検証

- TypeScript strict オプションを有効化（noImplicitAnyなど）
- API入出力は zod / yup によるバリデーション必須

### 5. エラー処理とログ

- 非同期処理はすべて try/catch
- エラーは分類コードを付与（例：AUTH_001, DB_002）
- 個人情報（PII）はログに出力せず、必要時はマスク

### 6. ディレクトリ構成

```
src/
  components/   → UI部品
  features/     → 機能単位
  lib/          → 共通処理
  pages/        → 画面（Next.jsの場合）

```

### 7. コード整形

- ESLint（推奨設定）＋ Prettier を導入
- 納品前に必ず整形を実行
    
    👉 コードのばらつきを防止。