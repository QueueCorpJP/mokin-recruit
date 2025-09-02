# SSR/Hydrationエラー修正チェックリスト

## 最重要（即座に修正必要）

### 1. useMediaQuery Hook修正（根本原因）
- [x] `src/hooks/useMediaQuery.ts` (Line 7-23)
  - 問題: `window.matchMedia(query)` がSSR時にundefined
  - 修正: SSR-safe初期化とclient-side検出を追加

### 2. CandidateSearchSettingClient.tsx
- [x] `src/app/candidate/search/setting/[id]/CandidateSearchSettingClient.tsx` (Lines 133, 145, 158)  
  - 問題: `params.id` がSSR時にundefined → jobId参照エラー
  - 問題: `useEffect(() => { setIsFavorite(favoriteStatus[jobId] || false); }, [favoriteStatus, jobId]);`
  - 修正: null/undefined チェック追加

## 高優先度

### 3. CandidateApplicationClient.tsx
- [x] `src/app/candidate/search/setting/[id]/confirm/CandidateApplicationClient.tsx` (Lines 22-30)
  - 問題: 修正必要なuseMediaQuery hook使用
  - 修正: SSR-safe media query 実装に置き換え

### 4. CompanyDetailClient.tsx  
- [x] `src/app/candidate/company/[company_id]/CompanyDetailClient.tsx` (Lines 79-91, 135, 153-163)
  - 問題: `ResizeObserver` がSSR時にundefined
  - 問題: Parameter extraction とuseEffect依存関係
  - 修正: Browser-only APIs用のSSRチェック追加

### 5. ProfileEditClientWrapper.tsx
- [x] `src/app/candidate/account/profile/edit/ProfileEditClientWrapper.tsx` (Lines 22, 48, 51-58)
  - 問題: `useMediaQuery` hook使用
  - 問題: `window.history.back()` がSSR時にundefined  
  - 修正: window API用SSR保護追加

### 6. CandidateSearchClient.tsx
- [x] `src/app/candidate/search/setting/CandidateSearchClient.tsx` (Lines 92, 241-244)
  - 問題: `window.scrollTo` がSSR時にundefined
  - 問題: 複雑な状態同期
  - 修正: SSR-safeスクロール実装

## 中優先度（Hydration不一致の可能性）

### 7. CandidateLayoutClient.tsx
- [x] `src/app/candidate/CandidateLayoutClient.tsx` (Lines 31-46)
  - 問題: 複雑なuseEffect依存配列 `[loading, isAuthenticated, candidateUser, pathname, router]`
  - 修正: 依存配列簡素化とローディング状態追加

### 8. NewsDetailClient.tsx
- [x] `src/app/candidate/news/[id]/NewsDetailClient.tsx` (Line 42)
  - 問題: `[article.id, article.categories]` がundefinedの可能性
  - 修正: article properties用null チェック追加

### 9. CandidateFavoriteClient.tsx
- [x] `src/app/candidate/job/favorite/CandidateFavoriteClient.tsx` (Lines 43-46)
  - 問題: Props同期useEffect `[initialData, initialParams]`
  - 修正: ローディング状態とnullチェック追加

## すでに修正済み

### SessionStorage関連（修正完了）
- [x] `src/app/candidate/setting/mail/verify/page.tsx`
- [x] `src/app/candidate/setting/mail/page.tsx`  
- [x] `src/app/candidate/setting/mail/complete/page.tsx`

## 修正パターン（全てに適用）

```typescript
useEffect(() => {
  // クライアントサイドでのみ実行
  if (typeof window !== 'undefined') {
    // Browser-only code here
  }
}, [dependencies]);
```

## 修正状況
- 修正完了: 12項目  
- 修正率: 100%

## 最優先修正
1. **useMediaQuery.ts** - 他の複数コンポーネントに影響
2. **CandidateSearchSettingClient.tsx** - jobId未定義エラーの直接原因
3. **CompanyDetailClient.tsx** - ResizeObserver関連のSSRエラー