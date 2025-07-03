# 環境整合性分析レポート

## 発見された問題

### 1. 環境変数命名の不整合

#### 現在の状況

- **パスワードリセットAPI** (`/api/auth/reset-password/request/route.ts`):
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` を期待
- **他のサーバーサイドコード** (`/lib/server/database/supabase.ts`等):
  - `SUPABASE_ANON_KEY` を使用

#### ローカル環境 (.env.local)

```env
# 存在する
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co

# 存在しない（これが500エラーの原因）
# NEXT_PUBLIC_SUPABASE_ANON_KEY=missing
```

#### Vercel環境

```
NEXT_PUBLIC_SUPABASE_ANON_KEY ✅ (Production)
SUPABASE_ANON_KEY ❓ (存在不明)
NEXT_PUBLIC_SUPABASE_URL ✅ (Production)
```

### 2. 設計思想の混乱

#### Next.js環境変数の正しい使い分け

- **`NEXT_PUBLIC_`プレフィックス**: クライアントサイド（ブラウザ）で使用
- **プレフィックスなし**: サーバーサイド（APIルート、サーバーコンポーネント）で使用

#### 現在の問題

- APIルート（サーバーサイド）で `NEXT_PUBLIC_SUPABASE_ANON_KEY` を使用
- これは設計上不適切

### 3. 具体的な不整合箇所

#### 🔴 問題のあるファイル

1. `/api/auth/reset-password/request/route.ts` (line 21)

   ```typescript
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   ```

2. `/api/test/password-reset/route.ts` (line 50, 51)
   ```typescript
   apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
   Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
   ```

#### ✅ 正しく実装されているファイル

1. `/lib/server/database/supabase.ts` (line 20)

   ```typescript
   const anonKey = process.env.SUPABASE_ANON_KEY;
   ```

2. `/lib/server/config/database.ts` (line 39)
   ```typescript
   SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY || '',
   ```

## 修正方針

### オプション1: サーバーサイド統一（推奨）

- APIルートで `SUPABASE_ANON_KEY` を使用
- 既存のサーバーサイドコードと整合性を保つ
- Next.jsの設計思想に準拠

### オプション2: クライアントサイド統一（非推奨）

- 全てのサーバーサイドコードを `NEXT_PUBLIC_SUPABASE_ANON_KEY` に変更
- セキュリティ上の懸念（クライアントサイドに露出）

## 推奨修正手順

1. **APIルートの修正**: `NEXT_PUBLIC_SUPABASE_ANON_KEY` → `SUPABASE_ANON_KEY`
2. **ローカル環境変数の確認**: `.env.local`に必要な変数が存在することを確認
3. **Vercel環境変数の整理**: 不要な重複を削除
4. **テスト実行**: ローカル→Vercel順でテスト

## 修正後の期待される状態

### ローカル環境

```env
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_URL=https://mjhqeagxibsklugikyma.supabase.co
```

### Vercel環境

```
SUPABASE_ANON_KEY (Production, Preview, Development)
NEXT_PUBLIC_SUPABASE_URL (Production)
```

### 統一されたサーバーサイドコード

```typescript
// 全てのAPIルートで統一
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
```
