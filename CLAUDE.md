# Claude Code Project Guide - Mokin Recruit

## プロジェクト概要

Mokin Recruit は候補者（求職者）と企業を直接つなぐ転職プラットフォームです。

### 主要機能

- **候補者側**: 会員登録/認証、プロフィール管理、求人検索、スカウト受信、メッセージ機能、選考進捗確認
- **企業側**: アカウント管理、求人作成/掲載、候補者検索、スカウト送信、選考進捗管理
- **管理者側**: ユーザー/企業管理、求人審査、NGワード管理、システム監視

## 技術スタック

- **フロントエンド**: Next.js 14 (App Router), React 18, TypeScript
- **スタイリング**: Tailwind CSS, Radix UI
- **フォーム管理**: React Hook Form, Zod
- **状態管理**: Zustand
- **バックエンド**: Supabase (Auth/Database/Storage)
- **認証**: @supabase/ssr

## プロジェクト構造

```
mokin-recruit/
├─ src/
│  ├─ app/                 # Next.js App Router
│  │  ├─ candidate/        # 候補者側ページ
│  │  ├─ company/          # 企業側ページ
│  │  ├─ admin/            # 管理者側ページ
│  │  └─ signup/           # サインアップフロー
│  ├─ components/          # 共通コンポーネント
│  │  ├─ ui/              # UIコンポーネント
│  │  ├─ auth/            # 認証関連コンポーネント
│  │  ├─ candidate/       # 候補者専用コンポーネント
│  │  └─ company/         # 企業専用コンポーネント
│  ├─ lib/                 # ユーティリティ・ライブラリ
│  │  ├─ actions/         # Server Actions
│  │  ├─ supabase/        # Supabase クライアント
│  │  └─ utils/           # ユーティリティ関数
│  ├─ hooks/              # カスタムフック
│  ├─ stores/             # Zustand ストア
│  └─ types/              # TypeScript型定義
├─ supabase/
│  ├─ migrations/         # DBマイグレーション
│  └─ config.toml        # Supabase設定
└─ public/               # 静的アセット
```

## 開発コマンド

### 必須コマンド（コード変更後に実行）

```bash
npm run type-check    # TypeScript型チェック
npm run lint          # ESLintチェック
npm run test          # テスト実行
```

### 日常的に使用するコマンド

```bash
npm run dev           # 開発サーバー起動 (http://localhost:3000)
npm run build         # プロダクションビルド
npm start            # プロダクションサーバー起動
npm run lint:fix     # ESLintエラー自動修正
npm run clean        # ビルドキャッシュクリア
```

### テストコマンド

```bash
npm run test         # テスト単発実行
npm run test:watch   # テスト監視モード
```

## コーディング規約

### TypeScript/React

- 関数コンポーネントを使用（クラスコンポーネントは使わない）
- TypeScriptの型定義を必須とする
- `'use client'` ディレクティブは必要な場合のみ使用
- Server ComponentsとClient Componentsの使い分けを意識

### スタイリング

- Tailwind CSSクラスを使用
- カスタムCSSは極力避ける
- レスポンシブデザインにはTailwindのブレークポイントを使用（`md:`, `lg:` など）
- 日本語フォントには `font-['Noto_Sans_JP']` を使用

### ファイル命名規則

- コンポーネント: PascalCase（例: `SignupClient.tsx`）
- ページ: `page.tsx`
- レイアウト: `layout.tsx`
- Server Actions: camelCase（例: `actions.ts`）
- ユーティリティ: camelCase（例: `formatDate.ts`）

### インポート順序

1. React/Next.js関連
2. 外部ライブラリ
3. 内部コンポーネント
4. 内部ユーティリティ
5. 型定義

## Supabase データベース構造

### 主要テーブル

- `candidates`: 候補者情報
- `companies`: 企業情報
- `company_members`: 企業メンバー
- `jobs`: 求人情報
- `scouts`: スカウト情報
- `messages`: メッセージ
- `applications`: 応募情報
- `education`: 学歴情報
- `skills`: スキル情報
- `expectations`: 希望条件

