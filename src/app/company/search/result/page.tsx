import React from 'react';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import SearchClient from './SearchClient';
import { parseSearchParams } from './actions';
import { getCandidatesFromDatabase } from './server-actions';
import {
  saveSearchHistory,
  getCompanyGroups,
} from '@/lib/actions/search-history';
import { generateSearchTitle } from '@/lib/utils/search-history';

interface SearchPageProps {
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }
  // サーバーサイドでデータを取得
  const candidates = await getCandidatesFromDatabase();
  console.log(
    '[DEBUG page.tsx] Server-side candidates count:',
    candidates.length
  );

  // グループ情報をサーバーサイドで取得
  const companyGroupsResult = await getCompanyGroups();
  const companyGroups = companyGroupsResult.success
    ? companyGroupsResult.data.map(group => ({
        value: group.id,
        label: group.name,
      }))
    : [];

  // URLパラメータをパース
  const urlParams = new URLSearchParams();
  Object.entries(searchParams).forEach(([key, value]) => {
    if (typeof value === 'string') {
      urlParams.set(key, value);
    } else if (Array.isArray(value)) {
      urlParams.set(key, value.join(','));
    }
  });

  // search_groupが設定されていない場合、デフォルトグループIDを取得
  let defaultGroupId = null;
  if (!urlParams.get('search_group')) {
    try {
      const { getUserDefaultGroupId } = await import(
        '@/lib/actions/search-history'
      );
      const defaultGroupResult = await getUserDefaultGroupId();
      if (defaultGroupResult.success && defaultGroupResult.data) {
        defaultGroupId = defaultGroupResult.data.id;
        console.log('[DEBUG] Server-side default group ID:', defaultGroupId);
      }
    } catch (error) {
      console.error('[DEBUG] Failed to get default group ID on server:', error);
    }
  }

  const initialSearchParams = parseSearchParams(urlParams);
  // デフォルトグループIDを初期パラメータに設定
  if (defaultGroupId && !initialSearchParams.searchGroup) {
    initialSearchParams.searchGroup = defaultGroupId;
  }

  // 検索履歴を保存（バックグラウンドで実行）
  console.log(
    '[DEBUG] Search params:',
    Object.fromEntries(urlParams.entries())
  );
  console.log('[DEBUG] search_group param:', urlParams.get('search_group'));

  try {
    const keyword = urlParams.get('keyword') || '';
    const ageMin = urlParams.get('age_min');
    const ageMax = urlParams.get('age_max');
    const currentSalaryMin = urlParams.get('current_salary_min');
    const currentSalaryMax = urlParams.get('current_salary_max');
    const desiredSalaryMin = urlParams.get('desired_salary_min');
    const desiredSalaryMax = urlParams.get('desired_salary_max');

    // SearchConditions型に合わせたフォーマット
    const searchConditions = {
      keywords: keyword ? [keyword] : [],
      age_min: ageMin ? parseInt(ageMin) : undefined,
      age_max: ageMax ? parseInt(ageMax) : undefined,
      job_types:
        urlParams.get('experience_job_types')?.split(',').filter(Boolean) || [],
      industries:
        urlParams.get('experience_industries')?.split(',').filter(Boolean) ||
        [],
      locations:
        urlParams.get('desired_locations')?.split(',').filter(Boolean) || [],
      work_styles:
        urlParams.get('work_styles')?.split(',').filter(Boolean) || [],
      education_levels: urlParams.get('education')
        ? [urlParams.get('education')!]
        : [],
      skills: urlParams.get('qualifications')?.split(',').filter(Boolean) || [],
      salary_min: currentSalaryMin ? parseInt(currentSalaryMin) : undefined,
      salary_max: currentSalaryMax ? parseInt(currentSalaryMax) : undefined,
      language_skills: [],
      // その他の検索条件を追加
      desired_job_types:
        urlParams.get('desired_job_types')?.split(',').filter(Boolean) || [],
      desired_industries:
        urlParams.get('desired_industries')?.split(',').filter(Boolean) || [],
      desired_salary_min: desiredSalaryMin
        ? parseInt(desiredSalaryMin)
        : undefined,
      desired_salary_max: desiredSalaryMax
        ? parseInt(desiredSalaryMax)
        : undefined,
      current_company: urlParams.get('current_company') || '',
      english_level: urlParams.get('english_level') || '',
      other_language: urlParams.get('other_language') || '',
      other_language_level: urlParams.get('other_language_level') || '',
      transfer_time: urlParams.get('transfer_time') || '',
      selection_status: urlParams.get('selection_status') || '',
      similar_company_industry: urlParams.get('similar_company_industry') || '',
      similar_company_location: urlParams.get('similar_company_location') || '',
      last_login_min: urlParams.get('last_login_min') || '',
    };

    // デバッグ: URLパラメータを詳細に出力
    console.log('[DEBUG] All URL params:');
    for (const [key, value] of urlParams.entries()) {
      console.log(`  ${key}: ${value}`);
    }

    // 有効な検索条件があるかチェック（空文字や空配列は無効とする）
    const hasValidConditions =
      searchConditions.keywords.some(k => k.trim().length > 0) ||
      searchConditions.job_types.length > 0 ||
      searchConditions.industries.length > 0 ||
      searchConditions.locations.length > 0 ||
      searchConditions.work_styles.length > 0 ||
      searchConditions.education_levels.length > 0 ||
      searchConditions.skills.length > 0 ||
      searchConditions.desired_job_types?.length > 0 ||
      searchConditions.desired_industries?.length > 0 ||
      searchConditions.age_min ||
      searchConditions.age_max ||
      searchConditions.salary_min ||
      searchConditions.salary_max ||
      searchConditions.desired_salary_min ||
      searchConditions.desired_salary_max ||
      (searchConditions.current_company &&
        searchConditions.current_company.trim().length > 0) ||
      (searchConditions.english_level &&
        searchConditions.english_level.trim().length > 0) ||
      (searchConditions.other_language &&
        searchConditions.other_language.trim().length > 0) ||
      (searchConditions.transfer_time &&
        searchConditions.transfer_time.trim().length > 0) ||
      (searchConditions.selection_status &&
        searchConditions.selection_status.trim().length > 0);

    console.log(
      '[DEBUG] searchConditions:',
      JSON.stringify(searchConditions, null, 2)
    );
    console.log('[DEBUG] hasValidConditions:', hasValidConditions);
    console.log('[DEBUG] search_group param:', urlParams.get('search_group'));
    console.log(
      '[DEBUG] Will save history?:',
      urlParams.get('search_group') && hasValidConditions
    );

    // 検索条件が存在し、ユーザーがグループを明示的に選択している場合のみ履歴保存（重複は別途チェック）
    // 手動保存済みの場合は自動保存を無効にする
    const hasKeywordOrFilters =
      searchConditions.keywords.some(k => k.trim().length > 0) ||
      searchConditions.job_types.length > 0 ||
      searchConditions.industries.length > 0 ||
      searchConditions.locations.length > 0 ||
      searchConditions.work_styles.length > 0 ||
      searchConditions.education_levels.length > 0 ||
      searchConditions.skills.length > 0 ||
      searchConditions.desired_job_types?.length > 0 ||
      searchConditions.desired_industries?.length > 0 ||
      searchConditions.age_min ||
      searchConditions.age_max ||
      searchConditions.salary_min ||
      searchConditions.salary_max ||
      searchConditions.desired_salary_min ||
      searchConditions.desired_salary_max ||
      (searchConditions.current_company &&
        searchConditions.current_company.trim().length > 0) ||
      (searchConditions.english_level &&
        searchConditions.english_level.trim().length > 0) ||
      (searchConditions.other_language &&
        searchConditions.other_language.trim().length > 0) ||
      (searchConditions.transfer_time &&
        searchConditions.transfer_time.trim().length > 0) ||
      (searchConditions.selection_status &&
        searchConditions.selection_status.trim().length > 0);
    const isManualSave = urlParams.get('saved') === 'true';
    // search_group がURLに無い場合はサーバで取得した defaultGroupId を保存時に使用
    const groupForSave = urlParams.get('search_group') || defaultGroupId;
    console.log('[DEBUG] groupForSave (for history save):', groupForSave);
    const shouldSaveHistory =
      groupForSave &&
      hasValidConditions &&
      hasKeywordOrFilters &&
      !isManualSave;

    if (shouldSaveHistory) {
      console.log('[DEBUG] Saving search history...');
      const searchTitle = generateSearchTitle(searchConditions);

      // 履歴保存（エラーが発生しても処理を続行）
      const result = await saveSearchHistory({
        group_id: groupForSave as string,
        search_conditions: searchConditions,
        search_title: searchTitle,
        is_saved: false, // 検索履歴は未保存として記録
      }).catch(error => {
        console.error('Failed to save search history:', error);
        return { success: false, error: error.message };
      });

      console.log('[DEBUG] Save result:', result);
    } else {
      console.log(
        '[DEBUG] Not saving search history - グループが選択されていないか、有効な検索条件がありません'
      );
      console.log('[DEBUG] search_group:', urlParams.get('search_group'));
      console.log('[DEBUG] hasValidConditions:', hasValidConditions);
    }
  } catch (error) {
    console.error('Error processing search history:', error);
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <SearchClient
        initialCandidates={candidates}
        initialSearchParams={initialSearchParams}
        initialCompanyGroups={companyGroups}
      />
    </div>
  );
}
