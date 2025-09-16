import React from 'react';
import CompanyEditClient from '../[id]/edit/CompanyEditClient';
import type { CompanyEditData } from '../[id]/edit/page';

// デバッグ用のダミー企業データ
const dummyCompany: CompanyEditData = {
  id: 'debug-company-id-12345',
  company_name: 'デバッグ企業株式会社',
  headquarters_address: '東京都渋谷区渋谷1-1-1',
  representative_name: '山田太郎',
  industry: 'IT・インターネット',
  company_overview:
    'デバッグ用の企業概要です。革新的なソリューションを提供する企業として、お客様のニーズに合わせたサービスを展開しています。',
  appeal_points: '働きやすい環境\n成長できる機会\n充実した福利厚生',
  logo_image_path: null,
  plan: 'スタンダードプラン',
  contract_plan: {
    plan_name: 'スタンダードプラン',
    max_job_postings: 10,
    features: ['求人投稿', 'メッセージ機能', '分析機能'],
  },
  status: 'ACTIVE',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-15T12:00:00Z',
  company_users: [
    {
      id: 'user-1',
      full_name: '佐藤花子',
      position_title: '人事部長',
      email: 'sato@debug-company.com',
      last_login_at: '2024-01-15T09:30:00Z',
    },
    {
      id: 'user-2',
      full_name: '田中次郎',
      position_title: '採用担当',
      email: 'tanaka@debug-company.com',
      last_login_at: '2024-01-14T16:45:00Z',
    },
  ],
  company_groups: [
    {
      id: 'group-1',
      group_name: 'テクノロジー部門',
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'group-2',
      group_name: '営業部門',
      created_at: '2024-01-01T00:00:00Z',
    },
  ],
};

export default function CompanyEditDebugPage() {
  return <CompanyEditClient company={dummyCompany} />;
}
