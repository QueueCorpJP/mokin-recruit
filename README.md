## Mokin Recruit

候補者（求職者）と企業を直接つなぐ転職プラットフォームです。スカウト、求人管理、メッセージ、選考進捗
などの機能を備えています。

### 主な機能

- 候補者: 会員登録/認証、プロフィール、求人検索、スカウト受信、メッセージ、進捗確認
- 企業: アカウント/メンバー管理、求人作成/掲載、候補者検索、スカウト送信、進捗管理
- 管理: ユーザー/企業管理、求人審査、NG ワード、監視

### 技術スタック

- Next.js 14 (App Router), React 18, TypeScript
- Tailwind CSS, Radix UI, React Hook Form, Zod, Zustand
- Supabase (Auth/DB/Storage) + @supabase/ssr

## 始め方

### 前提

- Node.js 18 以上 / npm

### セットアップ

```bash
npm install
cp .env.local.example .env.local  # 例が無い場合は作成
# 必須（例）
# NEXT_PUBLIC_SUPABASE_URL=...
# NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### 開発サーバー

```bash
npm run dev
# http://localhost:3000
```

### ビルド/起動

```bash
npm run build
npm start
```

### テスト

```bash
npm run test        # 一回実行
npm run test:watch  # 変更監視
```

### CI

- GitHub Actions で PR/`main` に対して `type-check`/`lint`/`test`/`build` を自動実行します。

### 環境変数

- `.env.local.example` を参考に `.env.local` を作成してください。

### Lint/型チェック

```bash
npm run lint
npm run type-check
```

## ディレクトリ概要

```
.
├─ public/                # 静的アセット
├─ src/
│  ├─ app/                # Next.js App Router（candidate/company/admin 等）
│  ├─ components/         # UI/機能コンポーネント
│  ├─ lib/                # ライブラリ/ユーティリティ
│  ├─ hooks/              # カスタムフック
│  ├─ stores/             # Zustand ストア
│  └─ types/              # 型定義
├─ supabase/
│  ├─ config.toml
│  └─ migrations/         # DBマイグレーション
└─ package.json
```

## Supabase（任意）

- DB スキーマは `supabase/migrations` で管理しています。
- Supabase CLI を利用する場合は公式ドキュメントに従ってください。

## 利用可能スクリプト（抜粋）

- `npm run dev`: 開発サーバー起動
- `npm run build`: ビルド
- `npm start`: 本番起動
- `npm run lint`: ESLint 実行
- `npm run type-check`: TypeScript 型チェック

## ライセンス

MIT
