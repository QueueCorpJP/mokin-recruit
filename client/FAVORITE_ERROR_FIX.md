# お気に入り機能エラー修正レポート

## 問題の概要

お気に入り機能で以下のエラーが発生していました：

```
POST /api/candidate/favorite 404 in 638ms
求人エラー: {
  code: 'PGRST116',
  details: 'The result contains 0 rows',
  hint: null,
  message: 'JSON object requested, multiple (or no) rows returned' 
}
```

## 根本原因

1. **データベーステーブルの不足**: `job_postings`, `company_accounts`, `favorites` テーブルが存在しない
2. **テストデータの不足**: 指定された求人ID `4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91` のデータが存在しない
3. **エラーハンドリングの不備**: 適切なエラーメッセージとステータスコードが設定されていない

## 実施した修正

### 1. エラーハンドリングの改善

**ファイル**: `client/src/app/api/candidate/favorite/route.ts`

#### 主な改善点：

- **テーブル存在確認の追加**
  ```typescript
  const { data: tableCheck, error: tableError } = await supabase
    .from('job_postings')
    .select('count', { count: 'exact', head: true });
  ```

- **詳細なエラーメッセージ**
  - 求人が存在しない場合: 404エラー
  - 求人が公開されていない場合: 403エラー
  - テーブルが存在しない場合: 503エラー

- **適切なHTTPステータスコード**
  - `404`: 求人が存在しない
  - `403`: 求人が非公開
  - `409`: 既にお気に入りに追加済み
  - `503`: データベース設定問題

- **デバッグ情報の追加**
  ```typescript
  debug: {
    jobPostingId: job_posting_id,
    jobExists: !!allJobData,
    jobStatus: allJobData?.status,
    errorCode: allJobError?.code
  }
  ```

### 2. データベーステーブル作成スクリプト

**ファイル**: `client/scripts/create-missing-tables.js`

#### 作成されるテーブル：

- `company_accounts`: 企業アカウント情報
- `company_users`: 企業ユーザー情報
- `job_postings`: 求人投稿情報
- `favorites`: お気に入り情報
- `messages`: メッセージ情報

#### テストデータ：

- テスト企業アカウント
- 指定されたID `4fa2f07c-be6a-4fa3-8b1e-3a48490fbe91` の求人データ
- 追加のテスト求人データ

### 3. データベース状況確認API

**ファイル**: `client/src/app/api/test/database-status/route.ts`

#### 機能：

- **GET**: データベースの状況確認
  - 各テーブルの存在確認
  - レコード数の確認
  - 特定求人IDの存在確認

- **POST**: テストデータの作成
  - テスト企業アカウントの作成
  - テスト求人データの作成

### 4. テストページの作成

**ファイル**: `client/src/app/test-favorite/page.tsx`

#### 機能：

- データベース状況の確認
- テストデータの作成
- お気に入り機能のテスト
- 結果の可視化

## 修正後の動作フロー

### 1. エラー発生時の適切な処理

```typescript
// テーブル存在確認
if (tableError) {
  return NextResponse.json({
    success: false,
    error: 'データベースの設定に問題があります。管理者にお問い合わせください。',
    debug: { suggestion: 'job_postingsテーブルが存在しない可能性があります' }
  }, { status: 503 });
}

// 求人存在確認
if (allJobError && allJobError.code === 'PGRST116') {
  return NextResponse.json({
    success: false,
    error: '指定された求人が存在しません。',
    debug: { suggestion: '有効な求人IDを指定してください' }
  }, { status: 404 });
}
```

### 2. TypeScriptエラーの修正

```typescript
// 配列として返される可能性を考慮
const jobPosting = Array.isArray(newFavorite.job_postings) 
  ? newFavorite.job_postings[0] 
  : newFavorite.job_postings;
```

## 使用方法

### 1. データベースセットアップ

```bash
# テーブル作成スクリプトの実行
cd client
node scripts/create-missing-tables.js
```

### 2. データベース状況確認

```bash
# ブラウザで以下にアクセス
http://localhost:3000/test-favorite
```

### 3. API直接テスト

```bash
# データベース状況確認
curl http://localhost:3000/api/test/database-status

# テストデータ作成
curl -X POST http://localhost:3000/api/test/database-status \
  -H "Content-Type: application/json" \
  -d '{"action": "create-test-job"}'
```

## 今後の改善点

1. **認証機能の統合**: テストページでの認証トークン取得
2. **マイグレーション管理**: Supabaseマイグレーションファイルの整備
3. **エラー監視**: 本番環境でのエラー監視とアラート
4. **パフォーマンス最適化**: データベースクエリの最適化
5. **テストカバレッジ**: 自動テストの追加

## 検証項目

- [ ] データベーステーブルの存在確認
- [ ] テストデータの作成確認
- [ ] お気に入り追加機能の動作確認
- [ ] エラーハンドリングの動作確認
- [ ] 適切なHTTPステータスコードの返却確認

## 関連ファイル

- `client/src/app/api/candidate/favorite/route.ts` - メインのお気に入りAPI
- `client/scripts/create-missing-tables.js` - テーブル作成スクリプト
- `client/src/app/api/test/database-status/route.ts` - データベース状況確認API
- `client/src/app/test-favorite/page.tsx` - テストページ
- `client/FAVORITE_ERROR_FIX.md` - この修正レポート