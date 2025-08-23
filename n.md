# N+1問題検出レポート

## 概要
mokin-recruitプロジェクトのサーバーコンポーネント（actions.tsファイル）におけるN+1問題の包括的な分析結果です。
company配下を含む全てのサーバーコンポーネントを網羅的に調査済みです。

## 🔴 重大なN+1問題（要修正）

### 1. `candidate/search/setting/actions.ts`
**関数**: `searchJobsServerOptimized()`
- **問題箇所**: Line 183-186
- **詳細**: 求人検索後、企業情報を別クエリで取得
- **影響度**: ⭐⭐⭐⭐⭐ （最も影響大）
- **理由**: 検索は最も頻繁に使用される機能で、検索結果が増えると企業数も増加
```typescript
// 問題のコード
const { data: companies } = await supabase
  .from('company_accounts')
  .select('id, company_name')
  .in('id', companyIds);
```

### 2. `candidate/job/favorite/actions.ts`
**関数**: `getFavoriteList()`
- **問題箇所**: Line 110-113
- **詳細**: お気に入り取得後、企業情報を別クエリで取得
- **影響度**: ⭐⭐⭐⭐
- **理由**: お気に入りが多いユーザーでパフォーマンス低下
```typescript
// 問題のコード
const { data: companies } = await supabase
  .from('company_accounts')
  .select('id, company_name, industry')
  .in('id', companyAccountIds);
```

### 3. `company/job/actions.ts`
**関数**: `getCompanyJobs()`
- **問題箇所**: Line 144-147
- **詳細**: 求人取得後、グループ名を別クエリで取得
- **影響度**: ⭐⭐⭐⭐
- **理由**: 企業の求人管理画面で頻繁に使用
```typescript
// 問題のコード
const { data: users } = await supabase
  .from('company_users')
  .select('id, full_name')
  .in('id', groupIds);
```

### 4. `candidate/mypage/actions.ts`
**関数**: `getCandidateMessages()`
- **問題箇所**: Line 50-87
- **詳細**: ルーム取得後、メッセージを別クエリで取得
- **影響度**: ⭐⭐⭐
- **理由**: メッセージ数に比例して遅延
```typescript
// 問題のコード（2段階のクエリ）
// 1. ルーム取得
const { data: rooms } = await supabase
  .from('rooms')
  .select('id, company_group_id')
  .eq('candidate_id', candidateId);

// 2. メッセージ取得
const { data: messages } = await supabase
  .from('messages')
  .select(`...`)
  .in('room_id', roomIds);
```

### 5. `admin/media/edit/actions.ts`
**関数**: `saveArticle()`
- **問題箇所**: Line 165-198
- **詳細**: タグ処理でループ内クエリ
- **影響度**: ⭐⭐⭐
- **理由**: タグ数に比例してクエリ数が増加
```typescript
// 問題のコード
for (const tagName of tagNames) {
  const { data: existingTag } = await supabase
    .from('article_tags')
    .select('*')
    .eq('name', tagName)
    .single();
  // ... さらにINSERTクエリ
}
```

## 🟡 潜在的なN+1問題（将来的にリスク）

### 1. `candidate/[company_id]/actions.ts`
**関数**: `getCompanyJobPostings()`
- **現状**: 企業IDで求人を取得（問題なし）
- **リスク**: 将来的に各求人の追加情報（応募数など）を取得する場合

### 2. `candidate/search/setting/[id]/actions.ts`
**関数**: `getJobDetailServer()`
- **現状**: 2つのクエリだが、単一レコード取得なので問題なし
- **リスク**: 関連求人を表示する場合

## ✅ N+1問題なし（最適化済み）

### 効率的な実装例
- `admin/job/actions.ts` - 単一更新のみ
- `candidate/setting/password/actions.ts` - 単一ユーザー更新
- `auth/actions.ts` - 認証処理のみ

### company配下のサーバーコンポーネント（調査完了）
- `company/auth/login/actions.ts` - 認証処理のみ（N+1問題なし）
- `company/auth/reset-password/actions.ts` - パスワードリセット処理のみ（N+1問題なし）
- `company/setting/mail/actions.ts` - メール認証処理のみ（N+1問題なし）

## 改善提案

### 1. JOINを使用した最適化
```typescript
// 改善例: candidate/search/setting/actions.ts
const { data: jobs } = await supabase
  .from('job_postings')
  .select(`
    *,
    company_accounts (
      id,
      company_name
    )
  `)
  .eq('status', 'PUBLISHED');
```

### 2. バッチ処理の最適化
現在の実装でも一部最適化されているが、さらに改善可能：
- 重複IDの除去 ✅ (実装済み)
- IN句での一括取得 ✅ (実装済み)
- キャッシュの導入 ❌ (未実装)

### 3. 優先度別対応計画

#### 第1優先（即座に対応すべき）
1. `candidate/search/setting/actions.ts` - 検索機能
2. `candidate/job/favorite/actions.ts` - お気に入り機能

#### 第2優先（早期対応推奨）
3. `company/job/actions.ts` - 企業求人管理
4. `admin/media/edit/actions.ts` - タグ処理

#### 第3優先（余裕があれば対応）
5. `candidate/mypage/actions.ts` - マイページメッセージ

## パフォーマンス改善の期待値

| ファイル | 現在のクエリ数 | 改善後 | 削減率 |
|---------|--------------|--------|--------|
| 検索機能 | 2クエリ | 1クエリ | 50% |
| お気に入り | 2クエリ | 1クエリ | 50% |
| 企業求人管理 | 2クエリ | 1クエリ | 50% |
| タグ処理 | N+1クエリ | 2クエリ | 最大90% |

## 実装の推奨事項

1. **Supabase JOINの活用**
   - 関連テーブルのデータを一度に取得
   - `select()`内で関連テーブルを指定

2. **キャッシュ戦略**
   - 頻繁にアクセスされる企業情報をキャッシュ
   - Redis等の導入検討

3. **データローダーパターン**
   - 同一リクエスト内での重複クエリを防ぐ

4. **インデックスの最適化**
   - 検索条件に使用されるカラムにインデックス追加
   - 複合インデックスの検討

## 結論

現在、5つの重大なN+1問題が存在し、特に検索機能とお気に入り機能への影響が大きい。これらの改善により、データベースクエリ数を最大50-90%削減でき、大幅なパフォーマンス向上が期待できる。

優先度の高い検索機能から順次改善を実施することを推奨する。