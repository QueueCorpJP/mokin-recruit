# Recruit - 転職プラットフォーム

## 概要


Mokin
Recruit は、候補者（求職者）と企業を直接つなぐ転職プラットフォームです。スカウト機能、求人管理、メッセージング、採用進捗管理など、転職活動に必要な機能を包括的に提供します。


## 主要機能

### 候補者向け機能

- 会員登録・認証・プロフィール管理
- 求人検索・応募・お気に入り管理
- スカウト受信・辞退機能
- 企業とのメッセージング
- 選考進捗確認

### 企業向け機能

- 企業アカウント・グループ管理
- 求人作成・管理・掲載申請
- 候補者検索・スカウト送信
- 採用進捗管理・面接日程調整
- メンバー招待・権限管理

### 管理者向け機能

- 全ユーザー・企業管理
- 求人審査・承認
- NGワード管理・メッセージ監視
- システム分析・レポート

## 技術スタック

### バックエンド

- **Runtime**: Node.js 18+
- **Framework**: Next.js 15 API Routes
- **Language**: TypeScript
- **Database**: PostgreSQL (Supabase)
- **Cache**: Redis 7
- **Database Client**: Supabase Client Library
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Validation**: Zod
- **DI Container**: Inversify.js
- **Testing**: Jest

### フロントエンド

- **Framework**: Next.js 15 (App Router)
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand
- **Forms**: React Hook Form
- **HTTP Client**: Custom API Client
- **Testing**: Jest + Testing Library

### インフラ・開発環境

- **Containerization**: Docker + Docker Compose
- **Monorepo**: npm workspaces
- **CI/CD**: GitHub Actions
- **Linting**: ESLint + Prettier
- **Package Manager**: npm

## プロジェクト構造

### アーキテクチャ概要

本プロジェクトは **ドメイン駆動設計 (DDD)** と **モノレポ構造**
を採用し、スケーラブルで保守性の高いアーキテクチャを実現しています。

```
mokin-recruit/
├── 📁 packages/          # 共有パッケージ（型定義・ユーティリティ・UIコンポーネント）
├── 📁 client/            # フルスタックアプリケーション（Next.js + API Routes + DDD）
├── 📁 docs/              # ドキュメント
├── 📁 .github/           # CI/CD設定
└── 📁 scripts/           # ビルド・デプロイスクリプト
```

### 共有パッケージ構造

```
packages/
├── shared-types/         # 共通型定義パッケージ
│   ├── src/
│   │   ├── domains/      # ドメイン別型定義
│   │   │   ├── candidate.ts
│   │   │   ├── company.ts
│   │   │   ├── job.ts
│   │   │   ├── message.ts
│   │   │   └── admin.ts
│   │   ├── common/       # 共通型定義
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── pagination.ts
│   │   │   └── enums.ts
│   │   └── utils/        # ユーティリティ型
│   │       ├── form.ts
│   │       └── validation.ts
├── shared-utils/         # 共通ユーティリティ（予定）
├── ui-components/        # 再利用可能UIコンポーネント（予定）
└── api-client/           # HTTPクライアント（予定）
```

### フロントエンド構造

```
client/src/
├── app/                  # Next.js App Router
│   ├── (auth)/           # 認証関連ページ（ルートグループ）
│   │   ├── login/
│   │   ├── register/
│   │   └── reset-password/
│   ├── (candidate)/      # 候補者専用ページ
│   │   ├── mypage/
│   │   ├── account/      # プロフィール管理
│   │   ├── message/      # メッセージ機能
│   │   ├── search/       # 求人検索
│   │   ├── job/          # 求人関連
│   │   ├── setting/      # 設定
│   │   └── withdrawal/   # 退会
│   ├── (company)/        # 企業専用ページ
│   │   ├── mypage/
│   │   ├── job/          # 求人管理
│   │   ├── candidate/    # 候補者管理
│   │   ├── scout/        # スカウト機能
│   │   ├── progress/     # 進捗管理
│   │   ├── template/     # テンプレート管理
│   │   └── account/      # 企業アカウント管理
│   ├── (admin)/          # 管理者専用ページ
│   │   ├── dashboard/
│   │   ├── job/          # 求人管理
│   │   ├── message/      # メッセージ監視
│   │   ├── user/         # ユーザー管理
│   │   └── system/       # システム管理
│   └── (public)/         # 公開ページ
│       ├── media/        # メディア
│       ├── news/         # お知らせ
│       ├── contact/      # お問い合わせ
│       └── legal/        # 法的ページ
├── components/           # UIコンポーネント
│   ├── ui/               # 基本UIコンポーネント
│   ├── forms/            # フォームコンポーネント
│   ├── layout/           # レイアウトコンポーネント
│   └── features/         # 機能別コンポーネント
├── lib/                  # クライアントライブラリ
│   ├── api/              # API通信
│   ├── utils/            # ユーティリティ関数
│   ├── constants/        # 定数
│   └── validations/      # バリデーションスキーマ
├── hooks/                # カスタムフック
├── stores/               # 状態管理（Zustand）
└── types/                # クライアント固有型
```

