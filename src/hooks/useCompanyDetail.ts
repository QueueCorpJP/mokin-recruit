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
          .select(
            `
            id,
            company_name,
            representative_name,
            representative_position,
            industry,
            industries,
            company_overview,
            business_content,
            headquarters_address,
            address,
            prefecture,
            established_year,
            capital_amount,
            capital_unit,
            employees_count,
            company_phase,
            company_urls,
            icon_image_url,
            company_images,
            status
          `
          )
          .eq('id', companyId)
          .maybeSingle();

        if (companyError) {
          console.error('Failed to fetch company:', companyError);
          setState({
            data: null,
            loading: false,
            error: 'Failed to fetch company data',
          });
          return;
        }

        if (!company) {
          console.warn(`Company not found for id: ${companyId}`);
          setState({
            data: null,
            loading: false,
            error: 'Company not found',
          });
          return;
        }

        // database.mdのschemaに基づいて企業データをマッピング
        const getIndustryDisplay = () => {
          // industries (jsonb) を優先し、fallbackとして industry (text) を使用
          if (
            company.industries &&
            Array.isArray(company.industries) &&
            company.industries.length > 0
          ) {
            return company.industries.join('、');
          }
          if (
            company.industry &&
            typeof company.industry === 'string' &&
            company.industry.trim()
          ) {
            return company.industry;
          }
          return '業種未設定';
        };

        const getBusinessContent = () => {
          // business_content を優先し、fallback として company_overview を使用
          if (company.business_content && company.business_content.trim()) {
            return company.business_content;
          }
          if (company.company_overview && company.company_overview.trim()) {
            return company.company_overview;
          }
          return '事業内容未設定';
        };

        const getAddress = () => {
          // address を優先し、fallback として headquarters_address、prefecture を使用
          if (company.address && company.address.trim()) {
            return company.address;
          }
          if (
            company.headquarters_address &&
            company.headquarters_address.trim()
          ) {
            return company.headquarters_address;
          }
          if (company.prefecture && company.prefecture.trim()) {
            return company.prefecture;
          }
          return '所在地未設定';
        };

        const getCapital = () => {
          if (company.capital_amount && company.capital_amount > 0) {
            const unit = company.capital_unit || '万円';
            return `${company.capital_amount}${unit}`;
          }
          return '未設定';
        };

        const getWebsiteUrls = () => {
          if (
            company.company_urls &&
            Array.isArray(company.company_urls) &&
            company.company_urls.length > 0
          ) {
            const validUrls = company.company_urls
              .map((url: any) => {
                if (typeof url === 'string') return url;
                if (typeof url === 'object' && url.url) return url.url;
                return null;
              })
              .filter(Boolean);

            // 最初の有効なURLのみを返す
            return validUrls.length > 0 ? validUrls[0] : 'URL未設定';
          }
          return 'URL未設定';
        };

        const getRepresentative = () => {
          const name =
            company.representative_name && company.representative_name.trim()
              ? company.representative_name
              : '';
          const position =
            company.representative_position &&
            company.representative_position.trim()
              ? company.representative_position
              : '';

          if (name && position) {
            return `${position} ${name}`;
          } else if (name) {
            return name;
          } else if (position) {
            return position;
          }
          return '代表者未設定';
        };

        // 企業データを CompanyDetailData 形式にマッピング
        const companyData: CompanyDetailData = {
          id: company.id,
          companyName: company.company_name || '企業名未設定',
          companyLogo: company.icon_image_url || '/company.jpg',
          images:
            company.company_images &&
            Array.isArray(company.company_images) &&
            company.company_images.length > 0
              ? company.company_images
              : ['/company.jpg'],
          title: company.company_name || '企業名未設定',
          description: getBusinessContent(),
          jobDescription: getBusinessContent(),
          positionSummary: getBusinessContent(),
          skills: '募集要項をご確認ください',
          otherRequirements: '募集要項をご確認ください',
          jobTypes: ['募集要項をご確認ください'],
          industries:
            company.industries && Array.isArray(company.industries)
              ? company.industries
              : ['業種未設定'],
          salaryMin: undefined,
          salaryMax: undefined,
          salaryNote: '募集要項をご確認ください',
          locations: ['募集要項をご確認ください'],
          locationNote: '詳細は募集要項をご確認ください',
          employmentType: 'FULL_TIME',
          employmentTypeNote: '募集要項をご確認ください',
          workingHours: '募集要項をご確認ください',
          overtime: '募集要項をご確認ください',
          overtimeMemo: '',
          holidays: '募集要項をご確認ください',
          selectionProcess: '募集要項をご確認ください',
          appealPoints: {
            business: ['詳細は企業ページをご確認ください'],
            company: ['詳細は企業ページをご確認ください'],
            team: ['詳細は企業ページをご確認ください'],
            workstyle: ['詳細は企業ページをご確認ください'],
          },
          smoke: '募集要項をご確認ください',
          resumeRequired: ['募集要項をご確認ください'],
          representative: getRepresentative(),
          establishedYear: company.established_year
            ? company.established_year.toString()
            : '未設定',
          capital: getCapital(),
          employeeCount: company.employees_count
            ? company.employees_count.toString()
            : '未設定',
          industry: getIndustryDisplay(),
          businessContent: getBusinessContent(),
          address: getAddress(),
          companyPhase: company.company_phase || '未設定',
          website: getWebsiteUrls(),
        };

        setState({
          data: companyData,
          loading: false,
          error: null,
        });
      } catch (error) {
        console.error('Error fetching company data:', error);
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
