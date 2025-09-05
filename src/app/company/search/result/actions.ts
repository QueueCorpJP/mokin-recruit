import { createClient } from '@/lib/supabase/client';
import type { CandidateData } from '@/components/company/CandidateCard';

// グループ情報を取得する関数（クライアントサイド）
export async function getCompanyGroups() {
  try {
    const supabase = createClient();
    
    // 現在のユーザーのセッションから会社情報を取得
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return [];
    }

    // company_usersテーブルから会社ユーザーIDを取得
    const { data: companyUser, error: userError } = await supabase
      .from('company_users')
      .select('id')
      .eq('user_id', user.id)
      .single();

    if (userError || !companyUser) {
      console.error('Error fetching company user:', userError);
      return [];
    }
    
    // company_user_group_permissionsテーブルから所属するグループ一覧を取得
    const { data: userPermissions, error } = await supabase
      .from('company_user_group_permissions')
      .select(`
        company_group:company_groups (
          id,
          group_name
        )
      `)
      .eq('company_user_id', companyUser.id);

    if (error) {
      console.error('Error fetching groups:', error);
      return [];
    }

    // グループ形式に変換
    return (userPermissions || [])
      .map((perm: any) => perm.company_group)
      .filter((group: any) => group && group.id && group.group_name)
      .map((group: any) => ({
        value: group.id,
        label: group.group_name
      }));
  } catch (error) {
    console.error('Error in getCompanyGroups:', error);
    return [];
  }
}

// 検索条件の型定義
interface SearchConditions {
  keyword?: string;
  experienceJobTypes?: Array<{id: string; name: string; experienceYears?: string}>;
  experienceIndustries?: Array<{id: string; name: string; experienceYears?: string}>;
  currentSalaryMin?: string;
  currentSalaryMax?: string;
  ageMin?: string;
  ageMax?: string;
  desiredJobTypes?: Array<{id: string; name: string}>;
  desiredIndustries?: Array<{id: string; name: string}>;
  desiredLocations?: Array<{id: string; name: string}>;
  education?: string;
  englishLevel?: string;
  qualifications?: string;
}

