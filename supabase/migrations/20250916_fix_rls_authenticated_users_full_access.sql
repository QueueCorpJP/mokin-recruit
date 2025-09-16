-- RLSポリシーの統一: 認証ユーザーは全アクセス可能、匿名ユーザーは制限
-- 2025-01-16: candidate/account配下のテーブルのRLS設定を統一

-- 1. skills テーブルのRLS設定
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Candidates can manage their skills" ON public.skills;
DROP POLICY IF EXISTS "skills_authenticated_full_access" ON public.skills;

-- 認証ユーザーは全アクセス可能
CREATE POLICY "skills_authenticated_full_access"
  ON public.skills
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 2. expectations テーブルのRLS設定
ALTER TABLE public.expectations ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "Candidates can manage their expectations" ON public.expectations;
DROP POLICY IF EXISTS "expectations_authenticated_full_access" ON public.expectations;

-- 認証ユーザーは全アクセス可能
CREATE POLICY "expectations_authenticated_full_access"
  ON public.expectations
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 3. 既存のcandidate関連テーブルのポリシーを統一
-- candidates テーブル
DROP POLICY IF EXISTS "Users can update own candidate data" ON public.candidates;
DROP POLICY IF EXISTS "Users can delete own candidate data" ON public.candidates;
DROP POLICY IF EXISTS "Company users can view active candidates" ON public.candidates;
DROP POLICY IF EXISTS "Candidates can view own data" ON public.candidates;
DROP POLICY IF EXISTS "Service role full access" ON public.candidates;
DROP POLICY IF EXISTS "candidates_authenticated_full_access" ON public.candidates;

CREATE POLICY "candidates_authenticated_full_access"
  ON public.candidates
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- education テーブル
DROP POLICY IF EXISTS "Candidates can manage their education" ON public.education;
DROP POLICY IF EXISTS "education_authenticated_full_access" ON public.education;

CREATE POLICY "education_authenticated_full_access"
  ON public.education
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- work_experience テーブル
DROP POLICY IF EXISTS "Candidates can manage their work experience" ON public.work_experience;
DROP POLICY IF EXISTS "work_experience_authenticated_full_access" ON public.work_experience;

CREATE POLICY "work_experience_authenticated_full_access"
  ON public.work_experience
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- job_type_experience テーブル
DROP POLICY IF EXISTS "Candidates can manage their job type experience" ON public.job_type_experience;
DROP POLICY IF EXISTS "job_type_experience_authenticated_full_access" ON public.job_type_experience;

CREATE POLICY "job_type_experience_authenticated_full_access"
  ON public.job_type_experience
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- career_status_entries テーブル
DROP POLICY IF EXISTS "Candidates can manage their career status" ON public.career_status_entries;
DROP POLICY IF EXISTS "career_status_entries_authenticated_full_access" ON public.career_status_entries;

CREATE POLICY "career_status_entries_authenticated_full_access"
  ON public.career_status_entries
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 4. signup用の匿名INSERTポリシーは維持（candidatesテーブルのみ）
-- signup時に必要なので、candidatesテーブルの匿名INSERT許可は維持
CREATE POLICY "Allow anonymous candidate signup"
  ON public.candidates
  FOR INSERT
  WITH CHECK (true);

-- 5. company関連テーブルも同様に統一
-- company_accounts テーブル
DROP POLICY IF EXISTS "Company users can view their company account" ON public.company_accounts;
DROP POLICY IF EXISTS "Company users can update their company account" ON public.company_accounts;
DROP POLICY IF EXISTS "company_accounts_authenticated_full_access" ON public.company_accounts;

CREATE POLICY "company_accounts_authenticated_full_access"
  ON public.company_accounts
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- signup用の匿名INSERT許可は維持
CREATE POLICY "Allow anonymous company account creation"
  ON public.company_accounts
  FOR INSERT
  WITH CHECK (true);

-- company_users テーブル
DROP POLICY IF EXISTS "Users can view own company user data" ON public.company_users;
DROP POLICY IF EXISTS "Users can update own company user data" ON public.company_users;
DROP POLICY IF EXISTS "Users can delete own company user data" ON public.company_users;
DROP POLICY IF EXISTS "company_users_authenticated_full_access" ON public.company_users;

CREATE POLICY "company_users_authenticated_full_access"
  ON public.company_users
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- signup用の匿名INSERT許可は維持
CREATE POLICY "Allow anonymous company user signup"
  ON public.company_users
  FOR INSERT
  WITH CHECK (true);

