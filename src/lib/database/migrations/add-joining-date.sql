-- 選考進捗テーブルに入社日カラムを追加
ALTER TABLE public.selection_progress
ADD COLUMN IF NOT EXISTS joining_date DATE;
