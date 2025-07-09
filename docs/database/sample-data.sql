-- ================================================
-- MVPスキーマ用サンプルデータ（UUID修正版）
-- ================================================
-- 実行前提: mvp-schema.sql が既に実行済みであること
-- 実行方法: Supabase SQL Editor でこのファイル全体を実行

-- ================================================
-- 1. 企業アカウントデータ（拡張）
-- ================================================
INSERT INTO "company_accounts" (id, company_name, industry, headquarters_address, representative_name, company_overview, status) VALUES
-- IT・テック企業
('01234567-89ab-cdef-0123-456789abcdef', 'テックイノベーション株式会社', 'IT・インターネット', '東京都渋谷区神南1-1-1', '山田太郎', 'AIとブロックチェーン技術で社会課題を解決するスタートアップ企業です。', 'ACTIVE'),
('12345678-9abc-def0-1234-56789abcdef0', '株式会社クラウドソリューションズ', 'IT・インターネット', '東京都港区六本木3-2-1', '佐藤花子', 'クラウドインフラとDevOpsソリューションを提供する企業です。', 'ACTIVE'),
('23456789-abcd-ef01-2345-6789abcdef01', 'デジタルマーケティング合同会社', 'IT・インターネット', '大阪府大阪市北区梅田1-1-3', '田中次郎', 'デジタルマーケティングとEコマースプラットフォームの開発を行っています。', 'ACTIVE'),

-- 従来型企業
('3456789a-bcde-f012-3456-789abcdef012', '日本総合商事株式会社', '商社・貿易', '東京都千代田区丸の内2-7-3', '鈴木一郎', '総合商社として幅広い事業領域で国際的に展開しています。', 'ACTIVE'),
('456789ab-cdef-0123-4567-89abcdef0123', 'グローバルコンサルティング株式会社', 'コンサルティング', '東京都新宿区西新宿2-8-1', '高橋美咲', '戦略コンサルティングとデジタルトランスフォーメーション支援を行います。', 'ACTIVE'),
('56789abc-def0-1234-5678-9abcdef01234', '東京製造業株式会社', '製造業', '神奈川県横浜市西区みなとみらい4-6-2', '伊藤健太', '精密機械と自動車部品の製造を手がける老舗企業です。', 'ACTIVE');

-- ================================================
-- 2. 企業グループデータ
-- ================================================
INSERT INTO "company_groups" (id, company_account_id, group_name, description) VALUES
-- テックイノベーション
('6789abcd-ef01-2345-6789-abcdef012345', '01234567-89ab-cdef-0123-456789abcdef', 'エンジニア採用チーム', 'フロントエンド・バックエンド・インフラエンジニアの採用を担当'),
('789abcde-f012-3456-789a-bcdef0123456', '01234567-89ab-cdef-0123-456789abcdef', 'データサイエンス採用チーム', 'データサイエンティスト・MLエンジニアの採用を担当'),

-- クラウドソリューションズ
('89abcdef-0123-4567-89ab-cdef01234567', '12345678-9abc-def0-1234-56789abcdef0', 'DevOps採用チーム', 'DevOpsエンジニア・SREの採用を担当'),
('9abcdef0-1234-5678-9abc-def012345678', '12345678-9abc-def0-1234-56789abcdef0', 'セキュリティ採用チーム', 'セキュリティエンジニア・コンサルタントの採用を担当'),

-- デジタルマーケティング
('abcdef01-2345-6789-abcd-ef0123456789', '23456789-abcd-ef01-2345-6789abcdef01', 'マーケティング採用チーム', 'デジタルマーケター・データアナリストの採用を担当'),

-- 日本総合商事
('bcdef012-3456-789a-bcde-f01234567890', '3456789a-bcde-f012-3456-789abcdef012', '新卒採用チーム', '新卒総合職の採用を担当'),
('cdef0123-4567-89ab-cdef-012345678901', '3456789a-bcde-f012-3456-789abcdef012', 'IT部門採用チーム', 'IT部門の中途採用を担当'),

