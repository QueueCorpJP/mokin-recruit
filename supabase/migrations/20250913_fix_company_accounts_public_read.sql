-- company_accountsテーブルの公開情報（企業名など）を誰でも読み取り可能にする
-- 求人情報表示時に企業名を表示するために必要

-- 既存のSELECTポリシーを削除（重複を避けるため）
DROP POLICY IF EXISTS "Public can view company basic info" ON public.company_accounts;
DROP POLICY IF EXISTS "Anyone can view company basic info" ON public.company_accounts;

-- 公開求人に関連する企業情報のみ、誰でも閲覧可能にする
CREATE POLICY "Anyone can view company basic info"
  ON public.company_accounts
  FOR SELECT
  USING (
    -- その企業が公開求人を持っている場合のみ、基本情報を閲覧可能
    EXISTS (
      SELECT 1 FROM public.job_postings jp
      WHERE jp.company_account_id = company_accounts.id
      AND jp.status = 'PUBLISHED'
      AND jp.publication_type IN ('public', 'members')
    )
  );

-- コメント
COMMENT ON POLICY "Anyone can view company basic info" ON public.company_accounts
  IS '公開求人を持つ企業の基本情報（企業名など）は誰でも閲覧可能';