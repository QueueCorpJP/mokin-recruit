# TODO

## Candidate側でservice role keyを使用している問題のあるページ (RLS無効化) - 緊急対応必要

**26個のファイル**で`getSupabaseAdminClient()`を使用してRLSをバイパスしている:

1. **src/app/candidate/mypage/page.tsx** - 91行目
2. **src/app/candidate/search/setting/[id]/actions.ts** - 53行目
3. **src/app/candidate/setting/actions.ts** - 48行目
4. **src/app/candidate/job/favorite/actions.ts** - 66, 181, 264行目
5. **src/app/candidate/setting/withdrawal/reason/actions.ts**
6. **src/app/candidate/setting/scout/actions.ts**
7. **src/app/candidate/setting/password/actions.ts** - 21行目
8. **src/app/candidate/setting/notification/actions.ts**
9. **src/app/candidate/setting/ng-company/actions.ts** - 12, 125行目
10. **src/app/candidate/setting/mail/actions.ts** - 55, 196行目
11. **src/app/candidate/search/setting/[id]/confirm/actions.ts**
12. **src/app/candidate/media/[media_id]/page.tsx**
13. **src/app/candidate/job/[job_id]/page.tsx** - 57行目
14. **src/app/candidate/account/summary/edit/actions.ts**
15. **src/app/candidate/account/skills/edit/actions.ts** - 80行目
16. **src/app/candidate/account/recent-job/edit/actions.ts**
17. **src/app/candidate/account/profile/edit/page.tsx** - 26行目
18. **src/app/candidate/account/profile/page.tsx** - 26行目
19. **src/app/candidate/account/profile/edit/actions.ts** - 81行目
20. **src/app/candidate/account/expectation/page.tsx** - 40行目
21. **src/app/candidate/account/expectation/edit/actions.ts** - 14, 155行目
22. **src/app/candidate/account/education/edit/actions.ts** - 139行目
23. **src/app/candidate/account/career-status/page.tsx** - 20行目
24. **src/app/candidate/account/career-status/edit/actions.ts** - 36, 116行目
25. **src/app/candidate/media/actions.ts** - 40, 58, 94, 130, 171, 223行目
26. **src/app/candidate/company/[company_id]/actions.ts** - 110, 195行目

### 問題点
- **候補者が他の候補者のデータにアクセス可能**
- **候補者が企業データにアクセス可能**
- **RLS (Row Level Security) が完全にバイパス**される致命的セキュリティ脆弱性

## Company側でservice role keyを使用している問題のあるページ (RLS無効化)

以下のファイルで`getSupabaseAdminClient()`を使用してRLSをバイパスしている:

### 修正が必要なファイル

1. **src/app/company/contact/actions.ts**
   - 24行目: `getSupabaseAdminClient()`使用

2. **src/app/company/contact/page.tsx**
   - 32行目: `getSupabaseAdminClient()`使用

3. **src/app/company/job/actions.ts**
   - 36, 202, 360, 392, 468, 999行目: `getSupabaseAdminClient()`使用

4. **src/app/company/setting/actions.ts**
   - 37, 87, 142, 187行目: `getSupabaseAdminClient()`使用

5. **src/app/company/setting/mail/actions.ts**
   - 56, 196行目: `
   getSupabaseAdminClient()`使用

6. **src/app/company/setting/password/actions.ts**
   - 21行目: `getSupabaseAdminClient()`使用

7. **src/app/company/search/result/candidate-actions.ts**
   - 26, 84, 129, 176, 218行目: `getSupabaseAdminClient()`使用

8. **src/app/company/search/scout/actions.ts**
   - 25, 224, 269, 295, 328行目: `getSupabaseAdminClient()`使用

9. **src/app/company/scout-template/new/actions.ts**
   - 38, 87, 147行目: `getSupabaseAdminClient()`使用

### 問題点
- RLS (Row Level Security) がバイパスされるため、セキュリティリスクが高い
- 企業が他社のデータにアクセスできる可能性がある

### 推奨対応
- `@/lib/supabase/server`の`createClient()`を使用してanon keyで動作させる
- RLSポリシーを有効にして適切なアクセス制御を実装する