-- グローバルコンサルティング
('def01234-5678-9abc-def0-123456789012', '456789ab-cdef-0123-4567-89abcdef0123', 'コンサルタント採用チーム', '経営コンサルタント・ITコンサルタントの採用を担当'),

-- 東京製造業
('ef012345-6789-abcd-ef01-234567890123', '56789abc-def0-1234-5678-9abcdef01234', '技術者採用チーム', '機械設計・品質管理・生産技術の採用を担当');

-- ================================================
-- 3. 企業ユーザーデータ
-- ================================================
INSERT INTO "company_users" (id, company_account_id, email, password_hash, full_name, position_title) VALUES
-- テックイノベーション
('f0123456-789a-bcde-f012-3456789abcde', '01234567-89ab-cdef-0123-456789abcdef', 'recruiter1@tech-innovation.co.jp', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '採用太郎', 'エンジニア採用マネージャー'),
('01234567-89ab-cdef-0123-456789abcde0', '01234567-89ab-cdef-0123-456789abcdef', 'hr.manager@tech-innovation.co.jp', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '人事花子', 'データサイエンス採用スペシャリスト'),

-- クラウドソリューションズ
('12345678-9abc-def0-1234-56789abcde01', '12345678-9abc-def0-1234-56789abcdef0', 'devops.recruiter@cloud-solutions.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', 'クラウド次郎', 'DevOps採用リード'),
('23456789-abcd-ef01-2345-6789abcde012', '12345678-9abc-def0-1234-56789abcdef0', 'security.hr@cloud-solutions.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', 'セキュリティ美咲', 'セキュリティ採用マネージャー'),