### バックエンド構造（DDD + Next.js API Routes）

```
client/src/lib/server/
├── core/                 # ドメインロジック
│   ├── interfaces/       # インターフェース定義
│   └── services/         # ドメインサービス
├── infrastructure/       # インフラストラクチャレイヤー
│   └── database/         # データベース（Supabase Client Library）
├── controllers/          # HTTPコントローラー
├── container/            # 依存性注入コンテナ（Inversify.js）
├── config/               # 設定管理
├── types/                # 型定義
├── database/             # データベース設定
└── utils/                # ユーティリティ

client/src/app/api/       # Next.js API Routes
├── auth/                 # 認証関連API
│   ├── login/
│   ├── logout/
│   └── register/
├── candidate/            # 候補者関連API（予定）
├── company/              # 企業関連API（予定）
├── job/                  # 求人関連API（予定）
├── message/              # メッセージ関連API（予定）
└── admin/                # 管理者関連API（予定）
```

## 🚀 Vercelデプロイ・デモ環境構築

### 1. 環境変数の設定

```bash
# 環境変数サンプルをコピー
cp .env.example .env.local

# 必要な環境変数を設定（catで確認）
cat .env.local
```

**必要な環境変数:**

```bash
# Supabase設定
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# アプリケーション設定
CORS_ORIGIN=https://your-app.vercel.app
JWT_SECRET=your-jwt-secret
NODE_ENV=production
```

### 2. Vercel CLIでデプロイ

```bash
# Vercel CLIインストール・ログイン
npm i -g vercel
vercel login

# プロジェクト初期化・デプロイ
vercel

# 環境変数設定（CLI経由）
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add CORS_ORIGIN
vercel env add JWT_SECRET

# 本番デプロイ
vercel --prod
```

### 3. デモ確認

デプロイ後、以下のURLでデモを確認:

- **ログイン画面**: `https://your-app.vercel.app/auth/login`
- **API Health**: `https://your-app.vercel.app/api/auth/login`

## 🚀 クイックスタート

**5分で開発開始**: [Quick Start Guide](./docs/getting-started/quick-start.md)

### 前提条件

- Node.js 18.0.0 以上
- npm 8.0.0 以上
- Docker + Docker Compose

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd mokin-recruit
```

### 2. 環境変数の設定

```bash
cp env.example .env
# .env ファイルを編集して適切な値を設定
```

### 3. 依存関係のインストール

```bash
npm run setup
```

### 4. 共有パッケージのビルド

```bash
npm run build --workspace=@mokin-recruit/shared-types
```

### 5. データベースの初期化

```bash
# Docker Compose でサービス起動
npm run docker:up

# データベースマイグレーション実行
npm run db:migrate

# 初期データ投入
npm run db:seed
```

### 6. 開発サーバーの起動

```bash
# 全サービス起動（推奨）
npm run dev

# または個別起動
npm run dev:server  # バックエンドのみ
npm run dev:client  # フロントエンドのみ
```

### 7. アクセス確認

- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:3001
- **メール確認用**: http://localhost:8025 (MailHog)

## 開発ガイドライン

### npm workspaces コマンド

```bash
# 全ワークスペースでの操作
npm run build                    # 全パッケージビルド
npm run test                     # 全パッケージテスト
npm run lint                     # 全パッケージリント

# 特定ワークスペースでの操作
npm run dev --workspace=server   # サーバーのみ開発モード
npm run build --workspace=client # クライアントのみビルド
npm test --workspace=@mokin-recruit/shared-types

