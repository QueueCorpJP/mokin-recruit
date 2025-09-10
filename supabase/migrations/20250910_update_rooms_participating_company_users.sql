-- roomsテーブルのparticipating_company_usersフィールドをJSONから文字列配列に変更
ALTER TABLE public.rooms ALTER COLUMN participating_company_users TYPE text[] USING (participating_company_users::text[]);
