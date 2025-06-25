# データ要件・エンティティ定義

## 概要

システムの中心となるデータ構造（エンティティ）と、それらが持つべき主要な属性（項目）を、開発・API設計に直接活用できるレベルで詳細に定義します。

## 4. データ要件（主要エンティティと属性）

### 4.1. 候補者 (Candidate)

#### 基本情報
- **候補者ID** (candidate_id): システム自動採番, 主キー
- **氏名** (last_name, first_name): 新規会員登録後の編集不可
- **フリガナ** (last_name_kana, first_name_kana): 名前入力時に自動入力
- **性別** (gender): 男性, 女性, 未回答 - 必須
- **現在の住まい** (current_residence): 都道府県, 海外地域 - 必須
- **生年月日** (birth_date): YYYY/MM/DD - 必須 (年齢計算用、表示は年齢のみ)
- **連絡先電話番号** (phone_number): ハイフンなし数値 - 必須
- **メールアドレス** (email): ログインID - 必須
- **パスワード** (password_hash): ハッシュ化して保存 - 必須
- **現在の年収** (current_salary): 選択式 (500万未満, 500-600万, ..., 5000万～) - 必須
- **登録日時** (created_at)
- **最終更新日時** (updated_at)
- **最終ログイン日時** (last_login_at)
- **退会日時** (deleted_at): 退会した場合
- **退会理由** (deletion_reason): 退会した場合
- **ステータス** (status): 仮登録, 本登録, 退会済など

#### 転職活動状況
- **転職経験** (has_job_change_experience): あり, なし - 必須
- **転職希望時期** (desired_change_timing): 3か月以内に, 6か月以内に, 1年以内に, 未定 - 必須
- **転職活動状況** (job_search_status): まだ始めていない, 情報収集中, 書類選考中企業あり, 面接中企業あり, 内定あり - 必須

#### 選考中企業リスト (CandidateApplicationStatus)
- **選考状況ID** (application_status_id): 主キー
- **候補者ID** (candidate_id): 外部キー
- **企業名** (company_name): テキスト入力, サジェストあり - 必須(条件付)
- **部署名** (department_name): 必須
- **役職名** (position_name): 任意
- **選考ステータス** (selection_status): 書類選考, 一次面接, 二次面接, 最終面接, 内定 - 必須(条件付)
- **他社開示同意フラグ** (disclosure_consent): 企業ごとに設定、候補者が同意した場合True

#### 職務経歴 (直近の在籍企業)
- **企業名** (recent_company_name): テキスト入力, サジェストあり - 必須
- **部署名** (recent_department_name): 必須
- **役職名** (recent_position_name): 任意
- **在籍開始年月** (employment_start_date): YYYY/MM - 必須
- **在籍終了年月** (employment_end_date): YYYY/MM or 在籍中フラグ - 必須
- **業種** (recent_industry): 選択式 - 必須
- **職種** (recent_job_type): 選択式 - 必須
- **業務内容** (job_description): テキスト入力 - 必須

#### 学歴・語学・スキル
- **最終学歴** (final_education): 選択式 - 必須
- **英語力** (english_level): ネイティブ, ビジネス会話, 日常会話, 基礎会話, なし - 必須
- **英語以外の語学** (other_language): テキスト入力 - 任意
- **英語以外の語学力** (other_language_level): ネイティブ, ビジネス会話, 日常会話, 基礎会話, なし - 任意
- **スキル** (skills): テキスト入力, サジェストあり, 最低3つ以上 - 必須
- **保有資格** (certifications): テキスト入力 - 任意

#### 経験業種リスト (CandidateIndustryExperience)
- **経験業種ID** (industry_experience_id): 主キー
- **候補者ID** (candidate_id): 外部キー
- **業種** (industry): 選択式
- **経験年数** (experience_years): 数値入力 - 業種入力時は必須

#### 経験職種リスト (CandidateJobTypeExperience)
- **経験職種ID** (job_type_experience_id): 主キー
- **候補者ID** (candidate_id): 外部キー
- **職種** (job_type): 選択式
- **経験年数** (experience_years): 数値入力 - 職種入力時は必須

#### 希望条件
- **希望年収** (desired_salary): 選択式 (問わない, 600万円以上, ..., 5000万円以上) - 必須
- **希望業種** (desired_industries): 選択式, 複数選択可 - 必須
- **希望職種** (desired_job_types): 選択式, 複数選択可 - 必須
- **希望勤務地** (desired_locations): 選択式, 複数選択可 - 必須
- **興味のある働き方** (interested_work_styles): 選択式, 複数選択可 - 任意

