-- 非表示にした候補者を管理するテーブル
create table hidden_candidates (
  id uuid default gen_random_uuid() primary key,
  company_id uuid references companies(id) on delete cascade not null,
  candidate_id uuid references candidates(id) on delete cascade not null,
  search_query jsonb,
  hidden_at timestamp with time zone default now() not null,
  created_at timestamp with time zone default now() not null,
  
  -- 同じ会社が同じ候補者を重複して非表示にできないようにする
  unique(company_id, candidate_id)
);

-- インデックスの作成
create index idx_hidden_candidates_company on hidden_candidates(company_id);
create index idx_hidden_candidates_candidate on hidden_candidates(candidate_id);
create index idx_hidden_candidates_hidden_at on hidden_candidates(hidden_at);

-- RLSの有効化
alter table hidden_candidates enable row level security;

-- 企業は自分の非表示設定のみ操作できる
create policy "Companies can view own hidden candidates"
  on hidden_candidates for select
  using (auth.uid() in (
    select user_id from companies where id = hidden_candidates.company_id
  ));

create policy "Companies can insert own hidden candidates"
  on hidden_candidates for insert
  with check (auth.uid() in (
    select user_id from companies where id = hidden_candidates.company_id
  ));

create policy "Companies can delete own hidden candidates"
  on hidden_candidates for delete
  using (auth.uid() in (
    select user_id from companies where id = hidden_candidates.company_id
  ));