-- デジタルマーケティング
('3456789a-bcde-f012-3456-789abcde0123', '23456789-abcd-ef01-2345-6789abcdef01', 'marketing.hr@digital-marketing.jp', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', 'マーケ健太', 'マーケティング採用担当'),

-- 日本総合商事
('456789ab-cdef-0123-4567-89abcde01234', '3456789a-bcde-f012-3456-789abcdef012', 'graduate.recruiter@japan-trading.co.jp', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '新卒採用部長', '新卒採用部長'),
('56789abc-def0-1234-5678-9abcde012345', '3456789a-bcde-f012-3456-789abcdef012', 'it.recruiter@japan-trading.co.jp', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', 'IT採用担当', 'IT部門採用担当'),

-- グローバルコンサルティング
('6789abcd-ef01-2345-6789-abcde0123456', '456789ab-cdef-0123-4567-89abcdef0123', 'consultant.hr@global-consulting.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', 'コンサル採用', 'シニア採用マネージャー'),

-- 東京製造業
('789abcde-f012-3456-789a-bcde01234567', '56789abc-def0-1234-5678-9abcdef01234', 'engineer.hr@tokyo-manufacturing.co.jp', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '技術者採用', '技術系採用マネージャー');

-- ================================================
-- 4. 企業ユーザー・グループ権限データ
-- ================================================
INSERT INTO "company_user_group_permissions" (company_user_id, company_group_id, permission_level) VALUES
-- テックイノベーション
('f0123456-789a-bcde-f012-3456789abcde', '6789abcd-ef01-2345-6789-abcdef012345', 'ADMINISTRATOR'),
('01234567-89ab-cdef-0123-456789abcde0', '789abcde-f012-3456-789a-bcdef0123456', 'ADMINISTRATOR'),

-- クラウドソリューションズ
('12345678-9abc-def0-1234-56789abcde01', '89abcdef-0123-4567-89ab-cdef01234567', 'ADMINISTRATOR'),
('23456789-abcd-ef01-2345-6789abcde012', '9abcdef0-1234-5678-9abc-def012345678', 'ADMINISTRATOR'),

-- デジタルマーケティング
('3456789a-bcde-f012-3456-789abcde0123', 'abcdef01-2345-6789-abcd-ef0123456789', 'SCOUT_STAFF'),

-- 日本総合商事
('456789ab-cdef-0123-4567-89abcde01234', 'bcdef012-3456-789a-bcde-f01234567890', 'ADMINISTRATOR'),
('56789abc-def0-1234-5678-9abcde012345', 'cdef0123-4567-89ab-cdef-012345678901', 'SCOUT_STAFF'),

-- グローバルコンサルティング
('6789abcd-ef01-2345-6789-abcde0123456', 'def01234-5678-9abc-def0-123456789012', 'ADMINISTRATOR'),

-- 東京製造業
('789abcde-f012-3456-789a-bcde01234567', 'ef012345-6789-abcd-ef01-234567890123', 'SCOUT_STAFF');

-- ================================================
-- 5. 候補者データ
-- ================================================
INSERT INTO "candidates" (id, email, password_hash, last_name, first_name, phone_number, current_residence, current_salary, desired_salary, skills, experience_years, desired_industries, desired_job_types, desired_locations, scout_reception_enabled, status) VALUES
-- フロントエンドエンジニア
('89abcdef-0123-4567-89ab-cde012345678', 'frontend.dev@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '前田', '太郎', '090-1234-5678', '東京都世田谷区', '600万円', '750万円', '{"React", "TypeScript", "Next.js", "CSS", "JavaScript", "HTML", "Figma"}', 4, '{"IT・インターネット", "ゲーム・エンターテイメント"}', '{"フロントエンドエンジニア", "Webエンジニア"}', '{"東京都", "神奈川県"}', true, 'ACTIVE'),

-- バックエンドエンジニア
('9abcdef0-1234-5678-9abc-de0123456789', 'backend.engineer@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '後藤', '花子', '090-2345-6789', '東京都渋谷区', '700万円', '900万円', '{"Python", "Django", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Redis"}', 6, '{"IT・インターネット", "フィンテック"}', '{"バックエンドエンジニア", "サーバーサイドエンジニア"}', '{"東京都", "リモート"}', true, 'ACTIVE'),

-- フルスタックエンジニア
('abcdef01-2345-6789-abcd-e01234567890', 'fullstack.dev@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '中村', '次郎', '090-3456-7890', '大阪府大阪市', '650万円', '800万円', '{"JavaScript", "Node.js", "React", "MongoDB", "Express", "GraphQL", "TypeScript"}', 5, '{"IT・インターネット", "スタートアップ"}', '{"フルスタックエンジニア", "Webエンジニア"}', '{"大阪府", "京都府", "リモート"}', true, 'ACTIVE'),

-- DevOpsエンジニア
('bcdef012-3456-789a-bcde-012345678901', 'devops.engineer@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '田中', '美咲', '090-4567-8901', '神奈川県川崎市', '800万円', '1000万円', '{"AWS", "Terraform", "Kubernetes", "Docker", "Jenkins", "Prometheus", "Grafana", "Linux"}', 7, '{"IT・インターネット", "クラウド"}', '{"DevOpsエンジニア", "インフラエンジニア", "SRE"}', '{"東京都", "神奈川県", "リモート"}', true, 'ACTIVE'),

-- データサイエンティスト
('cdef0123-4567-89ab-cdef-123456789012', 'data.scientist@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '佐藤', '健太', '090-5678-9012', '東京都港区', '750万円', '950万円', '{"Python", "R", "SQL", "Machine Learning", "TensorFlow", "PyTorch", "Pandas", "Scikit-learn"}', 5, '{"IT・インターネット", "AI・機械学習", "フィンテック"}', '{"データサイエンティスト", "機械学習エンジニア"}', '{"東京都", "リモート"}', true, 'ACTIVE'),

-- モバイルエンジニア
('def01234-5678-9abc-def0-234567890123', 'mobile.dev@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '山田', '愛', '090-6789-0123', '東京都新宿区', '650万円', '800万円', '{"Swift", "Kotlin", "React Native", "Flutter", "iOS", "Android", "Firebase"}', 4, '{"IT・インターネット", "ゲーム・エンターテイメント", "モバイルアプリ"}', '{"iOSエンジニア", "Androidエンジニア", "モバイルエンジニア"}', '{"東京都", "神奈川県"}', true, 'ACTIVE'),

-- セキュリティエンジニア
('ef012345-6789-abcd-ef01-345678901234', 'security.engineer@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '鈴木', '大輔', '090-7890-1234', '東京都品川区', '800万円', '1100万円', '{"セキュリティ", "ペネトレーションテスト", "CISSP", "CEH", "AWS Security", "ネットワークセキュリティ"}', 8, '{"IT・インターネット", "セキュリティ", "金融"}', '{"セキュリティエンジニア", "セキュリティコンサルタント"}', '{"東京都", "リモート"}', true, 'ACTIVE'),

-- UI/UXデザイナー
('f0123456-789a-bcde-f012-456789012345', 'ux.designer@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '高橋', '理恵', '090-8901-2345', '東京都目黒区', '550万円', '700万円', '{"Figma", "Sketch", "Adobe XD", "Photoshop", "Illustrator", "ユーザビリティテスト", "プロトタイピング"}', 6, '{"IT・インターネット", "デザイン", "広告・PR"}', '{"UI/UXデザイナー", "プロダクトデザイナー", "Webデザイナー"}', '{"東京都", "神奈川県", "リモート"}', true, 'ACTIVE'),

-- プロダクトマネージャー
('01234567-89ab-cdef-0123-567890123456', 'product.manager@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '伊藤', '智子', '090-9012-3456', '東京都中央区', '900万円', '1200万円', '{"プロダクトマネジメント", "アジャイル", "Scrum", "データ分析", "A/Bテスト", "Jira", "Slack"}', 8, '{"IT・インターネット", "スタートアップ", "コンサルティング"}', '{"プロダクトマネージャー", "プロジェクトマネージャー"}', '{"東京都", "リモート"}', true, 'ACTIVE'),

-- 新卒エンジニア
('12345678-9abc-def0-1234-678901234567', 'fresh.graduate@example.com', '$2b$12$LQv3c1yqBwVHxkd0LHAkCOYz6TtxMQJqhN8/LewQELJAkFyGNj.JW', '新人', '太郎', '090-0123-4567', '東京都練馬区', '0万円', '400万円', '{"Java", "Python", "SQL", "Git", "Linux基礎"}', 0, '{"IT・インターネット", "製造業", "金融"}', '{"ソフトウェアエンジニア", "システムエンジニア"}', '{"東京都", "神奈川県", "埼玉県"}', true, 'ACTIVE');

-- ================================================
-- 6. 求人データ
-- ================================================
INSERT INTO "job_postings" (id, company_group_id, created_by, title, job_description, required_skills, preferred_skills, salary_min, salary_max, employment_type, work_location, remote_work_available, job_type, industry, status, application_deadline) VALUES
-- テックイノベーション - エンジニア
('23456789-abcd-ef01-2345-789012345678', '6789abcd-ef01-2345-6789-abcdef012345', 'f0123456-789a-bcde-f012-3456789abcde', 'シニアフロントエンドエンジニア', 'React/TypeScriptを使用したWebアプリケーション開発をお任せします。ユーザビリティを重視したUI/UX設計から実装まで幅広く担当していただきます。', '{"React", "TypeScript", "JavaScript", "HTML", "CSS"}', '{"Next.js", "GraphQL", "Jest", "Storybook"}', 7000000, 10000000, 'FULL_TIME', '東京都渋谷区（リモート可）', true, 'フロントエンドエンジニア', 'IT・インターネット', 'PUBLISHED', '2024-06-30 23:59:59+09'),

('3456789a-bcde-f012-3456-890123456789', '6789abcd-ef01-2345-6789-abcdef012345', 'f0123456-789a-bcde-f012-3456789abcde', 'バックエンドエンジニア（Python）', 'PythonとDjangoを使用したAPIサーバーの設計・開発・運用をお任せします。スケーラブルなアーキテクチャの構築経験がある方を歓迎します。', '{"Python", "Django", "PostgreSQL", "REST API"}', '{"AWS", "Docker", "Redis", "Celery"}', 6500000, 9500000, 'FULL_TIME', '東京都渋谷区（リモート可）', true, 'バックエンドエンジニア', 'IT・インターネット', 'PUBLISHED', '2024-07-15 23:59:59+09'),

-- テックイノベーション - データサイエンス
('456789ab-cdef-0123-4567-90123456789a', '789abcde-f012-3456-789a-bcdef0123456', '01234567-89ab-cdef-0123-456789abcde0', 'シニアデータサイエンティスト', '機械学習モデルの設計・開発・運用を通じて、ビジネス課題の解決に取り組んでいただきます。MLOpsの経験がある方を特に歓迎します。', '{"Python", "Machine Learning", "SQL", "統計学"}', '{"TensorFlow", "PyTorch", "MLflow", "Kubeflow", "AWS SageMaker"}', 8000000, 12000000, 'FULL_TIME', '東京都渋谷区（リモート可）', true, 'データサイエンティスト', 'IT・インターネット', 'PUBLISHED', '2024-08-31 23:59:59+09'),

-- クラウドソリューションズ - DevOps
('56789abc-def0-1234-5678-0123456789ab', '89abcdef-0123-4567-89ab-cdef01234567', '12345678-9abc-def0-1234-56789abcde01', 'SREエンジニア', 'クラウドインフラの設計・構築・運用を担当していただきます。Kubernetesを使用したコンテナオーケストレーションの経験を重視します。', '{"AWS", "Kubernetes", "Docker", "Terraform"}', '{"Prometheus", "Grafana", "ELK Stack", "Istio"}', 8500000, 12000000, 'FULL_TIME', '東京都港区（リモート可）', true, 'SRE', 'IT・インターネット', 'PUBLISHED', '2024-07-31 23:59:59+09'),

-- クラウドソリューションズ - セキュリティ
('6789abcd-ef01-2345-6789-123456789abc', '9abcdef0-1234-5678-9abc-def012345678', '23456789-abcd-ef01-2345-6789abcde012', 'セキュリティエンジニア', 'クラウドセキュリティの設計・実装・監査を担当していただきます。CISSP等の資格保有者を歓迎します。', '{"セキュリティ", "AWS Security", "ネットワークセキュリティ"}', '{"CISSP", "CEH", "ペネトレーションテスト", "SIEM"}', 9000000, 13000000, 'FULL_TIME', '東京都港区（リモート可）', true, 'セキュリティエンジニア', 'IT・インターネット', 'PUBLISHED', '2024-09-30 23:59:59+09'),

-- デジタルマーケティング
('789abcde-f012-3456-789a-23456789abcd', 'abcdef01-2345-6789-abcd-ef0123456789', '3456789a-bcde-f012-3456-789abcde0123', 'フルスタックエンジニア', 'Webアプリケーションのフロントエンドからバックエンドまで幅広く開発していただきます。少人数チームでの開発経験がある方を歓迎します。', '{"JavaScript", "Node.js", "React"}', '{"TypeScript", "MongoDB", "GraphQL", "AWS"}', 6000000, 8500000, 'FULL_TIME', '大阪府大阪市（リモート可）', true, 'フルスタックエンジニア', 'IT・インターネット', 'PUBLISHED', '2024-08-15 23:59:59+09'),

-- 日本総合商事 - 新卒
('89abcdef-0123-4567-89ab-3456789abcde', 'bcdef012-3456-789a-bcde-f01234567890', '456789ab-cdef-0123-4567-89abcde01234', '2025年新卒採用（総合職）', '総合商社での幅広い業務経験を通じて、グローバルビジネスのプロフェッショナルを目指していただきます。海外経験や語学力のある方を歓迎します。', '{"コミュニケーション能力", "論理的思考力"}', '{"英語", "海外経験", "リーダーシップ経験"}', 4500000, 6000000, 'FULL_TIME', '東京都千代田区', false, '総合職', '商社・貿易', 'PUBLISHED', '2024-10-31 23:59:59+09'),

-- 日本総合商事 - IT部門
('9abcdef0-1234-5678-9abc-456789abcdef', 'cdef0123-4567-89ab-cdef-012345678901', '56789abc-def0-1234-5678-9abcde012345', 'ITシステム企画・開発', '社内ITシステムの企画・設計・開発を担当していただきます。業務システムの開発経験がある方を歓迎します。', '{"Java", "SQL", "システム設計"}', '{"Spring Framework", "Oracle", "プロジェクトマネジメント"}', 6000000, 8500000, 'FULL_TIME', '東京都千代田区', false, 'システムエンジニア', '商社・貿易', 'PUBLISHED', '2024-09-15 23:59:59+09'),

-- グローバルコンサルティング
('abcdef01-2345-6789-abcd-56789abcdef0', 'def01234-5678-9abc-def0-123456789012', '6789abcd-ef01-2345-6789-abcde0123456', 'ITコンサルタント', 'クライアント企業のデジタルトランスフォーメーション支援を行っていただきます。システム導入やプロセス改善の経験がある方を歓迎します。', '{"コンサルティング", "プロジェクトマネジメント", "IT知識"}', '{"SAP", "Salesforce", "クラウド移行", "業務分析"}', 7500000, 11000000, 'FULL_TIME', '東京都新宿区', false, 'ITコンサルタント', 'コンサルティング', 'PUBLISHED', '2024-08-31 23:59:59+09'),

-- 東京製造業
('bcdef012-3456-789a-bcde-6789abcdef01', 'ef012345-6789-abcd-ef01-234567890123', '789abcde-f012-3456-789a-bcde01234567', '機械設計エンジニア', '自動車部品の機械設計・開発を担当していただきます。CADソフトの使用経験と製造業での設計経験がある方を歓迎します。', '{"機械設計", "CAD", "製造業経験"}', '{"SolidWorks", "AutoCAD", "品質管理", "ISO9001"}', 5500000, 7500000, 'FULL_TIME', '神奈川県横浜市', false, '機械設計エンジニア', '製造業', 'PUBLISHED', '2024-07-31 23:59:59+09');

-- ================================================
-- 7. メッセージデータ（スカウト・応募関連）
-- ================================================
INSERT INTO "messages" (id, sender_type, sender_candidate_id, sender_company_user_id, receiver_type, receiver_candidate_id, receiver_company_user_id, message_type, related_job_posting_id, company_group_id, subject, content, status) VALUES
-- スカウトメッセージ（企業→候補者）
('cdef0123-4567-89ab-cdef-789abcdef012', 'COMPANY_USER', NULL, 'f0123456-789a-bcde-f012-3456789abcde', 'CANDIDATE', '89abcdef-0123-4567-89ab-cde012345678', NULL, 'SCOUT', '23456789-abcd-ef01-2345-789012345678', '6789abcd-ef01-2345-6789-abcdef012345', 'シニアフロントエンドエンジニアポジションのご提案', '前田様\n\nテックイノベーション株式会社の採用担当です。\n\nあなたのReact/TypeScriptのスキルを拝見し、弊社のシニアフロントエンドエンジニアポジションにマッチすると感じご連絡いたします。\n\n詳細についてお話しできればと思います。ご興味がございましたらご返信ください。', 'SENT'),

('def01234-5678-9abc-def0-89abcdef0123', 'COMPANY_USER', NULL, '12345678-9abc-def0-1234-56789abcde01', 'CANDIDATE', 'bcdef012-3456-789a-bcde-012345678901', NULL, 'SCOUT', '56789abc-def0-1234-5678-0123456789ab', '89abcdef-0123-4567-89ab-cdef01234567', 'SREエンジニアポジションのご案内', '田中様\n\nクラウドソリューションズの採用担当です。\n\nあなたのDevOps/Kubernetesの経験を拝見し、弊社のSREエンジニアポジションに最適だと感じました。\n\n年収1000万円以上も可能なポジションです。一度お話しませんか？', 'READ'),

-- 応募メッセージ（候補者→企業）
('ef012345-6789-abcd-ef01-9abcdef01234', 'CANDIDATE', '9abcdef0-1234-5678-9abc-de0123456789', NULL, 'COMPANY_USER', NULL, 'f0123456-789a-bcde-f012-3456789abcde', 'APPLICATION', '3456789a-bcde-f012-3456-890123456789', '6789abcd-ef01-2345-6789-abcdef012345', 'バックエンドエンジニアポジションへの応募', 'テックイノベーション株式会社 採用ご担当者様\n\n後藤花子と申します。\n\nバックエンドエンジニアポジションに応募させていただきます。\n\nPython/Djangoでの開発経験6年、AWS環境での運用経験もございます。\n\n何卒よろしくお願いいたします。', 'SENT'),

-- 返信メッセージ
('f0123456-789a-bcde-f012-abcdef012345', 'CANDIDATE', '89abcdef-0123-4567-89ab-cde012345678', NULL, 'COMPANY_USER', NULL, 'f0123456-789a-bcde-f012-3456789abcde', 'SCOUT', '23456789-abcd-ef01-2345-789012345678', '6789abcd-ef01-2345-6789-abcdef012345', 'Re: シニアフロントエンドエンジニアポジションのご提案', 'ご連絡ありがとうございます。\n\n大変興味深いポジションですね。ぜひ詳細をお聞かせください。\n\n来週でしたらお時間をいただけますでしょうか？', 'SENT');

-- ================================================
-- 8. 応募データ
-- ================================================
INSERT INTO "applications" (id, candidate_id, job_posting_id, company_group_id, application_message, resume_file_path, status) VALUES
-- 実際の応募
('01234567-89ab-cdef-0123-bcdef0123456', '9abcdef0-1234-5678-9abc-de0123456789', '3456789a-bcde-f012-3456-890123456789', '6789abcd-ef01-2345-6789-abcdef012345', 'Python/Djangoでの豊富な開発経験を活かして貢献したいと思います。', '/resumes/candidate_backend_resume.pdf', 'APPLIED'),

('12345678-9abc-def0-1234-cdef01234567', 'abcdef01-2345-6789-abcd-e01234567890', '789abcde-f012-3456-789a-23456789abcd', 'abcdef01-2345-6789-abcd-ef0123456789', 'フルスタック開発の経験を活かし、少人数チームでの開発に貢献したいです。', '/resumes/candidate_fullstack_resume.pdf', 'SCREENING'),

('23456789-abcd-ef01-2345-def012345678', 'cdef0123-4567-89ab-cdef-123456789012', '456789ab-cdef-0123-4567-90123456789a', '789abcde-f012-3456-789a-bcdef0123456', '機械学習の実務経験5年、MLOpsの構築経験もございます。', '/resumes/candidate_datascience_resume.pdf', 'INTERVIEW'),

('3456789a-bcde-f012-3456-ef0123456789', 'bcdef012-3456-789a-bcde-012345678901', '56789abc-def0-1234-5678-0123456789ab', '89abcdef-0123-4567-89ab-cdef01234567', 'Kubernetesを使用した大規模システムの運用経験があります。', '/resumes/candidate_devops_resume.pdf', 'OFFER'),

('456789ab-cdef-0123-4567-f01234567890', 'ef012345-6789-abcd-ef01-345678901234', '6789abcd-ef01-2345-6789-123456789abc', '9abcdef0-1234-5678-9abc-def012345678', 'セキュリティエンジニアとして8年の経験、CISSP資格保有しています。', '/resumes/candidate_security_resume.pdf', 'HIRED'),

('56789abc-def0-1234-5678-012345678901', '12345678-9abc-def0-1234-678901234567', '89abcdef-0123-4567-89ab-3456789abcde', 'bcdef012-3456-789a-bcde-f01234567890', '新卒として総合商社で成長していきたいと考えています。', '/resumes/candidate_graduate_resume.pdf', 'APPLIED');

-- ================================================
-- 完了メッセージ
-- ================================================
SELECT 'Sample data inserted successfully! Ready for testing.' as status; 