'use server'

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export interface CompanyDetailData {
  id: string;
  companyName: string;
  companyLogo?: string;
  images: string[];
  title: string;
  description: string;
  jobDescription: string;
  positionSummary: string;
  skills: string;
  otherRequirements: string;
  jobTypes: string[];
  industries: string[];
  salaryMin?: number;
  salaryMax?: number;
  salaryNote: string;
  locations: string[];
  locationNote: string;
  employmentType: string;
  employmentTypeNote: string;
  workingHours: string;
  overtime: string;
  overtimeMemo?: string;
  holidays: string;
  selectionProcess: string;
  appealPoints: {
    business: string[];
    company: string[];
    team: string[];
    workstyle: string[];
  };
  smoke: string;
  resumeRequired: string[];
  representative: string;
  establishedYear: string;
  capital: string;
  employeeCount: string;
  industry: string;
  businessContent: string;
  address: string;
  companyPhase: string;
  website: string;
}

export interface JobPostingData {
  id: string;
  title: string;
  employment_type: string;
  work_location: string[];
  salary_min?: number;
  salary_max?: number;
  image_urls?: string[];
  job_type?: string | string[];
  required_documents?: string[];
}

// デフォルトデータを返す関数
function getDefaultCompanyData(company_id: string): CompanyDetailData {
  return {
    id: company_id,
    companyName: '企業名テキスト',
    companyLogo: '/company.jpg',
    images: ['/company.jpg', '/company.jpg', '/company.jpg'],
    title: '企業名テキスト',
    description: 'アピールポイントタイトルテキストが入ります。企業の魅力や特色について詳しく説明しています。革新的な技術と働きやすい環境を提供し、社員一人ひとりの成長を大切にしています。',
    jobDescription: 'アピールポイントタイトルテキストが入ります。この企業では最新の技術を活用した業務に取り組むことができ、チームワークを重視した環境で成長していくことができます。フレキシブルな働き方も支援しており、ワークライフバランスの実現も可能です。',
    positionSummary: 'アピールポイントタイトルテキストが入ります。当社では社員のスキルアップとキャリア形成を全面的にサポートしています。研修制度も充実しており、専門知識を深めながら幅広い業務経験を積むことができます。チャレンジ精神を持った方を歓迎します。',
    skills: '必要なスキル・経験について説明します',
    otherRequirements: 'その他の要件について説明します',
    jobTypes: ['ITエンジニア', 'システム開発'],
    industries: ['IT・通信', 'ソフトウェア'],
    salaryMin: 400,
    salaryMax: 800,
    salaryNote: '経験・スキルに応じて決定いたします',
    locations: ['東京都', '大阪府'],
    locationNote: 'リモートワーク可能',
    employmentType: 'FULL_TIME',
    employmentTypeNote: '正社員での雇用です',
    workingHours: '9:00～18:00（実働8時間）',
    overtime: 'あり',
    overtimeMemo: '月平均20時間程度',
    holidays: '完全週休2日制（土日祝）、年末年始、夏季休暇',
    selectionProcess: '書類選考→一次面接→最終面接',
    appealPoints: {
      business: ['最新技術への取り組み', '大手企業との取引実績'],
      company: ['成長中のベンチャー企業', '風通しの良い企業文化'],
      team: ['チームワーク重視', '年齢に関係なく活躍できる'],
      workstyle: ['リモートワーク可能', 'フレックスタイム制'],
    },
    smoke: '全面禁煙',
    resumeRequired: ['履歴書', '職務経歴書'],
    representative: '田中 太郎',
    establishedYear: '2015',
    capital: '1000',
    employeeCount: '50',
    industry: 'IT・通信、ソフトウェア',
    businessContent: 'Webアプリケーション開発、システム開発、IT コンサルティング事業を展開しています。最新の技術を活用したソリューションの提供を通じて、お客様のビジネス成長をサポートしています。',
    address: '東京都渋谷区渋谷1-1-1 渋谷ビル10F',
    companyPhase: '成長期',
    website: 'https://example-company.com',
  };
}

