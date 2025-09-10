-- RLSポリシーの設定
-- signup時は未認証でもINSERT可能、その他は認証が必要

-- candidates テーブルのRLS有効化
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

-- candidates テーブルのポリシー
-- signup時の匿名INSERT許可
CREATE POLICY "Allow anonymous candidate signup"
  ON public.candidates 
  FOR INSERT 
  WITH CHECK (true);

-- 認証ユーザーは自分のデータのみ閲覧・更新可能
CREATE POLICY "Users can view own candidate data"
  ON public.candidates 
  FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own candidate data"
  ON public.candidates 
  FOR UPDATE 
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- 削除は本人のみ
CREATE POLICY "Users can delete own candidate data"
  ON public.candidates 
  FOR DELETE 
  USING (auth.uid()::text = id::text);

-- company_accounts テーブルのRLS有効化
ALTER TABLE public.company_accounts ENABLE ROW LEVEL SECURITY;

-- company_accounts テーブルのポリシー
-- signup時の匿名INSERT許可
CREATE POLICY "Allow anonymous company account creation"
  ON public.company_accounts 
  FOR INSERT 
  WITH CHECK (true);

-- 認証された企業ユーザーは関連する企業アカウントを閲覧可能
CREATE POLICY "Company users can view their company account"
  ON public.company_accounts 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.company_account_id = company_accounts.id 
      AND company_users.id::text = auth.uid()::text
    )
  );

-- 企業アカウントの更新は関連ユーザーのみ
CREATE POLICY "Company users can update their company account"
  ON public.company_accounts 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.company_account_id = company_accounts.id 
      AND company_users.id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.company_account_id = company_accounts.id 
      AND company_users.id::text = auth.uid()::text
    )
  );

-- company_users テーブルのRLS有効化
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- company_users テーブルのポリシー
-- signup時の匿名INSERT許可
CREATE POLICY "Allow anonymous company user signup"
  ON public.company_users 
  FOR INSERT 
  WITH CHECK (true);

-- 認証ユーザーは自分のデータのみ閲覧・更新可能
CREATE POLICY "Users can view own company user data"
  ON public.company_users 
  FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own company user data"
  ON public.company_users 
  FOR UPDATE 
  USING (auth.uid()::text = id::text)
  WITH CHECK (auth.uid()::text = id::text);

-- 削除は本人のみ
CREATE POLICY "Users can delete own company user data"
  ON public.company_users 
  FOR DELETE 
  USING (auth.uid()::text = id::text);

-- job_postings テーブルのRLS有効化（求人情報）
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;

-- 求人情報は誰でも閲覧可能（公開情報）
CREATE POLICY "Anyone can view published job postings"
  ON public.job_postings 
  FOR SELECT 
  USING (status = 'PUBLISHED');

-- 求人情報の作成・更新・削除は企業ユーザーのみ
CREATE POLICY "Company users can manage their job postings"
  ON public.job_postings 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      JOIN public.company_accounts ca ON cu.company_account_id = ca.id
      WHERE cu.id::text = auth.uid()::text
      AND ca.id = job_postings.company_account_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      JOIN public.company_accounts ca ON cu.company_account_id = ca.id
      WHERE cu.id::text = auth.uid()::text
      AND ca.id = job_postings.company_account_id
    )
  );

-- rooms テーブルのRLS有効化（メッセージルーム）
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

-- ルームは関係者（候補者・企業ユーザー）のみアクセス可能
CREATE POLICY "Participants can access their rooms"
  ON public.rooms 
  FOR SELECT 
  USING (
    candidate_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM public.company_users cu
      JOIN public.company_groups cg ON cu.company_account_id = cg.company_account_id
      WHERE cu.id::text = auth.uid()::text
      AND cg.id = rooms.company_group_id
    )
  );

-- messages テーブルのRLS有効化（メッセージ）
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- メッセージは関係者のみ閲覧可能
CREATE POLICY "Participants can view messages in their rooms"
  ON public.messages 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.rooms r
      WHERE r.id = messages.room_id
      AND (
        r.candidate_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM public.company_users cu
          JOIN public.company_groups cg ON cu.company_account_id = cg.company_account_id
          WHERE cu.id::text = auth.uid()::text
          AND cg.id = r.company_group_id
        )
      )
    )
  );

