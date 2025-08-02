-- job_postingsテーブルのovertime列の型を確認
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'job_postings' 
  AND column_name IN ('overtime', 'overtime_info')
ORDER BY column_name;

-- 追加: 全ての列の型を確認
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'job_postings' 
ORDER BY ordinal_position;