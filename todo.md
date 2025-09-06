# クライアント認証統一 - サーバー認証コード除去作業

## 🔍 調査完了: src/app/candidate/ 

### ❌ 除去が必要なサーバー認証コード (35+ファイル)

#### 1. **メインレイアウト - 最優先修正**
**🚨 Critical:**
- `CandidateLayoutServer.tsx` - `getServerAuth()` 使用
  - **修正:** サーバー認証チェック削除、クライアント認証のみに

#### 2. **サーバーコンポーネントでのユーザー取得 (18+ファイル)**
**🔧 修正必要:** `getCachedCandidateUser()` 使用ファイル

- `account/career-status/page.tsx`
- `account/education/page.tsx` 
- `account/expectation/page.tsx`
- `account/profile/page.tsx`
- `account/profile/edit/page.tsx`
- `account/recent-job/page.tsx`
- `account/resume/page.tsx`
- `account/resume/shokumu-preview/page.tsx`
- `account/resume/rirekisyo-preview/page.tsx`
- `account/skills/page.tsx`
- `account/summary/page.tsx`
- `job/favorite/CandidateFavoriteServerComponent.tsx`
- `message/page.tsx`
- `mypage/page.tsx`
- `task/page.tsx`
- その他3+ファイル

**修正内容:** サーバーコンポーネント → クライアントコンポーネント化

#### 3. **サーバーアクションでの認証チェック (15+ファイル)**
**🔧 修正必要:** `requireCandidateAuthForAction()` 使用ファイル

- `account/career-status/edit/actions.ts`
- `account/education/edit/actions.ts`
- `account/expectation/edit/actions.ts`
- `account/profile/edit/actions.ts`
- `account/recent-job/edit/actions.ts`
- `account/skills/edit/actions.ts`
- `account/summary/edit/actions.ts`
- `job/favorite/actions.ts`
- `mypage/actions.ts`
- `search/setting/[id]/confirm/actions.ts`
- `setting/actions.ts`
- `setting/ng-company/actions.ts`
- `setting/notification/actions.ts`
- `setting/password/actions.ts`
- `setting/scout/actions.ts`

**修正内容:** サーバー認証チェック削除、クライアントで認証後にアクション呼び出し

#### 4. **サーバーでのユーザー取得 (6ファイル)**
**🔧 修正必要:** `requireCandidateAuth()` 使用ファイル

- `account/career-status/edit/actions.ts`
- `account/education/edit/actions.ts`
- `account/expectation/edit/actions.ts`
- `account/recent-job/edit/actions.ts`
- `account/skills/edit/actions.ts`
- `setting/mail/actions.ts`

**修正内容:** サーバーサイドユーザー取得削除、パラメータで受け取り

### 📋 修正優先順位

#### 🚨 **最優先 (システム全体に影響)**
1. `CandidateLayoutServer.tsx` - レイアウト認証除去

#### 🔥 **高優先 (機能ブロック)**  
2. サーバーアクション認証チェック15+ファイル - 動作に直接影響

#### ⚡ **中優先 (パフォーマンス影響)**
3. ページコンポーネント18+ファイル - サーバー→クライアント化

#### 📝 **低優先 (最適化)**
4. その他細かい調整

---

## 📝 調査待ちディレクトリ

- [ ] src/app/company/
- [ ] src/app/admin/
- [ ] src/hooks/
- [ ] src/lib/ (auth関連以外)
- [ ] src/components/
- [ ] その他のディレクトリ