#### その他
- **職務要約** (career_summary): テキスト入力 - 任意
- **特記事項・自己PR** (self_pr): テキスト入力 - 任意
- **レジュメファイルパス** (resume_file_path): アップロードされた場合
- **職務経歴書ファイルパス** (career_history_file_path): アップロードされた場合
- **スカウト受け取り設定** (scout_reception_enabled): ON/OFF
- **メール通知設定** (email_notification_settings): 各種通知のON/OFF (JSON形式)
- **ブロック企業リスト** (blocked_company_ids): 企業IDのリスト (JSON形式)
- **お気に入り求人リスト** (favorite_job_ids): 求人IDのリスト (JSON形式)

### 4.2. 企業アカウント (CompanyAccount)

- **企業アカウントID** (company_account_id): システム自動採番, 主キー
- **企業名** (company_name): 必須
- **本社所在地** (headquarters_address): 必須
- **代表者名** (representative_name): 必須
- **業種** (industry): 選択式 - 必須
- **会社概要** (company_overview): テキスト
- **アピールポイント** (appeal_points): テキスト
- **ロゴ画像パス** (logo_image_path): 任意
- **契約プラン情報** (contract_plan): JSON形式 (プランID, 契約開始日, 契約終了日など)
- **ステータス** (status): 有効, 休会中, 削除済など
- **登録日時** (created_at)
- **最終更新日時** (updated_at)

### 4.3. 企業グループ (CompanyGroup)

- **企業グループID** (company_group_id): システム自動採番, 主キー
- **企業アカウントID** (company_account_id): 外部キー - 必須
- **企業グループ名** (group_name): 必須
- **登録日時** (created_at)
- **最終更新日時** (updated_at)

### 4.4. 企業ユーザー (CompanyUser)

- **企業ユーザーID** (company_user_id): システム自動採番, 主キー
- **企業アカウントID** (company_account_id): 外部キー - 必須
- **氏名** (full_name): 必須
- **役職名** (position_title): 任意
- **メールアドレス** (email): ログインID - 必須
- **パスワード** (password_hash): ハッシュ化して保存 - 必須
- **メール通知設定** (email_notification_settings): 各種通知のON/OFF (JSON形式)
- **登録日時** (created_at)
- **最終更新日時** (updated_at)
- **最終ログイン日時** (last_login_at)

### 4.5. 企業ユーザー・グループ権限 (CompanyUserGroupPermission)

- **権限ID** (permission_id): システム自動採番, 主キー
- **企業ユーザーID** (company_user_id): 外部キー - 必須
- **企業グループID** (company_group_id): 外部キー - 必須
- **権限レベル** (permission_level): 管理者, スカウト担当者 - 必須
- **付与日時** (granted_at)
- **更新日時** (updated_at)

### 4.6. 求人 (JobPosting)

#### 基本情報
- **求人ID** (job_posting_id): システム自動採番, 主キー
- **企業グループID** (company_group_id): 外部キー - 必須
- **求人タイトル** (job_title): 必須
- **仕事内容** (job_description): リッチテキスト - 必須
- **応募資格（必須）** (required_qualifications): リッチテキスト - 必須
- **応募資格（歓迎）** (preferred_qualifications): リッチテキスト - 任意

#### 給与・勤務条件
- **年収（下限）** (salary_min): 数値 - 必須
- **年収（上限）** (salary_max): 数値 - 必須
- **年収（相談可否フラグ）** (salary_negotiable): Boolean
- **勤務地（都道府県）** (work_location_prefecture): 選択式 - 必須
- **勤務地（詳細住所）** (work_location_detail): テキスト - 任意
- **職種** (job_type): 選択式 - 必須
- **業種** (industry): 選択式 - 必須
- **リモートワーク可否** (remote_work_available): Boolean
- **受動喫煙対策** (smoking_policy): 選択式

#### 企業アピール・設定
- **アピールポイント** (appeal_points): 複数選択可、またはテキスト
- **社内メモ** (internal_memo): 企業側のみ閲覧可能
- **公開範囲** (visibility_scope): 完全公開, 一部公開, 限定公開, 公開停止, 下書き
- **掲載ステータス** (publication_status): 申請中, 承認済, 非承認, 掲載終了など
- **履歴書提出必須フラグ** (resume_required): Boolean
- **職務経歴書提出必須フラグ** (career_history_required): Boolean

#### 日時・承認情報
- **作成日時** (created_at)
- **最終更新日時** (updated_at)
- **掲載開始日時** (publication_start_at)
- **掲載終了日時** (publication_end_at): 設定する場合
- **運営承認者ID** (approved_by_admin_id): 承認された場合
- **運営承認日時** (approved_at): 承認された場合
- **非承認理由** (rejection_reason): 非承認の場合

