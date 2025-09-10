-- スカウトテンプレート（search_templates）テーブルにis_savedカラムを追加
ALTER TABLE search_templates 
ADD COLUMN IF NOT EXISTS is_saved BOOLEAN DEFAULT false;

-- 既存データのis_savedをfalseに設定（デフォルト値が適用されるが明示的に設定）
UPDATE search_templates 
SET is_saved = false 
WHERE is_saved IS NULL;

-- is_savedカラムにコメントを追加
COMMENT ON COLUMN search_templates.is_saved IS 'スカウトテンプレートの保存状態を管理するフラグ';