-- 6. job_postings テーブル - 公開求人は誰でも閲覧可能を維持しつつ、管理は認証ユーザーのみ
DROP POLICY IF EXISTS "Anyone can view published job postings" ON public.job_postings;
DROP POLICY IF EXISTS "Company users can manage their job postings" ON public.job_postings;
DROP POLICY IF EXISTS "job_postings_authenticated_management" ON public.job_postings;
DROP POLICY IF EXISTS "job_postings_public_read" ON public.job_postings;

-- 公開求人は誰でも閲覧可能（匿名ユーザーも含む）
CREATE POLICY "job_postings_public_read"
  ON public.job_postings
  FOR SELECT
  USING (status = 'PUBLISHED');

-- 求人の管理（作成・更新・削除）は認証ユーザーのみ
CREATE POLICY "job_postings_authenticated_management"
  ON public.job_postings
  FOR INSERT, UPDATE, DELETE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 7. その他のテーブルも認証ユーザーフルアクセスに統一
-- rooms テーブル
DROP POLICY IF EXISTS "Participants can access their rooms" ON public.rooms;
DROP POLICY IF EXISTS "rooms_authenticated_full_access" ON public.rooms;

CREATE POLICY "rooms_authenticated_full_access"
  ON public.rooms
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- messages テーブル
DROP POLICY IF EXISTS "Participants can view messages in their rooms" ON public.messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON public.messages;
DROP POLICY IF EXISTS "messages_authenticated_full_access" ON public.messages;

CREATE POLICY "messages_authenticated_full_access"
  ON public.messages
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- applications テーブル
DROP POLICY IF EXISTS "Candidates can create applications" ON public.applications;
DROP POLICY IF EXISTS "Participants can view applications" ON public.applications;
DROP POLICY IF EXISTS "Candidates can update their applications" ON public.applications;
DROP POLICY IF EXISTS "applications_authenticated_full_access" ON public.applications;

CREATE POLICY "applications_authenticated_full_access"
  ON public.applications
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- company_groups テーブル
DROP POLICY IF EXISTS "Company users can manage their groups" ON public.company_groups;
DROP POLICY IF EXISTS "company_groups_authenticated_full_access" ON public.company_groups;

CREATE POLICY "company_groups_authenticated_full_access"
  ON public.company_groups
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- user_permissions テーブル
DROP POLICY IF EXISTS "Users can view their own permissions" ON public.user_permissions;
DROP POLICY IF EXISTS "user_permissions_authenticated_full_access" ON public.user_permissions;

CREATE POLICY "user_permissions_authenticated_full_access"
  ON public.user_permissions
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- notices テーブル
DROP POLICY IF EXISTS "Anyone can view published notices" ON public.notices;
DROP POLICY IF EXISTS "Admins can manage notices" ON public.notices;
DROP POLICY IF EXISTS "notices_public_read" ON public.notices;
DROP POLICY IF EXISTS "notices_authenticated_management" ON public.notices;

-- 公開お知らせは誰でも閲覧可能
CREATE POLICY "notices_public_read"
  ON public.notices
  FOR SELECT
  USING (status = 'PUBLISHED');

-- お知らせの管理は認証ユーザーのみ
CREATE POLICY "notices_authenticated_management"
  ON public.notices
  FOR INSERT, UPDATE, DELETE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- 8. favorites テーブルのRLS設定（お気に入り求人）
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除（存在する場合）
DROP POLICY IF EXISTS "favorites_authenticated_full_access" ON public.favorites;

-- 認証ユーザーは全アクセス可能
CREATE POLICY "favorites_authenticated_full_access"
  ON public.favorites
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- コメント
COMMENT ON POLICY "skills_authenticated_full_access" ON public.skills IS '認証ユーザーはスキル情報の全操作が可能';
COMMENT ON POLICY "expectations_authenticated_full_access" ON public.expectations IS '認証ユーザーは希望条件の全操作が可能';
COMMENT ON POLICY "candidates_authenticated_full_access" ON public.candidates IS '認証ユーザーは候補者データの全操作が可能';
COMMENT ON POLICY "education_authenticated_full_access" ON public.education IS '認証ユーザーは学歴データの全操作が可能';
COMMENT ON POLICY "work_experience_authenticated_full_access" ON public.work_experience IS '認証ユーザーは職歴データの全操作が可能';
COMMENT ON POLICY "job_type_experience_authenticated_full_access" ON public.job_type_experience IS '認証ユーザーは職種経験データの全操作が可能';
COMMENT ON POLICY "career_status_entries_authenticated_full_access" ON public.career_status_entries IS '認証ユーザーは選考状況データの全操作が可能';
COMMENT ON POLICY "favorites_authenticated_full_access" ON public.favorites IS '認証ユーザーはお気に入り求人データの全操作が可能';