### 4.7. スカウト・メッセージ (Message)

- **メッセージID** (message_id): システム自動採番, 主キー
- **送信元ユーザーID** (sender_user_id): 候補者ID or 企業ユーザーID - 必須
- **送信元ユーザー種別** (sender_user_type): candidate, company_user - 必須
- **送信先ユーザーID** (recipient_user_id): 候補者ID or 企業ユーザーID - 必須
- **送信先ユーザー種別** (recipient_user_type): candidate, company_user - 必須
- **関連求人ID** (related_job_posting_id): スカウト時や応募後のメッセージに紐づく - 必須
- **企業グループID** (company_group_id): 企業からの送信の場合 - 必須
- **メッセージ種別** (message_type): scout, application, general_message
- **件名** (subject): スカウト時のみ - 条件付き必須
- **本文** (content): テキスト - 必須
- **添付ファイルパス** (attachment_file_paths): JSON形式 (複数可)
- **送信日時** (sent_at)
- **開封日時** (opened_at): 受信側
- **ステータス** (status): 未読, 既読, NGワード確認中, 送信承認済, 送信却下など
- **NGワード確認結果** (ng_word_check_result): 承認, 却下, 却下理由など (JSON形式)
- **辞退理由** (decline_reason): 候補者がスカウトを辞退した場合

### 4.8. スカウトチケット (ScoutTicket)

- **スカウトチケットID** (scout_ticket_id): システム自動採番, 主キー
- **企業グループID** (company_group_id): 外部キー - 必須
- **付与日時** (granted_at)
- **有効期限** (expires_at)
- **消費日時** (consumed_at): 消費された場合
- **消費スカウトID** (consumed_scout_message_id): 消費された場合、どのスカウトに使われたか
- **チケット種別** (ticket_type): 月次付与, スポット購入, 追加付与など
- **ステータス** (status): 有効, 消費済, 期限切れ

### 4.9. テンプレート (Template)

- **テンプレートID** (template_id): システム自動採番, 主キー
- **企業グループID** (company_group_id): 外部キー (企業向けテンプレートの場合)
- **テンプレート種別** (template_type): scout, message
- **テンプレート名** (template_name): 必須
- **本文** (content): 関数呼び出し箇所を含む - 必須
- **対象求人ID** (target_job_posting_id): スカウトテンプレートの場合、任意で紐づけ
- **作成者ID** (created_by_user_id): 企業ユーザーID
- **作成日時** (created_at)
- **最終更新日時** (updated_at)

### 4.10. 採用進捗 (ApplicationProgress)

- **進捗ID** (progress_id): システム自動採番, 主キー
- **候補者ID** (candidate_id): 外部キー - 必須
- **求人ID** (job_posting_id): 外部キー - 必須
- **企業グループID** (company_group_id): 外部キー - 必須
- **応募日時** (applied_at): 候補者からの応募の場合
- **スカウト送信日時** (scout_sent_at): 企業からのスカウト起点の場合
- **現在の選考ステータス** (current_selection_status): 書類選考, 一次面接, 二次面接, 最終面接, 内定, 入社, 見送り, 辞退
- **内定日** (offer_date): 内定の場合
- **入社予定日** (expected_start_date): 入社予定の場合
- **社内メモ** (internal_memo): 企業側のみ閲覧可能
- **作成日時** (created_at)
- **最終更新日時** (updated_at)

### 4.11. 選考ステータス更新履歴 (SelectionStatusHistory)

- **履歴ID** (history_id): システム自動採番, 主キー
- **進捗ID** (progress_id): 外部キー - 必須
- **更新前ステータス** (previous_status)
- **更新後ステータス** (new_status)
- **更新日時** (updated_at)
- **更新者ID** (updated_by_user_id): 企業ユーザーID
- **更新理由・メモ** (update_memo): 任意

### 4.12. 面接日程 (InterviewSchedule)

- **面接日程ID** (interview_schedule_id): システム自動採番, 主キー
- **進捗ID** (progress_id): 外部キー - 必須
- **面接日時** (interview_datetime)
- **面接種別** (interview_type): 一次面接, 二次面接, 最終面接など
- **面接形式** (interview_format): 対面, オンライン, 電話など
- **面接場所・URL** (interview_location): 対面の場合は場所、オンラインの場合はURL
- **面接官** (interviewer_names): テキスト
- **備考** (notes): テキスト
- **登録日時** (created_at)

### 4.13. メディア記事 (MediaArticle)

