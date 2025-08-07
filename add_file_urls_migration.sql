-- messagesテーブルにfile_urlsコラムを追加
-- ファイルのURL配列を格納するためのJSONBフィールド
ALTER TABLE public.messages 
ADD COLUMN file_urls JSONB DEFAULT '[]'::jsonb;

-- コメント追加
COMMENT ON COLUMN public.messages.file_urls IS 'アップロードされたファイルのURL配列';