-- メッセージの送信は認証ユーザーのみ
CREATE POLICY "Authenticated users can send messages"
  ON public.messages 
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM public.rooms r
      WHERE r.id = messages.room_id
      AND (
        r.candidate_id::text = auth.uid()::text OR
        EXISTS (
          SELECT 1 FROM public.company_users cu
          JOIN public.company_groups cg ON cu.company_account_id = cg.company_account_id
          WHERE cu.id::text = auth.uid()::text
          AND cg.id = r.company_group_id
        )
      )
    )
  );

-- applications テーブルのRLS有効化（応募）
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- 応募は候補者のみ作成可能
CREATE POLICY "Candidates can create applications"
  ON public.applications 
  FOR INSERT 
  WITH CHECK (
    auth.role() = 'authenticated' AND
    candidate_id::text = auth.uid()::text
  );

-- 応募データは候補者と関連企業ユーザーが閲覧可能
CREATE POLICY "Participants can view applications"
  ON public.applications 
  FOR SELECT 
  USING (
    candidate_id::text = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM public.job_postings jp
      JOIN public.company_users cu ON jp.company_account_id = cu.company_account_id
      WHERE cu.id::text = auth.uid()::text
      AND jp.id = applications.job_posting_id
    )
  );

-- 応募の更新は候補者のみ
CREATE POLICY "Candidates can update their applications"
  ON public.applications 
  FOR UPDATE 
  USING (candidate_id::text = auth.uid()::text)
  WITH CHECK (candidate_id::text = auth.uid()::text);

-- career_status_entries テーブルのRLS有効化（選考状況）
ALTER TABLE public.career_status_entries ENABLE ROW LEVEL SECURITY;

-- 選考状況は候補者のみ作成・更新可能
CREATE POLICY "Candidates can manage their career status"
  ON public.career_status_entries 
  FOR ALL 
  USING (candidate_id::text = auth.uid()::text)
  WITH CHECK (candidate_id::text = auth.uid()::text);

-- education テーブルのRLS有効化（学歴）
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;

-- 学歴は候補者のみ管理可能
CREATE POLICY "Candidates can manage their education"
  ON public.education 
  FOR ALL 
  USING (candidate_id::text = auth.uid()::text)
  WITH CHECK (candidate_id::text = auth.uid()::text);

-- work_experience テーブルのRLS有効化（職歴）
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;

-- 職歴は候補者のみ管理可能
CREATE POLICY "Candidates can manage their work experience"
  ON public.work_experience 
  FOR ALL 
  USING (candidate_id::text = auth.uid()::text)
  WITH CHECK (candidate_id::text = auth.uid()::text);

-- job_type_experience テーブルのRLS有効化（職種経験）
ALTER TABLE public.job_type_experience ENABLE ROW LEVEL SECURITY;

-- 職種経験は候補者のみ管理可能
CREATE POLICY "Candidates can manage their job type experience"
  ON public.job_type_experience 
  FOR ALL 
  USING (candidate_id::text = auth.uid()::text)
  WITH CHECK (candidate_id::text = auth.uid()::text);

-- company_groups テーブルのRLS有効化（企業グループ）
ALTER TABLE public.company_groups ENABLE ROW LEVEL SECURITY;

-- 企業グループは関連企業ユーザーのみ閲覧・管理可能
CREATE POLICY "Company users can manage their groups"
  ON public.company_groups 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = company_groups.company_account_id
      AND cu.id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = company_groups.company_account_id
      AND cu.id::text = auth.uid()::text
    )
  );

-- user_permissions テーブルのRLS有効化（ユーザー権限）
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;

-- 権限情報は本人のみ閲覧可能
CREATE POLICY "Users can view their own permissions"
  ON public.user_permissions 
  FOR SELECT 
  USING (user_id::text = auth.uid()::text);

-- notices テーブルのRLS有効化（お知らせ）
ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;

-- 公開されたお知らせは誰でも閲覧可能
CREATE POLICY "Anyone can view published notices"
  ON public.notices 
  FOR SELECT 
  USING (status = 'PUBLISHED');

-- お知らせの管理は管理者のみ（将来的にadminロールで制限）
CREATE POLICY "Admins can manage notices"
  ON public.notices 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- コメント
COMMENT ON POLICY "Allow anonymous candidate signup" ON public.candidates IS 'signup時の未認証INSERT許可';
COMMENT ON POLICY "Allow anonymous company account creation" ON public.company_accounts IS 'signup時の未認証INSERT許可';
COMMENT ON POLICY "Allow anonymous company user signup" ON public.company_users IS 'signup時の未認証INSERT許可';