# Candidate配下ページの骨組み表示対応

## 修正内容の概要
candidate配下のページも、company配下と同様に「認証チェック → 骨組み表示 → データ取得」の一貫した処理パターンに統一する。

具体的には以下の処理を各ページで実装：
1. 認証チェック: `requireCandidateAuthForAction()` による候補者ユーザー認証
2. 認証失敗時の骨組み表示: 認証エラー時に統一されたフォールバック画面を表示
3. データ取得の並列化: `Promise.all` を使用した効率的なデータ取得
4. エラーハンドリングの統一: 一貫したエラー表示パターン

## 対象ページ修正チェックリスト

### 🟢 基本ページ（優先度: 高）
- [ ] `/candidate/mypage/page.tsx`
- [ ] `/candidate/message/page.tsx`
- [ ] `/candidate/job/[job_id]/page.tsx`
- [ ] `/candidate/job/favorite/page.tsx`
- [ ] `/candidate/search/setting/page.tsx`
- [ ] `/candidate/task/page.tsx`

### 🟡 アカウント表示ページ（優先度: 中）
- [ ] `/candidate/account/profile/page.tsx`
- [ ] `/candidate/account/summary/page.tsx`
- [ ] `/candidate/account/skills/page.tsx`
- [ ] `/candidate/account/education/page.tsx`
- [ ] `/candidate/account/recent-job/page.tsx`
- [ ] `/candidate/account/career-status/page.tsx`
- [ ] `/candidate/account/expectation/page.tsx`
- [ ] `/candidate/account/resume/page.tsx`

### 🟡 機能ページ（優先度: 中）
- [ ] `/candidate/company/[company_id]/page.tsx`
- [ ] `/candidate/search/setting/[id]/page.tsx`
- [ ] `/candidate/search/setting/[id]/confirm/page.tsx`

### 🟠 編集ページ（優先度: 低）
- [ ] `/candidate/account/profile/edit/page.tsx`
- [ ] `/candidate/account/summary/edit/page.tsx`
- [ ] `/candidate/account/skills/edit/page.tsx`
- [ ] `/candidate/account/education/edit/page.tsx`
- [ ] `/candidate/account/recent-job/edit/page.tsx`
- [ ] `/candidate/account/career-status/edit/page.tsx`
- [ ] `/candidate/account/expectation/edit/page.tsx`
- [ ] `/candidate/account/resume/rirekisyo-preview/page.tsx`
- [ ] `/candidate/account/resume/shokumu-preview/page.tsx`

### 🔵 設定関連ページ（優先度: 低）
- [ ] `/candidate/setting/page.tsx`
- [ ] `/candidate/setting/mail/page.tsx`
- [ ] `/candidate/setting/mail/verify/page.tsx`
- [ ] `/candidate/setting/mail/complete/page.tsx`
- [ ] `/candidate/setting/password/page.tsx`
- [ ] `/candidate/setting/password/complete/page.tsx`
- [ ] `/candidate/setting/scout/page.tsx`
- [ ] `/candidate/setting/scout/complete/page.tsx`
- [ ] `/candidate/setting/notification/page.tsx`
- [ ] `/candidate/setting/notification/complete/page.tsx`
- [ ] `/candidate/setting/ng-company/page.tsx`
- [ ] `/candidate/setting/withdrawal/page.tsx`
- [ ] `/candidate/setting/withdrawal/reason/page.tsx`
- [ ] `/candidate/setting/withdrawal/complete/page.tsx`

### 🟣 その他ページ（優先度: 最低）
- [ ] `/candidate/media/page.tsx`
- [ ] `/candidate/media/[media_id]/page.tsx`
- [ ] `/candidate/news/page.tsx`
- [ ] `/candidate/news/[id]/page.tsx`
- [ ] `/candidate/terms/page.tsx`
- [ ] `/candidate/privacy/page.tsx`
- [ ] `/candidate/laws/page.tsx`
- [ ] `/candidate/page.tsx`

※ 認証不要のページ（`/candidate/auth/*` 等）は本対応の対象外。

## 実装パターンテンプレート（Candidate版）

```typescript
export default async function SampleCandidatePage() {
  // 1. 候補者ユーザー認証情報を取得
  const { requireCandidateAuthForAction } = await import('@/lib/auth/server');
  const authResult = await requireCandidateAuthForAction();

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

## データベース関連の初回速度最適化項目（Candidate）

### 🚀 クエリ最適化（優先度: 最高）
- [ ] データ取得の並列化: 候補者カード等の付随情報取得（職種/業種/進捗）を `Promise.all` に集約
- [ ] SELECT句の最適化: 候補者カード表示に不要な項目を除外
- [ ] JOINクエリの最適化: 候補者一覧に必要な結合のみを実行
- [ ] 重複データ取得の排除: 応募/スカウトの統合後に重複候補者の最新のみ採用

### 🔍 インデックス追加（優先度: 高）
- [ ] `candidates` 表: `last_login_at`, `updated_at` の複合 or 単独インデックス
- [ ] `application` 表: `company_group_id`, `status`, `created_at` の複合インデックス
- [ ] `scout_sends` 表: `company_group_id`, `status`, `sent_at` の複合インデックス

### 💾 キャッシュ戦略（優先度: 中）
- [ ] 認証情報のキャッシュ: `getCachedCandidateUser`（必要に応じて拡張）
- [ ] 静的データのキャッシュ: 業界・職種・都道府県データのサーバー注入とキャッシュ
- [ ] 候補者カード用オプションのキャッシュ: よく使う辞書データの共通化

### ⚡ 初回表示の骨組み最適化（優先度: 高）
- [ ] スケルトンローダーの統一: 全ページで一貫したローディング表示
- [ ] 重要データの優先取得: 画面表示に必要な最小データを先行取得
- [ ] 遅延読み込みの実装: 初回表示後に詳細データを非同期取得
- [ ] エラー状態の統一: 認証エラー・データ取得エラーの一貫した処理

## 備考
- 既存機能を壊さないよう段階的に適用する
- 各ページの既存の認証処理は保持しつつ、統一パターンに合わせて調整
- データベースインデックス追加前に、現在のクエリ実行計画を確認
- キャッシュ実装時はデータの整合性を担保