export async function getCompanyDetailData(company_id: string): Promise<CompanyDetailData | null> {
  try {
    const supabase = getSupabaseAdminClient();

    // 企業情報を取得
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .select(`
        id,
        company_name,
        representative_name,
        industry,
        company_overview,
        headquarters_address,
        status
      `)
      .eq('id', company_id)
      .maybeSingle();

    if (companyError) {
      console.error('Failed to fetch company:', companyError);
      // エラーの場合はデフォルトデータを返す
      return getDefaultCompanyData(company_id);
    }

    if (!company) {
      console.warn(`Company not found for id ${company_id}`);
      // 企業が見つからない場合もデフォルトデータを返す
      return getDefaultCompanyData(company_id);
    }

    // 企業が存在する場合、実際のデータを使用しつつ、不足フィールドはデフォルト値で補完
    const companyData: CompanyDetailData = {
      id: company.id,
      companyName: company.company_name || '企業名テキスト',
      companyLogo: '/company.jpg', // TODO: 実際のロゴURLを保存できるようにテーブル拡張が必要
      images: ['/company.jpg', '/company.jpg', '/company.jpg'], // TODO: 実際の画像URLを保存できるようにテーブル拡張が必要
      title: company.company_name || '企業名テキスト',
      description: company.company_overview || 'アピールポイントタイトルテキストが入ります。企業の魅力や特色について詳しく説明しています。',
      jobDescription: company.company_overview || 'アピールポイントタイトルテキストが入ります。この企業では最新の技術を活用した業務に取り組むことができます。',
      positionSummary: 'アピールポイントタイトルテキストが入ります。当社では社員のスキルアップとキャリア形成を全面的にサポートしています。',
      skills: '必要なスキル・経験について説明します',
      otherRequirements: 'その他の要件について説明します',
      jobTypes: ['ITエンジニア', 'システム開発'],
      industries: company.industry ? [company.industry] : ['IT・通信', 'ソフトウェア'],
      salaryMin: 400,
      salaryMax: 800,
      salaryNote: '経験・スキルに応じて決定いたします',
      locations: ['東京都', '大阪府'],
      locationNote: 'リモートワーク可能',
      employmentType: 'FULL_TIME',
      employmentTypeNote: '正社員での雇用です',
      workingHours: '9:00～18:00（実働8時間）',
      overtime: 'あり',
      overtimeMemo: '月平均20時間程度',
      holidays: '完全週休2日制（土日祝）、年末年始、夏季休暇',
      selectionProcess: '書類選考→一次面接→最終面接',
      appealPoints: {
        business: ['最新技術への取り組み', '大手企業との取引実績'],
        company: ['成長中のベンチャー企業', '風通しの良い企業文化'],
        team: ['チームワーク重視', '年齢に関係なく活躍できる'],
        workstyle: ['リモートワーク可能', 'フレックスタイム制'],
      },
      smoke: '全面禁煙',
      resumeRequired: ['履歴書', '職務経歴書'],
      representative: company.representative_name || '田中 太郎',
      establishedYear: '2015', // TODO: 実際の設立年を保存できるようにテーブル拡張が必要
      capital: '1000', // TODO: 実際の資本金を保存できるようにテーブル拡張が必要
      employeeCount: '50', // TODO: 実際の従業員数を保存できるようにテーブル拡張が必要
      industry: company.industry || 'IT・通信、ソフトウェア',
      businessContent: company.company_overview || 'Webアプリケーション開発、システム開発、IT コンサルティング事業を展開しています。',
      address: company.headquarters_address || '東京都渋谷区渋谷1-1-1 渋谷ビル10F',
      companyPhase: '成長期', // TODO: 実際の企業フェーズを保存できるようにテーブル拡張が必要
      website: 'https://example-company.com', // TODO: 実際のウェブサイトURLを保存できるようにテーブル拡張が必要
    };

    return companyData;
  } catch (error) {
    console.error('Error fetching company data:', error);
    // エラーの場合はデフォルトデータを返す
    return getDefaultCompanyData(company_id);
  }
}

// 企業が投稿した求人情報を取得する関数
export async function getCompanyJobPostings(company_id: string): Promise<JobPostingData[]> {
  try {
    const supabase = getSupabaseAdminClient();

    // 企業の求人情報を取得
    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select(`
        id,
        title,
        employment_type,
        work_location,
        salary_min,
        salary_max,
        image_urls,
        job_type,
        required_documents,
        status
      `)
      .eq('company_account_id', company_id)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members'])
      .order('created_at', { ascending: false })
      .limit(10); // パフォーマンスのため最大10件に制限

    if (error) {
      console.error('Failed to fetch job postings:', error);
      return [];
    }

    if (!jobs || jobs.length === 0) {
      console.log(`No job postings found for company ${company_id}`);
      return [];
    }

    // 取得した求人データを整形
    return jobs.map(job => ({
      id: job.id,
      title: job.title || '求人タイトル未設定',
      employment_type: job.employment_type || 'FULL_TIME',
      work_location: Array.isArray(job.work_location) ? job.work_location : [job.work_location || '勤務地未設定'],
      salary_min: job.salary_min,
      salary_max: job.salary_max,
      image_urls: job.image_urls || [],
      job_type: job.job_type,
      required_documents: job.required_documents || [],
    }));
  } catch (error) {
    console.error('Error fetching company job postings:', error);
    return [];
  }
}