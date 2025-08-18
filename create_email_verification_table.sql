-- メール認証コード用テーブルを作成
CREATE TABLE IF NOT EXISTS email_verification_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  candidate_id UUID NOT NULL REFERENCES candidates(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  code VARCHAR(4) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  CONSTRAINT unique_candidate_verification UNIQUE (candidate_id)
);

-- インデックスを作成（パフォーマンス向上）
CREATE INDEX IF NOT EXISTS idx_email_verification_codes_candidate_id 
ON email_verification_codes(candidate_id);

CREATE INDEX IF NOT EXISTS idx_email_verification_codes_code 
ON email_verification_codes(code);

CREATE INDEX IF NOT EXISTS idx_email_verification_codes_expires_at 
ON email_verification_codes(expires_at);

-- RLS (Row Level Security) を有効化
ALTER TABLE email_verification_codes ENABLE ROW LEVEL SECURITY;

-- 候補者は自分の認証コードのみアクセス可能
CREATE POLICY "Candidates can access their own verification codes"
ON email_verification_codes
FOR ALL
TO authenticated
USING (candidate_id = auth.uid());