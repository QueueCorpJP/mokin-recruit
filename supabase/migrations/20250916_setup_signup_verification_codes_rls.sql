-- signup_verification_codesテーブルのRLSポリシー設定
-- 匿名ユーザーでも認証コードの保存・確認・削除ができるようにする

-- RLSを有効化
ALTER TABLE public.signup_verification_codes ENABLE ROW LEVEL SECURITY;

-- 認証コードの挿入を許可（匿名ユーザーでも可能）
CREATE POLICY "signup_verification_codes_insert_policy" ON public.signup_verification_codes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- 認証コードの読み取りを許可（匿名ユーザーでも可能）
CREATE POLICY "signup_verification_codes_select_policy" ON public.signup_verification_codes
FOR SELECT
TO anon, authenticated
USING (true);

-- 認証コードの更新を許可（匿名ユーザーでも可能）
CREATE POLICY "signup_verification_codes_update_policy" ON public.signup_verification_codes
FOR UPDATE
TO anon, authenticated
USING (true);

-- 認証コードの削除を許可（匿名ユーザーでも可能）
CREATE POLICY "signup_verification_codes_delete_policy" ON public.signup_verification_codes
FOR DELETE
TO anon, authenticated
USING (true);