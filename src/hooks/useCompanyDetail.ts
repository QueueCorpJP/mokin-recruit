'use client';

import { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { CompanyDetailData } from '@/app/candidate/company/[company_id]/actions';

interface CompanyDataState {
  data: CompanyDetailData | null;
  loading: boolean;
  error: string | null;
}

export function useCompanyDetail(companyId: string): CompanyDataState {
  const [state, setState] = useState<CompanyDataState>({
    data: null,
    loading: true,
    error: null,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!companyId) {
        setState({
          data: null,
          loading: false,
          error: 'Company ID is required',
        });
        return;
      }

      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
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
          .eq('id', companyId)
          .maybeSingle();

        if (companyError) {
          if (process.env.NODE_ENV === 'development') console.error('Failed to fetch company:', companyError);
          setState({
            data: null,
            loading: false,
            error: 'Failed to fetch company data',
          });
          return;
        }

        if (!company) {
          if (process.env.NODE_ENV === 'development') console.warn(`Company not found for id: ${companyId}`);
          setState({
            data: null,
            loading: false,
            error: 'Company not found',
          });
          return;
        }


        // 企業データを CompanyDetailData 形式にマッピング
        const companyData: CompanyDetailData = {
          id: company.id,
          companyName: company.company_name || '企業名テキスト',
          companyLogo: '/company.jpg',
          images: ['/company.jpg', '/company.jpg', '/company.jpg'],
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
          representative: company.representative_name || '代表者名未設定',
          establishedYear: '2015',
          capital: '1000',
          employeeCount: '50',
          industry: company.industry || 'IT・通信、ソフトウェア',
          businessContent: company.company_overview || 'Webアプリケーション開発、システム開発、IT コンサルティング事業を展開しています。',
          address: company.headquarters_address || '本社所在地未設定',
          companyPhase: '成長期',
          website: 'https://example-company.com',
        };

        setState({
          data: companyData,
          loading: false,
          error: null,
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') console.error('Error fetching company data:', error);
        setState({
          data: null,
          loading: false,
          error: 'An error occurred while fetching company data',
        });
      }
    };

    fetchCompanyData();
  }, [companyId, supabase]);

  return state;
}