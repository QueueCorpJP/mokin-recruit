-- チケット管理システム用のテーブル作成SQL
-- このファイルをSupabase SQL Editorで実行してください

-- 1. 企業のチケット残高管理テーブル
CREATE TABLE IF NOT EXISTS public.company_tickets (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_account_id uuid NOT NULL,
  total_tickets integer NOT NULL DEFAULT 0,
  used_tickets integer NOT NULL DEFAULT 0,
  remaining_tickets integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT company_tickets_pkey PRIMARY KEY (id),
  CONSTRAINT company_tickets_company_account_id_fkey
    FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id)
);

-- 2. チケット取引履歴テーブル
CREATE TABLE IF NOT EXISTS public.ticket_transactions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  company_account_id uuid NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('PURCHASE', 'USAGE', 'BONUS')),
  amount integer NOT NULL,
  description text,
  related_message_id uuid,
  related_application_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT ticket_transactions_pkey PRIMARY KEY (id),
  CONSTRAINT ticket_transactions_company_account_id_fkey
    FOREIGN KEY (company_account_id) REFERENCES public.company_accounts(id),
  CONSTRAINT ticket_transactions_related_message_id_fkey
    FOREIGN KEY (related_message_id) REFERENCES public.messages(id),
  CONSTRAINT ticket_transactions_related_application_id_fkey
    FOREIGN KEY (related_application_id) REFERENCES public.application(id)
);

-- 3. RLSポリシーの設定（必要に応じて）
-- ALTER TABLE public.company_tickets ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.ticket_transactions ENABLE ROW LEVEL SECURITY;

-- 4. インデックスの作成
CREATE INDEX IF NOT EXISTS idx_company_tickets_company_account_id ON public.company_tickets(company_account_id);
CREATE INDEX IF NOT EXISTS idx_ticket_transactions_company_account_id ON public.ticket_transactions(company_account_id);
CREATE INDEX IF NOT EXISTS idx_ticket_transactions_created_at ON public.ticket_transactions(created_at);

-- 5. 更新トリガーの作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_tickets_updated_at
  BEFORE UPDATE ON public.company_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. テストデータの挿入
INSERT INTO public.company_tickets (company_account_id, total_tickets, used_tickets, remaining_tickets)
VALUES ('7c762a0d-5743-422d-aeeb-a394609c9722', 100, 0, 100)
ON CONFLICT (company_account_id) DO UPDATE SET
  total_tickets = EXCLUDED.total_tickets,
  remaining_tickets = EXCLUDED.remaining_tickets,
  updated_at = now();

-- 7. 更新トリガーの作成
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_company_tickets_updated_at
  BEFORE UPDATE ON public.company_tickets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. スカウトメッセージ送信時のチケット消費関数
CREATE OR REPLACE FUNCTION consume_ticket_for_scout_message()
RETURNS TRIGGER AS $$
DECLARE
  scout_tickets_used INTEGER := 5; -- スカウトメッセージ1通あたり5チケット消費
  company_account_id_var UUID;
BEGIN
  -- SCOUTメッセージかつ企業からのメッセージの場合のみ処理
  IF NEW.message_type = 'SCOUT' AND NEW.sender_type = 'COMPANY_USER' AND NEW.sender_company_group_id IS NOT NULL THEN
    -- 企業グループから企業アカウントIDを取得
    SELECT cg.company_account_id INTO company_account_id_var
    FROM public.company_groups cg
    WHERE cg.id = NEW.sender_company_group_id;

    -- 企業アカウントIDが取得できた場合のみチケット消費処理を実行
    IF company_account_id_var IS NOT NULL THEN
      -- チケット残高チェックと消費
      UPDATE public.company_tickets
      SET
        used_tickets = used_tickets + scout_tickets_used,
        remaining_tickets = remaining_tickets - scout_tickets_used,
        updated_at = now()
      WHERE company_account_id = company_account_id_var
        AND remaining_tickets >= scout_tickets_used;

      -- チケット消費が成功した場合のみ取引履歴を記録
      IF FOUND THEN
        INSERT INTO public.ticket_transactions (
          company_account_id,
          transaction_type,
          amount,
          description,
          related_message_id
        ) VALUES (
          company_account_id_var,
          'USAGE',
          -scout_tickets_used,
          'スカウトメッセージ送信',
          NEW.id
        );
      END IF;
    END IF;
  END IF;

  RETURN NEW;
END;
$$ language 'plpgsql';

-- 9. スカウトメッセージ送信時のトリガー作成
CREATE TRIGGER consume_ticket_on_scout_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION consume_ticket_for_scout_message();

-- 10. サンプル取引履歴データの挿入
INSERT INTO public.ticket_transactions (company_account_id, transaction_type, amount, description)
VALUES
  ('7c762a0d-5743-422d-aeeb-a394609c9722', 'PURCHASE', 100, '初期チケット購入'),
  ('7c762a0d-5743-422d-aeeb-a394609c9722', 'USAGE', -5, 'スカウトメッセージ送信'),
  ('7c762a0d-5743-422d-aeeb-a394609c9722', 'USAGE', -3, 'スカウトメッセージ送信'),
  ('7c762a0d-5743-422d-aeeb-a394609c9722', 'USAGE', -8, 'スカウトメッセージ送信'),
  ('7c762a0d-5743-422d-aeeb-a394609c9722', 'USAGE', -2, 'スカウトメッセージ送信'),
  ('7c762a0d-5743-422d-aeeb-a394609c9722', 'USAGE', -6, 'スカウトメッセージ送信');
