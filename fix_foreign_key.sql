-- job_postingsテーブルの外部キー制約を修正
-- 現在: company_group_id が company_users(id) を参照（間違い）
-- 正しく: company_group_id が company_groups(id) を参照

-- 1. 間違った外部キー制約を削除
ALTER TABLE public.job_postings 
DROP CONSTRAINT IF EXISTS job_postings_company_group_id_fkey;

-- 2. 正しい外部キー制約を追加
ALTER TABLE public.job_postings 
ADD CONSTRAINT job_postings_company_group_id_fkey 
FOREIGN KEY (company_group_id) REFERENCES public.company_groups(id);

-- 3. 修正後の制約を確認
SELECT conname, conrelid::regclass, confrelid::regclass 
FROM pg_constraint 
WHERE conname = 'job_postings_company_group_id_fkey';