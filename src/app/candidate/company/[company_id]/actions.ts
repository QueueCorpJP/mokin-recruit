'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import type { CompanyDetailData, JobPostingData } from '@/types';

// Re-export types for components
export type { CompanyDetailData } from '@/types';

// デフォルトデータを返す関数
function getDefaultCompanyData(company_id: string): CompanyDetailData {
  return {
    id: company_id,
    companyName: '企業名テキスト',
    companyLogo: '/company.jpg',
    images: ['/company.jpg', '/company.jpg', '/company.jpg'],
    title: '企業名テキスト',
    description:
      'アピールポイントタイトルテキストが入ります。企業の魅力や特色について詳しく説明しています。革新的な技術と働きやすい環境を提供し、社員一人ひとりの成長を大切にしています。',
    jobDescription:
      'アピールポイントタイトルテキストが入ります。この企業では最新の技術を活用した業務に取り組むことができ、チームワークを重視した環境で成長していくことができます。フレキシブルな働き方も支援しており、ワークライフバランスの実現も可能です。',
    positionSummary:
      'アピールポイントタイトルテキストが入ります。当社では社員のスキルアップとキャリア形成を全面的にサポートしています。研修制度も充実しており、専門知識を深めながら幅広い業務経験を積むことができます。チャレンジ精神を持った方を歓迎します。',
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
    businessContent:
      'Webアプリケーション開発、システム開発、IT コンサルティング事業を展開しています。最新の技術を活用したソリューションの提供を通じて、お客様のビジネス成長をサポートしています。',
    address: '東京都渋谷区渋谷1-1-1 渋谷ビル10F',
    companyPhase: '成長期',
    website: 'https://example-company.com',
  };
}

export async function getCompanyDetailData(
  company_id: string
): Promise<CompanyDetailData | null> {
  try {
    const supabase = await getSupabaseServerClient();

    // 企業情報を取得
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .select(
        `
        id,
        company_name,
        industry,
        headquarters_address,
        representative_name,
        representative_position,
        company_overview,
        status,
        company_urls,
        icon_image_url,
        established_year,
        capital_amount,
        capital_unit,
        employees_count,
        industries,
        business_content,
        prefecture,
        address,
        company_phase,
        company_images,
        company_attractions
      `
      )
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

    // 企業が存在する場合、実際のデータを使用
    const companyData: CompanyDetailData = {
      id: company.id,
      companyName: company.company_name || '企業名テキスト',
      companyLogo: company.icon_image_url || '/company.jpg',
      images:
        company.company_images && company.company_images.length > 0
          ? company.company_images
          : ['/company.jpg', '/company.jpg', '/company.jpg'],
      title: company.company_name || '企業名テキスト',
      description:
        company.company_overview ||
        'アピールポイントタイトルテキストが入ります。企業の魅力や特色について詳しく説明しています。',
      jobDescription:
        company.business_content ||
        company.company_overview ||
        'この企業では最新の技術を活用した業務に取り組むことができます。',
      positionSummary:
        company.company_overview ||
        'アピールポイントタイトルテキストが入ります。当社では社員のスキルアップとキャリア形成を全面的にサポートしています。',
      skills: '必要なスキル・経験について説明します',
      otherRequirements: 'その他の要件について説明します',
      jobTypes: ['ITエンジニア', 'システム開発'],
      industries:
        company.industries &&
        Array.isArray(company.industries) &&
        company.industries.length > 0
          ? company.industries
          : company.industry
            ? [company.industry]
            : ['IT・通信', 'ソフトウェア'],
      salaryMin: 400,
      salaryMax: 800,
      salaryNote: '経験・スキルに応じて決定いたします',
      locations: company.prefecture ? [company.prefecture] : ['東京都'],
      locationNote: 'リモートワーク可能',
      employmentType: 'FULL_TIME',
      employmentTypeNote: '正社員での雇用です',
      workingHours: '9:00～18:00（実働8時間）',
      overtime: 'あり',
      overtimeMemo: '月平均20時間程度',
      holidays: '完全週休2日制（土日祝）、年末年始、夏季休暇',
      selectionProcess: '書類選考→一次面接→最終面接',
      appealPoints: {
        business:
          company.company_attractions &&
          Array.isArray(company.company_attractions) &&
          company.company_attractions.length > 0
            ? company.company_attractions.slice(0, 2)
            : ['最新技術への取り組み', '大手企業との取引実績'],
        company: ['成長中のベンチャー企業', '風通しの良い企業文化'],
        team: ['チームワーク重視', '年齢に関係なく活躍できる'],
        workstyle: ['リモートワーク可能', 'フレックスタイム制'],
      },
      smoke: '全面禁煙',
      resumeRequired: ['履歴書', '職務経歴書'],
      representative:
        company.representative_name && company.representative_position
          ? `${company.representative_name}（${company.representative_position}）`
          : company.representative_name || '代表者名未設定',
      establishedYear: company.established_year
        ? company.established_year.toString()
        : '設立年未設定',
      capital:
        company.capital_amount && company.capital_unit
          ? `${company.capital_amount}${company.capital_unit}`
          : '資本金未設定',
      employeeCount: company.employees_count
        ? company.employees_count.toString()
        : '従業員数未設定',
      industry: company.industry || 'IT・通信、ソフトウェア',
      businessContent:
        company.business_content ||
        company.company_overview ||
        'Webアプリケーション開発、システム開発、ITコンサルティング事業を展開しています。',
      address:
        company.address || company.headquarters_address || '本社所在地未設定',
      companyPhase: company.company_phase || '成長期',
      website:
        company.company_urls &&
        Array.isArray(company.company_urls) &&
        company.company_urls.length > 0
          ? company.company_urls[0]
          : 'https://example-company.com',
    };

    return companyData;
  } catch (error) {
    console.error('Error fetching company data:', error);
    // エラーの場合はデフォルトデータを返す
    return getDefaultCompanyData(company_id);
  }
}

// 企業が投稿した求人情報を取得する関数
export async function getCompanyJobPostings(
  company_id: string
): Promise<JobPostingData[]> {
  try {
    const supabase = await getSupabaseServerClient();

    // 企業の求人情報を取得
    const { data: jobs, error } = await supabase
      .from('job_postings')
      .select(
        `
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
      `
      )
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
      work_location: Array.isArray(job.work_location)
        ? job.work_location
        : [job.work_location || '勤務地未設定'],
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
