company/recruitment/detailページの概要を説明します。

ページ概要
・スカウトや求人からの応募してきた候補者(candidate)を一覧するページです。応募やスカウト後の自社との進捗を確認できそれぞれのフェーズで合否登録も行います。

候補者カード内の情報
・直近の企業名(在籍中の企業名)
・その人とやり取りをしている企業内のグループ名
・候補者が対象としている求人(エンジニア、営業職など)
・候補者名(もしくはID)
・在住地/年齢/性別
・経験職種
・経験業種
・選考中小企業
・候補者とやりとりしている担当者名
・この候補者が選考中の企業名(自社以外で)

## 必要なデータベーステーブルとコラム

### 1. candidates テーブル (候補者基本情報)
- id: 候補者ID
- first_name, last_name: 候補者名
- current_company: 直近の企業名(在籍中の企業名)
- prefecture: 在住地
- birth_date: 年齢計算用の生年月日
- gender: 性別

### 2. job_type_experience テーブル (経験職種)
- candidate_id: 候補者ID
- job_type_name: 経験職種名
- experience_years: 経験年数

### 3. work_experience テーブル (経験業種)
- candidate_id: 候補者ID
- industry_name: 経験業種名
- experience_years: 経験年数

### 4. company_groups テーブル (企業内グループ)
- id: グループID
- group_name: グループ名
- company_account_id: 企業アカウントID

### 5. job_postings テーブル (求人)
- id: 求人ID
- title: 求人タイトル
- company_group_id: グループID
- job_type: 対象職種

### 6. application テーブル (応募・スカウト関連)
- id: 応募ID
- candidate_id: 候補者ID
- company_group_id: グループID
- job_posting_id: 求人ID
- status: 選考状況
- created_at: 応募日時

### 7. rooms テーブル (メッセージルーム)
- id: ルームID
- candidate_id: 候補者ID
- company_group_id: グループID
- related_job_posting_id: 関連求人ID

### 8. company_users テーブル (企業ユーザー)
- id: ユーザーID
- full_name: 担当者名
- company_account_id: 企業アカウントID

### 9. company_user_group_permissions テーブル (担当者とグループの関連)
- company_user_id: ユーザーID
- company_group_id: グループID

### 10. career_status_entries テーブル (選考中企業)
- candidate_id: 候補者ID
- company_name: 選考中企業名
- industries: 業種情報(jsonb)
- progress_status: 進捗状況

### 対応関係確認
✅ 直近企業名: candidates.current_company
✅ グループ名: company_groups.group_name (application経由で取得)
✅ 対象求人: job_postings.title (application経由で取得)
✅ 候補者名: candidates.first_name + last_name
✅ 在住地/年齢/性別: candidates.prefecture, birth_date, gender
✅ 経験職種: job_type_experience.job_type_name
✅ 経験業種: work_experience.industry_name
✅ 選考中企業: career_status_entries.company_name
✅ 担当者名: company_users.full_name (rooms/permissions経由で取得)
✅ 選考進捗: application.status