## 環境変数

必須の環境変数（`.env.local`に設定）:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ADMIN_JWT_SECRET=
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
NEXT_PUBLIC_BASE_URL=
```

## 重要な注意事項

### セキュリティ

- 認証情報や秘密鍵をコードにハードコードしない
- Server Actionsでは必ず認証チェックを行う
- RLS（Row Level Security）ポリシーを適切に設定

### パフォーマンス

- 画像は最適化して使用（Next.js Imageコンポーネント）
- 不要なre-renderを避ける（React.memo, useMemo, useCallback）
- データフェッチは必要最小限に

### エラーハンドリング

- try-catchブロックで適切にエラーをキャッチ
- ユーザーフレンドリーなエラーメッセージを表示
- エラーログは適切に記録

### データ一貫性管理（重要）

**問題**: スカウト送信時のチケット消費が実装されていなかった事例

**原因分析**:

1. **分離された実装**: 表示用の関数（`getScoutTicketsRemaining`）は新しい`remaining_tickets`フィールドを使用していたが、実際の送信処理（`sendScout`）は古い計算ベースの実装のまま残っていた
2. **不完全な仕様変更**:
   `scout_sends`テーブルからの計算方式から`remaining_tickets`直接管理方式への変更時に、関連するすべての関数を更新しなかった
3. **テスト不足**: 実際のスカウト送信フローでの動作確認が不十分だった

**予防策**:

- **一括変更の徹底**: データ構造や仕様を変更する際は、関連するすべての関数・コンポーネントを洗い出し、一括で更新する
- **データフローの追跡**: 特定のデータ（ここでは残りチケット数）がどこで参照・更新されるかを明確に把握する
- **機能単位でのテスト**: UI表示だけでなく、実際のユーザー操作フローを通じて動作確認を行う
- **検索コマンド活用**: `grep`や`rg`を使って関連コードを網羅的に検索し、更新漏れを防ぐ

**チェックポイント**:

- データベーススキーマを変更したら → 関連するServer Actionsをすべて確認
- 新しいフィールドを追加したら → そのフィールドを使用するすべての場所で一貫性を保つ
- 計算ロジックを変更したら → 参照と更新の両方の処理を同時に修正する

## サインアップフロー

1. `/signup` - メールアドレス入力
2. `/signup/verify` - メール認証
3. `/signup/password` - パスワード設定
4. `/signup/profile` - 基本情報入力
5. `/signup/career-status` - キャリア状況
6. `/signup/recent-job` - 直近の職歴
7. `/signup/resume` - 履歴書アップロード
8. `/signup/education` - 学歴
9. `/signup/skills` - スキル
10. `/signup/expectation` - 希望条件
11. `/signup/summary` - 確認画面
12. `/signup/complete` - 完了画面

## トラブルシューティング

### ビルドエラー

```bash
npm run clean        # キャッシュクリア
npm install          # 依存関係再インストール
npm run build        # 再ビルド
```

### 型エラー

```bash
npm run type-check   # 型エラーチェック
```

### ESLintエラー

```bash
npm run lint:fix     # 自動修正可能なエラーを修正
```

## Git ブランチ戦略

- `main`: 本番環境
- `develop`: 開発環境
- `feature/*`: 新機能開発
- `fix/*`: バグ修正
- `hotfix/*`: 緊急修正

## デプロイメント

プロダクションビルドとスタンドアロンモード:

```bash
npm run build
npm run start:standalone
```

## 連絡先・リソース

- Supabase Dashboard: プロジェクト設定から確認
- エラーログ: Supabase Dashboardのログセクション
- 環境変数の例: `docs/ENV.example.md`

---

_このファイルは Claude
Code がプロジェクトを理解し、適切なサポートを提供するための情報を含んでいます。_
