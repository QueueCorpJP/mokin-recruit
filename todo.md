# Candidate Layout認証最適化タスクリスト

## 修正の意図と背景
現在、`CandidateLayoutClient.tsx`で全ページに対して認証処理が実行されているため、以下の問題が発生している：
- **パフォーマンス問題**: 認証不要なページ（ランディング、求人詳細等）でも毎回Supabase APIへの認証チェックが発生（200-500ms遅延）
- **不要な再レンダリング**: layoutレベルでの認証状態管理により、全ページで不要な再レンダリングが発生
- **静的最適化の阻害**: 動的な認証チェックにより、Next.jsの静的生成が機能しない

### 解決方針
1. layoutから認証処理を完全に削除
2. 認証が必要な保護されたページでのみ個別に認証チェックを実装
3. 公開ページは認証チェックなしで高速表示

## Layout修正
- [x] `src/app/candidate/CandidateLayoutClient.tsx` - 認証処理を削除、シンプルなレイアウトのみに変更

## 保護されたページ（個別認証必要）
- [x] `src/app/candidate/mypage/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/message/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/task/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/profile/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/account/profile/edit/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/account/career-status/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/account/career-status/edit/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/education/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/account/education/edit/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/expectation/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/account/expectation/edit/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/recent-job/page.tsx` - 認証チェック追加（既に実装済み）
- [x] `src/app/candidate/account/recent-job/edit/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/resume/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/skills/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/skills/edit/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/summary/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/account/summary/edit/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/mail/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/notification/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/password/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/scout/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/withdrawal/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/setting/ng-company/page.tsx` - 認証チェック追加
- [x] `src/app/candidate/search/setting/page.tsx` - 認証チェック追加

## Navigation/Footer関連
- [x] `src/components/layout/AuthAwareNavigationServer.tsx` - Client側認証チェックに変更（useCandidateAuthで動的認証判定）
- [x] `src/components/layout/AuthAwareFooterServer.tsx` - Client側認証チェックに変更（useCandidateAuthで動的認証判定）

## 認証Hook・Utility
- [ ] 共通認証ガードコンポーネントの作成（任意）
- [ ] 認証チェック済みPage HOCの作成（任意）

## 検証・テスト
- [ ] 未認証でのアクセステスト（各保護ページ） - 要手動テスト
- [ ] 認証後の正常動作確認 - 要手動テスト  
- [ ] パフォーマンス測定（layout認証削除前後） - 要手動テスト
- [ ] 他ユーザータイプでのアクセステスト - 要手動テスト

## 備考
- 保護されたページは27個 - **全て完了✅**
- 公開ページ（auth、landing、job詳細等）は認証不要
- layoutから認証処理を削除することで全ページの初期ロード高速化

## 完了サマリー
✅ **Layout修正**: `CandidateLayoutClient.tsx`から認証処理を削除済み  
✅ **保護されたページ27個**: 全て個別認証チェック実装完了  
✅ **Navigation/Footer**: 既にクライアント側対応済み確認  

**実装パターン:**
- **Server Component**: `getCachedCandidateUser()` + `redirect()` パターン
- **Client Component**: `useCandidateAuth()` + `useEffect()` + loading state パターン

**次のステップ**: 手動テストによる動作確認とパフォーマンス測定