- **記事ID** (article_id): システム自動採番, 主キー
- **タイトル** (title): 必須
- **本文** (content): リッチテキスト - 必須
- **概要** (summary): SEO用 - 任意
- **作成者ID** (created_by_admin_id): 管理者ID - 必須
- **公開ステータス** (publication_status): 公開, 非公開, 下書き, 予約公開
- **公開日時** (published_at)
- **予約公開日時** (scheduled_publish_at): 予約公開の場合
- **最終更新日時** (updated_at)
- **PV数** (page_views): 数値
- **メタディスクリプション** (meta_description): SEO用
- **サムネイル画像パス** (thumbnail_image_path): 任意

### 4.14. メディアカテゴリー (MediaCategory)

- **カテゴリーID** (category_id): システム自動採番, 主キー
- **カテゴリー名** (category_name): 必須
- **カテゴリー説明** (category_description): 任意
- **親カテゴリーID** (parent_category_id): 階層構造用, 外部キー
- **表示順序** (display_order): 数値
- **作成日時** (created_at)
- **最終更新日時** (updated_at)

### 4.15. メディアタグ (MediaTag)

- **タグID** (tag_id): システム自動採番, 主キー
- **タグ名** (tag_name): 必須
- **タグ説明** (tag_description): 任意
- **使用回数** (usage_count): 数値 (記事との関連数)
- **作成日時** (created_at)
- **最終更新日時** (updated_at)

### 4.16. 記事・カテゴリー関連 (ArticleCategoryRelation)

- **関連ID** (relation_id): システム自動採番, 主キー
- **記事ID** (article_id): 外部キー - 必須
- **カテゴリーID** (category_id): 外部キー - 必須

### 4.17. 記事・タグ関連 (ArticleTagRelation)

- **関連ID** (relation_id): システム自動採番, 主キー
- **記事ID** (article_id): 外部キー - 必須
- **タグID** (tag_id): 外部キー - 必須

### 4.18. お知らせ (NotificationContent)

- **お知らせID** (notification_id): システム自動採番, 主キー
- **タイトル** (title): 必須
- **本文** (content): リッチテキスト - 必須
- **配信対象** (target_audience): 全体, 候補者, 企業 - 必須
- **配信日時** (delivery_datetime): 即時 or 予約配信日時
- **配信方法** (delivery_method): メール配信, お知らせページ掲載, 両方
- **強制配信フラグ** (force_delivery): 希望者のみ／全員 - Boolean
- **作成者ID** (created_by_admin_id): 管理者ID - 必須
- **作成日時** (created_at)
- **配信完了日時** (delivered_at): 配信完了後に設定
- **配信対象者数** (target_user_count): 配信対象となったユーザー数
- **開封者数** (opened_user_count): メール開封者数

### 4.19. NGキーワード (NgKeyword)

- **NGキーワードID** (ng_keyword_id): システム自動採番, 主キー
- **キーワード文字列** (keyword): 必須
- **マッチングタイプ** (matching_type): 完全一致, 部分一致 - 必須
- **大文字小文字区別** (case_sensitive): Boolean
- **除外条件** (exclusion_conditions): JSON形式 (特定の文脈では許可等)
- **キーワード種別** (keyword_category): 法令違反関連, 不適切な勧誘・営業, 個人情報要求, その他
- **検出回数** (detection_count): 数値 (検出された回数)
- **登録日時** (created_at)
- **登録者ID** (created_by_admin_id): 管理者ID - 必須
- **最終更新日時** (updated_at)

### 4.20. 検索条件保存 (SavedSearchCondition)

- **保存検索ID** (saved_search_id): システム自動採番, 主キー
- **企業ユーザーID** (company_user_id): 外部キー - 必須
- **企業グループID** (company_group_id): 外部キー - 必須
- **検索条件名** (search_name): ユーザー指定名 - 必須
- **検索条件** (search_conditions): JSON形式 (検索パラメータ一式)
- **保存日時** (created_at)
- **最終使用日時** (last_used_at)
- **使用回数** (usage_count): 数値

### 4.21. 候補者ピックアップ・非表示リスト (CandidateListManagement)

- **リスト管理ID** (list_management_id): システム自動採番, 主キー
- **企業ユーザーID** (company_user_id): 外部キー - 必須
- **候補者ID** (candidate_id): 外部キー - 必須
- **リスト種別** (list_type): ピックアップ, 非表示
- **設定日時** (created_at)
- **メモ** (memo): 任意

## 関連ドキュメント

- [候補者向け機能詳細](./01_candidate_features.md)
- [企業向け機能詳細](./02_company_features.md)
- [管理者向け機能詳細](./03_admin_features.md)
- [権限管理](./05_permissions.md)
- [通知機能](./06_notifications.md) 