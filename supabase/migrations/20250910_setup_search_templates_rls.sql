-- search_templatesテーブルのRLS設定

-- search_templatesテーブルのRLS有効化
ALTER TABLE public.search_templates ENABLE ROW LEVEL SECURITY;

-- 企業ユーザーは自社のスカウトテンプレートのみアクセス可能（読み取り）
CREATE POLICY "Company users can view their search templates"
  ON public.search_templates 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = search_templates.company_id
      AND cu.id::text = auth.uid()::text
    )
  );

-- 企業ユーザーは自社のスカウトテンプレートを作成可能
CREATE POLICY "Company users can create search templates"
  ON public.search_templates 
  FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = search_templates.company_id
      AND cu.id::text = auth.uid()::text
    )
  );

-- 企業ユーザーは自社のスカウトテンプレートを更新可能
CREATE POLICY "Company users can update their search templates"
  ON public.search_templates 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = search_templates.company_id
      AND cu.id::text = auth.uid()::text
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = search_templates.company_id
      AND cu.id::text = auth.uid()::text
    )
  );

-- 企業ユーザーは自社のスカウトテンプレートを削除可能
CREATE POLICY "Company users can delete their search templates"
  ON public.search_templates 
  FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.company_users cu
      WHERE cu.company_account_id = search_templates.company_id
      AND cu.id::text = auth.uid()::text
    )
  );

-- コメント
COMMENT ON POLICY "Company users can view their search templates" ON public.search_templates IS '企業ユーザーは自社のスカウトテンプレートのみ閲覧可能';
COMMENT ON POLICY "Company users can create search templates" ON public.search_templates IS '企業ユーザーは自社のスカウトテンプレートを作成可能';
COMMENT ON POLICY "Company users can update their search templates" ON public.search_templates IS '企業ユーザーは自社のスカウトテンプレートを更新可能';
COMMENT ON POLICY "Company users can delete their search templates" ON public.search_templates IS '企業ユーザーは自社のスカウトテンプレートを削除可能';