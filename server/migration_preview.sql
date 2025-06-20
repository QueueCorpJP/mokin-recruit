-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "CompanyStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'DELETED');

-- CreateEnum
CREATE TYPE "PermissionLevel" AS ENUM ('SCOUT_STAFF', 'ADMINISTRATOR');

-- CreateEnum
CREATE TYPE "VisibilityScope" AS ENUM ('PUBLIC', 'MEMBERS_ONLY', 'SCOUT_ONLY', 'PRIVATE', 'DRAFT');

-- CreateEnum
CREATE TYPE "PublicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PUBLISHED', 'ENDED');

-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('CANDIDATE', 'COMPANY_USER');

-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('SCOUT', 'APPLICATION', 'GENERAL_MESSAGE');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('UNREAD', 'READ', 'NG_WORD_CHECK', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TicketType" AS ENUM ('MONTHLY', 'SPOT', 'ADDITIONAL');

-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TemplateType" AS ENUM ('SCOUT', 'MESSAGE');

-- CreateEnum
CREATE TYPE "SelectionStatus" AS ENUM ('DOCUMENT_REVIEW', 'FIRST_INTERVIEW', 'SECOND_INTERVIEW', 'FINAL_INTERVIEW', 'OFFER', 'HIRED', 'REJECTED', 'DECLINED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "candidates" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name_kana" TEXT NOT NULL,
    "first_name_kana" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "current_residence" TEXT NOT NULL,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "phone_number" TEXT NOT NULL,
    "current_salary" TEXT NOT NULL,
    "has_job_change_experience" BOOLEAN NOT NULL,
    "desired_change_timing" TEXT NOT NULL,
    "job_search_status" TEXT NOT NULL,
    "recent_company_name" TEXT,
    "recent_department_name" TEXT,
    "recent_position_name" TEXT,
    "employment_start_date" TIMESTAMP(3),
    "employment_end_date" TIMESTAMP(3),
    "recent_industry" TEXT,
    "recent_job_type" TEXT,
    "job_description" TEXT,
    "final_education" TEXT NOT NULL,
    "english_level" TEXT NOT NULL,
    "other_language" TEXT,
    "other_language_level" TEXT,
    "skills" TEXT[],
    "certifications" TEXT,
    "desired_salary" TEXT NOT NULL,
    "desired_industries" TEXT[],
    "desired_job_types" TEXT[],
    "desired_locations" TEXT[],
    "interested_work_styles" TEXT[],
    "career_summary" TEXT,
    "self_pr" TEXT,
    "resume_file_path" TEXT,
    "career_history_file_path" TEXT,
    "scout_reception_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_notification_settings" JSONB NOT NULL,
    "blocked_company_ids" TEXT[],
    "favorite_job_ids" TEXT[],
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "deletion_reason" TEXT,

    CONSTRAINT "candidates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_application_statuses" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "department_name" TEXT NOT NULL,
    "position_name" TEXT,
    "selection_status" TEXT NOT NULL,
    "disclosure_consent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "candidate_application_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_industry_experiences" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,

    CONSTRAINT "candidate_industry_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "candidate_job_type_experiences" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "experience_years" INTEGER NOT NULL,

    CONSTRAINT "candidate_job_type_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_accounts" (
    "id" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "headquarters_address" TEXT NOT NULL,
    "representative_name" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "company_overview" TEXT,
    "appeal_points" TEXT,
    "logo_image_path" TEXT,
    "contract_plan" JSONB NOT NULL,
    "status" "CompanyStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_groups" (
    "id" TEXT NOT NULL,
    "company_account_id" TEXT NOT NULL,
    "group_name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_users" (
    "id" TEXT NOT NULL,
    "company_account_id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "position_title" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "email_notification_settings" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "company_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_user_group_permissions" (
    "id" TEXT NOT NULL,
    "company_user_id" TEXT NOT NULL,
    "company_group_id" TEXT NOT NULL,
    "permission_level" "PermissionLevel" NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_user_group_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_postings" (
    "id" TEXT NOT NULL,
    "company_group_id" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "job_description" TEXT NOT NULL,
    "required_qualifications" TEXT NOT NULL,
    "preferred_qualifications" TEXT,
    "salary_min" INTEGER NOT NULL,
    "salary_max" INTEGER NOT NULL,
    "salary_negotiable" BOOLEAN NOT NULL DEFAULT false,
    "work_location_prefecture" TEXT NOT NULL,
    "work_location_detail" TEXT,
    "job_type" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "remote_work_available" BOOLEAN NOT NULL DEFAULT false,
    "smoking_policy" TEXT NOT NULL,
    "appeal_points" TEXT,
    "internal_memo" TEXT,
    "visibility_scope" "VisibilityScope" NOT NULL,
    "publication_status" "PublicationStatus" NOT NULL,
    "resume_required" BOOLEAN NOT NULL DEFAULT false,
    "career_history_required" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "publication_start_at" TIMESTAMP(3),
    "publication_end_at" TIMESTAMP(3),
    "approved_by_admin_id" TEXT,
    "approved_at" TIMESTAMP(3),
    "rejection_reason" TEXT,

    CONSTRAINT "job_postings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" TEXT NOT NULL,
    "sender_user_id" TEXT NOT NULL,
    "sender_user_type" "UserType" NOT NULL,
    "recipient_user_id" TEXT NOT NULL,
    "recipient_user_type" "UserType" NOT NULL,
    "related_job_posting_id" TEXT NOT NULL,
    "company_group_id" TEXT,
    "message_type" "MessageType" NOT NULL,
    "subject" TEXT,
    "content" TEXT NOT NULL,
    "attachment_file_paths" TEXT[],
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "opened_at" TIMESTAMP(3),
    "status" "MessageStatus" NOT NULL DEFAULT 'UNREAD',
    "ng_word_check_result" JSONB,
    "decline_reason" TEXT,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scout_tickets" (
    "id" TEXT NOT NULL,
    "company_group_id" TEXT NOT NULL,
    "granted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "consumed_at" TIMESTAMP(3),
    "consumed_scout_message_id" TEXT,
    "ticket_type" "TicketType" NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "scout_tickets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "templates" (
    "id" TEXT NOT NULL,
    "company_group_id" TEXT,
    "template_type" "TemplateType" NOT NULL,
    "template_name" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "target_job_posting_id" TEXT,
    "created_by_user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_progresses" (
    "id" TEXT NOT NULL,
    "candidate_id" TEXT NOT NULL,
    "job_posting_id" TEXT NOT NULL,
    "company_group_id" TEXT NOT NULL,
    "applied_at" TIMESTAMP(3),
    "scout_sent_at" TIMESTAMP(3),
    "current_selection_status" "SelectionStatus" NOT NULL,
    "offer_date" TIMESTAMP(3),
    "expected_start_date" TIMESTAMP(3),
    "internal_memo" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_user_id" TEXT,

    CONSTRAINT "application_progresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "selection_status_histories" (
    "id" TEXT NOT NULL,
    "progress_id" TEXT NOT NULL,
    "previous_status" "SelectionStatus",
    "new_status" "SelectionStatus" NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_by_user_id" TEXT NOT NULL,
    "update_memo" TEXT,

    CONSTRAINT "selection_status_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interview_schedules" (
    "id" TEXT NOT NULL,
    "progress_id" TEXT NOT NULL,
    "interview_datetime" TIMESTAMP(3) NOT NULL,
    "interview_type" TEXT NOT NULL,
    "interview_format" TEXT NOT NULL,
    "interview_location" TEXT,
    "interviewer_names" TEXT,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "last_login_at" TIMESTAMP(3),

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ng_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "match_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ng_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "summary" TEXT,
    "category_id" TEXT NOT NULL,
    "tags" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "display_order" INTEGER NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "target_users" TEXT NOT NULL,
    "is_forced" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "candidates_email_key" ON "candidates"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_users_email_key" ON "company_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "company_user_group_permissions_company_user_id_company_grou_key" ON "company_user_group_permissions"("company_user_id", "company_group_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_progresses_candidate_id_job_posting_id_key" ON "application_progresses"("candidate_id", "job_posting_id");

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- AddForeignKey
ALTER TABLE "candidate_application_statuses" ADD CONSTRAINT "candidate_application_statuses_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_industry_experiences" ADD CONSTRAINT "candidate_industry_experiences_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "candidate_job_type_experiences" ADD CONSTRAINT "candidate_job_type_experiences_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_groups" ADD CONSTRAINT "company_groups_company_account_id_fkey" FOREIGN KEY ("company_account_id") REFERENCES "company_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_users" ADD CONSTRAINT "company_users_company_account_id_fkey" FOREIGN KEY ("company_account_id") REFERENCES "company_accounts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_user_group_permissions" ADD CONSTRAINT "company_user_group_permissions_company_user_id_fkey" FOREIGN KEY ("company_user_id") REFERENCES "company_users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_user_group_permissions" ADD CONSTRAINT "company_user_group_permissions_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "company_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_postings" ADD CONSTRAINT "job_postings_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "company_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "message_candidate_sender_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "message_candidate_recipient_fkey" FOREIGN KEY ("recipient_user_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "message_company_user_sender_fkey" FOREIGN KEY ("sender_user_id") REFERENCES "company_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_related_job_posting_id_fkey" FOREIGN KEY ("related_job_posting_id") REFERENCES "job_postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "company_groups"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scout_tickets" ADD CONSTRAINT "scout_tickets_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "company_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "company_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_target_job_posting_id_fkey" FOREIGN KEY ("target_job_posting_id") REFERENCES "job_postings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "templates" ADD CONSTRAINT "templates_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "company_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_progresses" ADD CONSTRAINT "application_progresses_candidate_id_fkey" FOREIGN KEY ("candidate_id") REFERENCES "candidates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_progresses" ADD CONSTRAINT "application_progresses_job_posting_id_fkey" FOREIGN KEY ("job_posting_id") REFERENCES "job_postings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_progresses" ADD CONSTRAINT "application_progresses_company_group_id_fkey" FOREIGN KEY ("company_group_id") REFERENCES "company_groups"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_progresses" ADD CONSTRAINT "application_progresses_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "company_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selection_status_histories" ADD CONSTRAINT "selection_status_histories_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "application_progresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "selection_status_histories" ADD CONSTRAINT "selection_status_histories_updated_by_user_id_fkey" FOREIGN KEY ("updated_by_user_id") REFERENCES "company_users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_schedules" ADD CONSTRAINT "interview_schedules_progress_id_fkey" FOREIGN KEY ("progress_id") REFERENCES "application_progresses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_articles" ADD CONSTRAINT "media_articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "media_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media_categories" ADD CONSTRAINT "media_categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "media_categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

