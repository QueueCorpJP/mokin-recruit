-- RLSポリシーの修正: 企業ユーザーが候補者データを閲覧できるように変更

-- 既存のcandidatesテーブルのSELECTポリシーを削除
DROP POLICY IF EXISTS "Users can view own candidate data" ON public.candidates;

-- 新しいポリシー: 企業ユーザーはすべてのアクティブな候補者を閲覧可能
CREATE POLICY "Company users can view active candidates"
  ON public.candidates 
  FOR SELECT 
  USING (
    status = 'ACTIVE' AND
    EXISTS (
      SELECT 1 FROM public.company_users 
      WHERE company_users.id::text = auth.uid()::text
    )
  );

-- 候補者は自分のデータを閲覧可能（元の機能を維持）
CREATE POLICY "Candidates can view own data"
  ON public.candidates 
  FOR SELECT 
  USING (auth.uid()::text = id::text);

-- 管理者用ポリシー（必要に応じて）
-- サービス_roleキーを使用した全データアクセス
CREATE POLICY "Service role full access"
  ON public.candidates 
  FOR ALL 
  USING (auth.role() = 'service_role');