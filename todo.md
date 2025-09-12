# Company配下ページの骨組み表示対応

## 修正内容の概要
現在、company配下のページでmypageのような「認証チェック → 骨組み表示 → データ取得」の一貫した処理パターンが実装されていない。全ページで統一された遷移体験を提供するため、mypageと同様の処理パターンを適用する。

具体的には以下の処理を各ページで実装：
1. **認証チェック**: `requireCompanyAuthForAction()`による企業ユーザー認証
2. **認証失敗時の骨組み表示**: 認証エラー時に統一されたフォールバック画面を表示
3. **データ取得の並列化**: `Promise.all`を使用した効率的なデータ取得
4. **エラーハンドリングの統一**: 一貫したエラー表示パターン

## 対象ページ修正チェックリスト

### 🟢 基本ページ（優先度: 高）
- [ ] `/company/search/page.tsx` - 検索ページの認証・骨組み対応
- [ ] `/company/job/page.tsx` - 求人一覧ページの統一
- [ ] `/company/task/page.tsx` - タスクページの認証強化
- [ ] `/company/account/page.tsx` - アカウントページの統一
- [ ] `/company/setting/page.tsx` - 設定ページの認証・骨組み対応

### 🟡 機能ページ（優先度: 中）
- [ ] `/company/message/page.tsx` - メッセージ一覧の統一
- [ ] `/company/recruitment/detail/page.tsx` - 採用詳細の統一
- [ ] `/company/scout-template/page.tsx` - スカウトテンプレートの統一
- [ ] `/company/template/page.tsx` - テンプレート管理の統一
- [ ] `/company/search/history/page.tsx` - 検索履歴の統一
- [ ] `/company/search/result/page.tsx` - 検索結果の統一

### 🟠 サブページ（優先度: 低）
- [ ] `/company/job/new/page.tsx` - 求人新規作成の統一
- [ ] `/company/job/[job_id]/page.tsx` - 求人詳細の統一
- [ ] `/company/job/[job_id]/edit/page.tsx` - 求人編集の統一
- [ ] `/company/account/edit/page.tsx` - アカウント編集の統一
- [ ] `/company/scout-template/new/page.tsx` - スカウトテンプレート新規の統一
- [ ] `/company/scout-template/edit/page.tsx` - スカウトテンプレート編集の統一
- [ ] `/company/template/new/page.tsx` - テンプレート新規の統一
- [ ] `/company/template/edit/page.tsx` - テンプレート編集の統一

### 🔵 設定関連ページ（優先度: 低）
- [ ] `/company/setting/mail/page.tsx` - メール設定の統一
- [ ] `/company/setting/password/page.tsx` - パスワード設定の統一
- [ ] `/company/setting/position/page.tsx` - 役職設定の統一
- [ ] `/company/setting/profile/page.tsx` - プロフィール設定の統一

### 🟣 その他ページ（優先度: 最低）
- [ ] `/company/contact/page.tsx` - お問い合わせの統一
- [ ] `/company/privacy/page.tsx` - プライバシーポリシーの統一  
- [ ] `/company/terms/page.tsx` - 利用規約の統一

## 実装パターンテンプレート

```typescript
export default async function SamplePage() {
  // 1. 企業ユーザー認証情報を取得
  const { requireCompanyAuthForAction } = await import('@/lib/auth/server');
  const authResult = await requireCompanyAuthForAction();
  
  if (!authResult.success) {
    // 2. 認証エラーの場合は統一された骨組みを返す
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  // 3. 必要なデータを並列取得
  const [data1, data2] = await Promise.all([
    getData1(),
    getData2(),
  ]);

  // 4. クライアントコンポーネントに渡す
  return <ClientComponent data1={data1} data2={data2} />;
}
```

## データベース関連の初回速度最適化項目

### 🚀 クエリ最適化（優先度: 最高）
- [ ] **データ取得の並列化強化**: 現在のmypageパターンを全ページに適用（Promise.all活用）
- [ ] **SELECT句の最適化**: 必要最小限のフィールドのみ取得（例：candidates表示用フィールドのみ）
- [ ] **JOINクエリの最適化**: 複数テーブル結合を1回のクエリで実行
- [ ] **重複データ取得の排除**: 同一データを複数箇所で取得している箇所の統合

### 🔍 インデックス追加（優先度: 高）
- [ ] **candidates表のインデックス**: `status`, `last_login_at`, `updated_at`の複合インデックス
- [ ] **application表のインデックス**: `company_group_id`, `status`, `created_at`の複合インデックス  
- [ ] **scout_sends表のインデックス**: `company_group_id`, `status`, `sent_at`の複合インデックス
- [ ] **job_postings表のインデックス**: `company_account_id`, `status`, `updated_at`の複合インデックス
- [ ] **search_history表のインデックス**: `company_group_id`, `searched_at`, `is_saved`の複合インデックス

### 💾 キャッシュ戦略（優先度: 中）
- [ ] **認証情報のキャッシュ**: `getCachedCompanyUser`の活用拡大
- [ ] **静的データのキャッシュ**: 業界・職種・都道府県データの事前読み込み
- [ ] **会社グループ情報のキャッシュ**: セッション中の再利用
- [ ] **求人オプション情報のキャッシュ**: jobOptionsの共通化

### 📊 データベースビュー活用（優先度: 中）
- [ ] **候補者一覧ビューの作成**: 複雑なJOINを事前計算
- [ ] **求人統計ビューの作成**: ダッシュボード用集計データの事前計算
- [ ] **メッセージ統計ビューの作成**: 未読数・新着数の効率的取得

### ⚡ 初回表示の骨組み最適化（優先度: 高）
- [ ] **スケルトンローダーの統一**: 全ページで一貫したローディング表示
- [ ] **重要データの優先取得**: 画面表示に必要な最小データを先行取得
- [ ] **遅延読み込みの実装**: 初回表示後に詳細データを非同期取得
- [ ] **エラー状態の統一**: 認証エラー・データ取得エラーの一貫した処理

### 🔧 実装パターンテンプレート（改良版）

```typescript
export default async function OptimizedPage() {
  // 1. 認証チェック（キャッシュ活用）
  const authResult = await requireCompanyAuthForAction();
  
  if (!authResult.success) {
    // 2. 統一された骨組み表示
    return <UnifiedFallbackComponent message="認証が必要です。" />;
  }

  // 3. 必須データの並列取得（最小限のフィールド）
  const [coreData, optionalData] = await Promise.all([
    // 画面表示に必須のデータ（最小フィールド）
    getCorePageData(authResult.data.companyUserId),
    // 追加機能用のデータ（後から読み込み可能）
    getOptionalPageData(authResult.data.companyUserId),
  ]);

  // 4. 初回表示用の最小データでクライアントコンポーネントを先行レンダリング
  return (
    <ClientComponent 
      initialData={coreData}
      deferredData={optionalData}
      userId={authResult.data.companyUserId}
    />
  );
}
```

### 📈 成果指標
- [ ] **初回表示時間**: 目標2秒以内（現在の50%短縮）
- [ ] **データベースクエリ数**: ページあたり最大5クエリ以内
- [ ] **並列処理率**: データ取得の80%以上を並列化
- [ ] **キャッシュヒット率**: 静的データの90%以上をキャッシュから取得

## 注意事項
- 既存の機能を壊さないよう、段階的に修正を実施
- 各ページの既存の認証処理は保持しつつ、統一パターンに合わせて調整
- エラーハンドリングは既存のパターンを尊重し、必要に応じて改善
- データベースインデックス追加前に、現在のクエリ実行計画を確認
- キャッシュ実装時はデータの整合性を保つよう注意