# 依存関係の追加
npm install express --workspace=server
npm install react --workspace=client
```

### コーディング規約

- **言語**: TypeScript を使用
- **フォーマット**: Prettier で自動フォーマット
- **リント**: ESLint でコード品質チェック
- **コミット**: Conventional Commits 形式
- **ブランチ**: Git Flow に準拠

### 命名規則

- **ディレクトリ**: kebab-case (`candidate-profile`, `job-posting`)
- **ファイル**:
  - コンポーネント: PascalCase (`CandidateProfile.tsx`)
  - ユーティリティ: camelCase (`candidateService.ts`)
  - 定数: UPPER_SNAKE_CASE (`API_ENDPOINTS`)
- **変数・関数**: camelCase
- **型・インターフェース**: PascalCase
- **列挙型**: PascalCase

### API設計規約

- **RESTful**: REST API設計原則に従う
- **バージョニング**: `/api/v1/` 形式
- **ステータスコード**: 適切なHTTPステータスコードを使用
- **エラーハンドリング**: 統一されたエラーレスポンス形式
- **認証**: Supabase Auth + JWT Bearer Token
- **バリデーション**: Zod によるスキーマ検証

### データベース設計規約

- **命名**: snake_case を使用
- **外部キー**: 適切な制約とインデックス
- **マイグレーション**: 全ての変更をマイグレーションで管理
- **シード**: 開発・テスト用の初期データ

## テスト

### バックエンドテスト

```bash
npm test --workspace=server              # 全テスト実行
npm run test:watch --workspace=server    # ウォッチモード
npm run test:coverage --workspace=server # カバレッジ測定
```

### フロントエンドテスト

```bash
npm test --workspace=client              # 全テスト実行
npm run test:watch --workspace=client    # ウォッチモード
npm run test:coverage --workspace=client # カバレッジ測定
```

### 共有パッケージテスト

```bash
npm test --workspace=@mokin-recruit/shared-types
```

## ビルド・デプロイ

### 本番ビルド

```bash
npm run build                    # 全パッケージビルド
npm run build:server            # サーバーのみ
npm run build:client            # クライアントのみ
```

### Docker本番イメージ

```bash
npm run docker:build            # イメージビルド
npm run docker:up               # サービス起動
npm run docker:down             # サービス停止
```

### 環境別設定

- **開発環境**: `docker-compose.yml`
- **本番環境**: `docker-compose.prod.yml`（予定）

## 主要な設計原則

### 1. ドメイン駆動設計 (DDD)

- **ドメインレイヤー**: ビジネスロジックの中核
- **アプリケーションレイヤー**: ユースケースの実装
- **インフラストラクチャレイヤー**: 外部システムとの連携
- **プレゼンテーションレイヤー**: HTTP API とユーザーインターフェース

### 2. 関心の分離 (Separation of Concerns)

- **機能別分離**: 候補者/企業/管理者/公開の明確な分離
- **レイヤー別分離**: 各レイヤーの責任明確化
- **型定義の共有**: 一元管理による整合性確保

### 3. モノレポのメリット

- **コード共有**: 型定義・ユーティリティの再利用
- **一貫性**: 統一されたツール・設定
- **開発効率**: 単一リポジトリでの管理

### 4. スケーラビリティ

- **水平分割**: 機能別・ドメイン別の分離
- **垂直分割**: レイヤー別の分離
- **型安全性**: TypeScript による静的型チェック

## 貢献ガイドライン

1. Issue の作成・確認
2. フィーチャーブランチの作成
3. コードの実装とテスト
4. Pull Request の作成
5. コードレビュー
6. マージ

## 📚 ドキュメント

### 🚀 すぐに始める

- [Quick Start Guide](./docs/getting-started/quick-start.md) - 5分で開発開始
- [Setup Guide](./docs/getting-started/setup-guide.md) - 詳細セットアップ手順
- [Development Workflow](./docs/getting-started/development-workflow.md) - 開発フロー

### 🏗️ アーキテクチャ・技術仕様

- [Architecture Overview](./docs/architecture/overview.md) - システム全体設計
- [Technical Constraints](./docs/architecture/technical-constraints.md) - 技術的制約
- [Database Schema](./docs/database/schema.sql) - データベース設計

### ⚡ 機能仕様

- [Candidate Features](./docs/features/candidate-features.md) - 候補者機能
- [Company Features](./docs/features/company-features.md) - 企業機能
- [Admin Features](./docs/features/admin-features.md) - 管理者機能

### 🔧 運用・デプロイ

- [Environment Variables](./docs/deployment/environment-variables.md) - 環境変数設定
- [Troubleshooting](./docs/getting-started/troubleshooting.md) - トラブルシューティング

**📖 全ドキュメント**: [docs/README.md](./docs/README.md) - 完全なドキュメント一覧

## ライセンス

MIT License