// 候補者データを取得する関数（クライアントサイド版）
export async function getCandidatesFromDatabase(): Promise<CandidateData[]> {
  try {
    const supabase = createClient();
    
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select(`
        id,
        last_name,
        first_name,
        current_company,
        current_position,
        prefecture,
        birth_date,
        gender,
        current_income,
        current_salary,
        desired_salary,
        skills,
        experience_years,
        desired_industries,
        desired_job_types,
        last_login_at,
        recent_job_company_name,
        recent_job_department_position,
        recent_job_industries,
        recent_job_types,
        recent_job_description,
        education(
          final_education,
          school_name
        ),
        work_experience(
          industry_name,
          experience_years
        ),
        job_type_experience(
          job_type_name,
          experience_years
        ),
        career_status_entries(
          company_name,
          industries,
          progress_status
        )
      `)
      .eq('status', 'ACTIVE')
      .order('last_login_at', { ascending: false });

    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    // 候補者のスキル情報を別途取得
    const candidateIds = candidates?.map(c => c.id) || [];
    const { data: skillsData } = await supabase
      .from('skills')
      .select('candidate_id, english_level')
      .in('candidate_id', candidateIds);

    // スカウト関連データを取得（注目ラベル判定用）
    // 1か月以内のスカウト受信数
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const { data: scoutReceiveData } = await supabase
      .from('scout_messages')
      .select('candidate_id, created_at')
      .in('candidate_id', candidateIds)
      .gte('created_at', oneMonthAgo.toISOString());

    // スカウト返信データ
    const { data: scoutReplyData } = await supabase
      .from('scout_replies')
      .select('candidate_id, created_at')
      .in('candidate_id', candidateIds);

    // スキルデータをマップに変換
    const skillsMap = new Map();
    skillsData?.forEach(skill => {
      skillsMap.set(skill.candidate_id, skill);
    });

    // スカウト受信データをマップに変換
    const scoutReceiveMap = new Map();
    scoutReceiveData?.forEach(scout => {
      const candidateId = scout.candidate_id;
      if (!scoutReceiveMap.has(candidateId)) {
        scoutReceiveMap.set(candidateId, []);
      }
      scoutReceiveMap.get(candidateId).push(scout);
    });

    // スカウト返信データをマップに変換
    const scoutReplyMap = new Map();
    scoutReplyData?.forEach(reply => {
      const candidateId = reply.candidate_id;
      if (!scoutReplyMap.has(candidateId)) {
        scoutReplyMap.set(candidateId, []);
      }
      scoutReplyMap.get(candidateId).push(reply);
    });

    // データを CandidateData 形式に変換
    const transformedCandidates: CandidateData[] = candidates?.map((candidate: any) => {
      const candidateSkills = skillsMap.get(candidate.id);
      
      // 注目ラベル判定ロジック
      const isAttentionWorthy = () => {
        // 1. 72時間以内ログインチェック
        if (!candidate.last_login_at) return false;
        const lastLogin = new Date(candidate.last_login_at);
        const seventyTwoHoursAgo = new Date();
        seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72);
        const isRecentLogin = lastLogin >= seventyTwoHoursAgo;
        
        // 2. 1か月以内5通以上スカウト受信チェック
        const scoutReceives = scoutReceiveMap.get(candidate.id) || [];
        const hasEnoughScouts = scoutReceives.length >= 5;
        
        // 3. 1件以上のスカウト返信ありチェック
        const scoutReplies = scoutReplyMap.get(candidate.id) || [];
        const hasReplied = scoutReplies.length >= 1;
        
        // 全ての条件を満たす場合のみtrue
        return isRecentLogin && hasEnoughScouts && hasReplied;
      };
      // 年齢計算
      const calculateAge = (birthDate: string) => {
        if (!birthDate) return '年齢未設定';
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        return `${age}歳`;
      };

      // 最終ログイン時間の計算
      const getLastLoginText = (lastLoginAt: string) => {
        if (!lastLoginAt) return '未ログイン';
        const lastLogin = new Date(lastLoginAt);
        const now = new Date();
        const diffMs = now.getTime() - lastLogin.getTime();
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffHours < 1) return '1時間以内';
        if (diffHours < 24) return `${diffHours}時間前`;
        if (diffDays < 7) return `${diffDays}日前`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}週間前`;
        return `${Math.floor(diffDays / 30)}ヶ月前`;
      };

      // 給与範囲の変換
      const formatSalary = (currentSalary: string | null, currentIncome: string | null) => {
        // current_salaryを優先的に使用
        let salaryValue = currentSalary || currentIncome;
        
        if (!salaryValue || salaryValue.trim() === '' || salaryValue === '0万円') {
          return '未設定';
        }

        // 「800万円」のような文字列から数値を抽出
        if (typeof salaryValue === 'string') {
          // 「800万円」→ 800 のように数値部分を抽出
          const match = salaryValue.match(/(\d+)/);
          if (match) {
            const salaryNum = parseInt(match[1]);
            if (salaryNum > 0) {
              return `${salaryValue}`;  // 元の形式をそのまま表示
            }
          }
        }
        
        return '未設定';
      };

      // 実際のデータを活用してフィールドを設定
      let experienceJobs = candidate.job_type_experience?.map((exp: any) => exp.job_type_name).filter(Boolean);
      if (!experienceJobs || experienceJobs.length === 0) {
        experienceJobs = candidate.desired_job_types?.slice(0, 3);
      }
      if (!experienceJobs || experienceJobs.length === 0) {
        experienceJobs = candidate.current_position ? [candidate.current_position] : [];
      }

      let experienceIndustries = candidate.work_experience?.map((exp: any) => exp.industry_name).filter(Boolean);
      if (!experienceIndustries || experienceIndustries.length === 0) {
        experienceIndustries = candidate.desired_industries?.slice(0, 3) || [];
      }

      // 選考中企業の情報を構築
      const selectionCompanies = candidate.career_status_entries?.filter((entry: any) => entry.progress_status)
        .map((entry: any) => ({
          company: entry.company_name || '企業名未設定',
          detail: Array.isArray(entry.industries) ? entry.industries.join('、') : (entry.industries || '業界情報なし')
        })) || [];

      // 職歴情報の構築
      const careerHistory = [{
        period: candidate.recent_job_company_name ? '直近' : '現在',
        company: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
        role: candidate.current_position || candidate.recent_job_department_position || '役職未設定'
      }];

      // バッジタイプとテキストの判定ロジック
      const determineBadge = (candidate: any) => {
        // より確実な判定のため複数の条件を使用

        // 多職種志向の判定条件を拡張
        const hasMultipleJobTypes = experienceJobs.length >= 3; // 3種類以上の職種経験
        const hasMultipleIndustries = experienceIndustries.length >= 2; // 2種類以上の業界経験
        const hasSelectionVariety = selectionCompanies.length >= 2; // 複数企業選考中

        if (hasMultipleJobTypes || (hasMultipleIndustries && hasSelectionVariety)) {
          return { type: 'multiple' as const, text: '多職種志向' };
        }

        // 専門性追求志向の判定条件を拡張
        const currentJobType = candidate.current_position || candidate.recent_job_department_position || '';
        const isExperienced = candidate.experience_years >= 3; // 3年以上の経験
        const isSingleIndustry = experienceIndustries.length <= 1; // 特定業界に集中
        
        // 専門職キーワードをチェック
        const professionalKeywords = ['エンジニア', 'デザイナー', 'コンサルタント', 'アナリスト', 'スペシャリスト', 'マネージャー'];
        const hasProfessionalTitle = professionalKeywords.some(keyword => 
          currentJobType.includes(keyword)
        );

        if (isExperienced && (isSingleIndustry || hasProfessionalTitle)) {
          return { type: 'professional' as const, text: '専門性追求志向' };
        }

        // キャリアチェンジ志向（デフォルト）
        return { type: 'change' as const, text: 'キャリアチェンジ志向' };
      };

      const badge = determineBadge(candidate);

      return {
        id: candidate.id,
        isPickup: false,
        isHidden: false,
        isAttention: isAttentionWorthy(),
        badgeType: badge.type,
        badgeText: badge.text,
        lastLogin: getLastLoginText(candidate.last_login_at),
        companyName: candidate.current_company || candidate.recent_job_company_name || '企業名未設定',
        department: candidate.recent_job_department_position || '部署名未設定',
        position: candidate.current_position || '役職未設定',
        location: candidate.prefecture || '未設定',
        age: calculateAge(candidate.birth_date),
        gender: candidate.gender === 'male' ? '男性' : candidate.gender === 'female' ? '女性' : '未設定',
        salary: formatSalary(candidate.current_salary, candidate.current_income),
        university: candidate.education?.[0]?.school_name || '大学名未設定',
        degree: candidate.education?.[0]?.final_education || '学歴未設定',
        language: candidate.skills ? candidate.skills.join('、') : '言語スキル未設定',
        languageLevel: candidateSkills?.english_level || '英語レベル未設定',
        experienceJobs: experienceJobs.length > 0 ? experienceJobs.slice(0, 3) : ['経験職種未設定'],
        experienceIndustries: experienceIndustries.length > 0 ? experienceIndustries.slice(0, 3) : ['経験業種未設定'],
        careerHistory,
        selectionCompanies: selectionCompanies.length > 0 ? selectionCompanies.slice(0, 3) : [{ company: '選考中企業未設定', detail: '未設定' }],
      };
    }) || [];

    return transformedCandidates;

  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return [];
  }
}

// 検索パラメータから検索条件を復元してストアに設定する関数
export function loadSearchParamsToStore(searchParams: URLSearchParams, searchStore: any) {
  // Basic search
  if (searchParams.get('search_group')) {
    searchStore.setSearchGroup(searchParams.get('search_group'));
  }
  if (searchParams.get('keyword')) {
    searchStore.setKeyword(searchParams.get('keyword'));
  }
  
  // Experience job types
  if (searchParams.get('experience_job_types')) {
    const jobTypes = searchParams.get('experience_job_types')!.split(',').map((name, index) => ({
      id: `job-${index}`,
      name: name.trim(),
    }));
    searchStore.setExperienceJobTypes(jobTypes);
  }
  
  // Experience industries
  if (searchParams.get('experience_industries')) {
    const industries = searchParams.get('experience_industries')!.split(',').map((name, index) => ({
      id: `industry-${index}`,
      name: name.trim(),
    }));
    searchStore.setExperienceIndustries(industries);
  }
  
  // Salary
  if (searchParams.get('current_salary_min')) {
    searchStore.setCurrentSalaryMin(searchParams.get('current_salary_min'));
  }
  if (searchParams.get('current_salary_max')) {
    searchStore.setCurrentSalaryMax(searchParams.get('current_salary_max'));
  }
  
  // Company and education
  if (searchParams.get('current_company')) {
    searchStore.setCurrentCompany(searchParams.get('current_company'));
  }
  if (searchParams.get('education')) {
    searchStore.setEducation(searchParams.get('education'));
  }
  if (searchParams.get('english_level')) {
    searchStore.setEnglishLevel(searchParams.get('english_level'));
  }
  
  // Age
  if (searchParams.get('age_min')) {
    searchStore.setAgeMin(searchParams.get('age_min'));
  }
  if (searchParams.get('age_max')) {
    searchStore.setAgeMax(searchParams.get('age_max'));
  }
  
  // Desired conditions
  if (searchParams.get('desired_job_types')) {
    const desiredJobTypes = searchParams.get('desired_job_types')!.split(',').map((name, index) => ({
      id: `desired-job-${index}`,
      name: name.trim(),
    }));
    searchStore.setDesiredJobTypes(desiredJobTypes);
  }
  
  if (searchParams.get('desired_industries')) {
    const desiredIndustries = searchParams.get('desired_industries')!.split(',').map((name, index) => ({
      id: `desired-industry-${index}`,
      name: name.trim(),
    }));
    searchStore.setDesiredIndustries(desiredIndustries);
  }
  
  if (searchParams.get('desired_locations')) {
    const desiredLocations = searchParams.get('desired_locations')!.split(',').map((name, index) => ({
      id: `location-${index}`,
      name: name.trim(),
    }));
    searchStore.setDesiredLocations(desiredLocations);
  }
  
  if (searchParams.get('work_styles')) {
    const workStyles = searchParams.get('work_styles')!.split(',').map((name, index) => ({
      id: `work-style-${index}`,
      name: name.trim(),
    }));
    searchStore.setWorkStyles(workStyles);
  }
  
  // Other conditions
  if (searchParams.get('transfer_time')) {
    searchStore.setTransferTime(searchParams.get('transfer_time'));
  }
  if (searchParams.get('selection_status')) {
    searchStore.setSelectionStatus(searchParams.get('selection_status'));
  }
  if (searchParams.get('last_login_min')) {
    searchStore.setLastLoginMin(searchParams.get('last_login_min'));
  }
}

// 検索パラメータから初期設定を取得する関数（後方互換性のため残す）
export function parseSearchParams(searchParams: URLSearchParams) {
  return {
    searchGroup: searchParams.get('search_group') || '',
    jobTypes: searchParams.get('job_types')?.split(',').map((name, index) => ({
      id: `job-${index}`,
      name: name.trim(),
    })) || [],
    industries: searchParams.get('industries')?.split(',').map((name, index) => ({
      id: `industry-${index}`,
      name: name.trim(),
    })) || [],
    keyword: searchParams.get('keyword') || '',
    salaryMin: searchParams.get('salary_min') || '',
    salaryMax: searchParams.get('salary_max') || '',
    locations: searchParams.get('locations')?.split(',') || [],
    workStyles: searchParams.get('work_styles')?.split(',') || [],
  };
}

// 検索条件に基づいて候補者を検索する関数
export async function searchCandidatesWithConditions(conditions: SearchConditions): Promise<CandidateData[]> {
  try {
    const supabase = createClient();
    
    let query = supabase
      .from('candidates')
      .select(`
        id,
        last_name,
        first_name,
        current_company,
        current_position,
        prefecture,
        birth_date,
        gender,
        current_income,
        current_salary,
        desired_salary,
        skills,
        experience_years,
        desired_industries,
        desired_job_types,
        last_login_at,
        recent_job_company_name,
        recent_job_department_position,
        recent_job_industries,
        recent_job_types,
        recent_job_description,
        education(
          final_education,
          school_name
        ),
        work_experience(
          industry_name,
          experience_years
        ),
        job_type_experience(
          job_type_name,
          experience_years
        ),
        career_status_entries(
          company_name,
          industries,
          progress_status
        )
      `);

    // キーワード検索（名前、会社名、部署、職種、業界等で検索）
    if (conditions.keyword && conditions.keyword.trim()) {
      const keyword = conditions.keyword.trim();
      query = query.or(`
        last_name.ilike.%${keyword}%,
        first_name.ilike.%${keyword}%,
        current_company.ilike.%${keyword}%,
        current_position.ilike.%${keyword}%,
        recent_job_company_name.ilike.%${keyword}%,
        recent_job_department_position.ilike.%${keyword}%,
        recent_job_description.ilike.%${keyword}%
      `);
    }

    // 年収フィルタ
    if (conditions.currentSalaryMin) {
      const minSalary = parseInt(conditions.currentSalaryMin);
      if (!isNaN(minSalary)) {
        // current_salaryまたはcurrent_incomeから年収を抽出して比較
        // 簡易的にnumberフィールドがないため、text検索で実装
      }
    }

    const { data: candidates, error } = await query;

    if (error) {
      console.error('Search error:', error);
      return [];
    }

    if (!candidates) {
      return [];
    }

    // クライアントサイドでの詳細フィルタリング
    let filteredCandidates = candidates;

    // 経験職種フィルタ
    if (conditions.experienceJobTypes && conditions.experienceJobTypes.length > 0) {
      const targetJobTypes = conditions.experienceJobTypes.map(jt => jt.name.toLowerCase());
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        const candidateJobTypes = [
          ...(candidate.job_type_experience?.map((exp: any) => exp.job_type_name?.toLowerCase()) || []),
          ...(candidate.desired_job_types?.map((jt: string) => jt.toLowerCase()) || []),
          candidate.current_position?.toLowerCase(),
          candidate.recent_job_department_position?.toLowerCase()
        ].filter(Boolean);
        
        return targetJobTypes.some(targetType => 
          candidateJobTypes.some((candidateType: string) => 
            candidateType.includes(targetType) || targetType.includes(candidateType)
          )
        );
      });
    }

    // 経験業種フィルタ
    if (conditions.experienceIndustries && conditions.experienceIndustries.length > 0) {
      const targetIndustries = conditions.experienceIndustries.map(ind => ind.name.toLowerCase());
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        const candidateIndustries = [
          ...(candidate.work_experience?.map((exp: any) => exp.industry_name?.toLowerCase()) || []),
          ...(candidate.desired_industries?.map((ind: string) => ind.toLowerCase()) || []),
          ...(candidate.recent_job_industries ? JSON.stringify(candidate.recent_job_industries).toLowerCase() : [])
        ].filter(Boolean);
        
        return targetIndustries.some(targetIndustry => 
          candidateIndustries.some((candidateIndustry: string) => 
            candidateIndustry.includes(targetIndustry) || targetIndustry.includes(candidateIndustry)
          )
        );
      });
    }

    // 年収フィルタ（クライアントサイド）
    if (conditions.currentSalaryMin || conditions.currentSalaryMax) {
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        const salaryStr = candidate.current_salary || candidate.current_income || '';
        const salaryMatch = salaryStr.match(/(\d+)/);
        if (!salaryMatch) return false;
        
        const salary = parseInt(salaryMatch[1]);
        
        if (conditions.currentSalaryMin && salary < parseInt(conditions.currentSalaryMin)) {
          return false;
        }
        if (conditions.currentSalaryMax && salary > parseInt(conditions.currentSalaryMax)) {
          return false;
        }
        
        return true;
      });
    }

    // 年齢フィルタ
    if (conditions.ageMin || conditions.ageMax) {
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        if (!candidate.birth_date) return false;
        
        const birth = new Date(candidate.birth_date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
          age--;
        }
        
        if (conditions.ageMin && age < parseInt(conditions.ageMin)) {
          return false;
        }
        if (conditions.ageMax && age > parseInt(conditions.ageMax)) {
          return false;
        }
        
        return true;
      });
    }

    // 同じ変換処理を適用
    return getCandidatesFromDatabase().then(allCandidates => 
      allCandidates.filter(candidate => 
        filteredCandidates.some(filtered => filtered.id === candidate.id)
      )
    );

  } catch (error) {
    console.error('Search failed:', error);
    return [];
  }
}