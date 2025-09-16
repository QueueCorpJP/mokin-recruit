-- Update gender constraint to accept Japanese values
ALTER TABLE candidates
DROP CONSTRAINT IF EXISTS candidates_gender_check;

ALTER TABLE candidates
ADD CONSTRAINT candidates_gender_check
CHECK (gender = ANY (ARRAY['男性'::text, '女性'::text, '未回答'::text]));