'use server';

import { createServerActionClient } from '@/lib/supabase/server';
import type { CandidateData } from '@/components/company/CandidateCard';
import { calculateCandidateBadge } from '@/lib/utils/candidateBadgeLogic';

// 検索条件の型定義
interface SearchConditions {
  keyword?: string;
  experienceJobTypes?: Array<{
    id: string;
    name: string;
    experienceYears?: string;
  }>;
  experienceIndustries?: Array<{
    id: string;
    name: string;
    experienceYears?: string;
  }>;
  currentSalaryMin?: string;
  currentSalaryMax?: string;
  ageMin?: string;
  ageMax?: string;
  desiredJobTypes?: Array<{ id: string; name: string }>;
  desiredIndustries?: Array<{ id: string; name: string }>;
  desiredLocations?: Array<{ id: string; name: string }>;
  education?: string;
  englishLevel?: string;
  qualifications?: string;
}

// 候補者データを取得する関数（サーバーアクション版）
export async function getCandidatesFromDatabase(): Promise<CandidateData[]> {
  console.log('🔍 [getCandidatesFromDatabase] 開始');
  try {
    const supabase = createServerActionClient();
    console.log(
      '📡 [getCandidatesFromDatabase] ServerActionクライアント作成完了'
    );

    // 認証状態を確認
    console.log('🔐 [getCandidatesFromDatabase] 認証状態を確認中...');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error('❌ [getCandidatesFromDatabase] 認証エラー:', authError);
      return [];
    }

    if (!user) {
      console.error('❌ [getCandidatesFromDatabase] ユーザーが存在しません');
      return [];
    }

    console.log('✅ [getCandidatesFromDatabase] 認証成功 - User ID:', user.id);
    console.log('👤 [getCandidatesFromDatabase] User詳細:', {
      id: user.id,
      email: user.email,
      role: user.role,
      aud: user.aud,
    });

    // 1か月以内のスカウト受信数チェック用の時刻
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    console.log('📊 [getCandidatesFromDatabase] candidatesクエリを実行中...');
    console.log(
      '📊 [getCandidatesFromDatabase] Using status filter: ACTIVE, official'
    );
    const { data: candidates, error } = await supabase
      .from('candidates')
      .select(
        `
        id,
        last_name,
        first_name,
        current_company,
        prefecture,
        birth_date,
        gender,
        current_salary,
        skills,
        experience_years,
        last_login_at,
        recent_job_company_name,
        recent_job_department_position,
        recent_job_industries,
        recent_job_types,
        recent_job_description,
        job_summary,
        status,
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
      `
      )
      .in('status', ['ACTIVE', 'official'])
      .order('last_login_at', { ascending: false });

    if (error) {
      console.error(
        '❌ [getCandidatesFromDatabase] Supabaseクエリエラー:',
        error
      );
      console.error('❌ [getCandidatesFromDatabase] エラー詳細:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    console.log('✅ [getCandidatesFromDatabase] candidatesクエリ成功');
    console.log(
      '📊 [getCandidatesFromDatabase] 取得した候補者数:',
      candidates?.length || 0
    );

    if (candidates && candidates.length > 0) {
      console.log('👥 [getCandidatesFromDatabase] 最初の候補者サンプル:', {
        id: candidates[0].id,
        name: `${candidates[0].last_name} ${candidates[0].first_name}`,
        company: candidates[0].current_company,
      });
    }

    // データ変換処理を共通関数に移行（N+1問題解決）
    return transformCandidatesToDisplayFormat(candidates);
  } catch (error) {
    console.error('Failed to fetch candidates:', error);
    return [];
  }
}

// 候補者データをCandidateData形式に変換する関数（N+1問題解決）
async function transformCandidatesToDisplayFormat(
  candidates: any[]
): Promise<CandidateData[]> {
  if (!candidates || candidates.length === 0) return [];

  const supabase = createServerActionClient();

  // 1か月以内のスカウト受信数チェック用の時刻
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  // 関連データを並列で取得（N+1問題解決）
  const candidateIds = candidates.map(c => c.id);
  const [skillsResult, scoutReceiveResult, scoutReplyResult] =
    await Promise.all([
      supabase
        .from('skills')
        .select('candidate_id, english_level')
        .in('candidate_id', candidateIds),
      supabase
        .from('scout_messages')
        .select('candidate_id, created_at')
        .in('candidate_id', candidateIds)
        .gte('created_at', oneMonthAgo.toISOString()),
      supabase
        .from('scout_replies')
        .select('candidate_id, created_at')
        .in('candidate_id', candidateIds),
    ]);

  const skillsData = skillsResult.data;
  const scoutReceiveData = scoutReceiveResult.data;
  const scoutReplyData = scoutReplyResult.data;

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

  // データをCandidateData形式に変換
  return candidates.map((candidate: any) => {
    const candidateSkills = skillsMap.get(candidate.id);

    // 注目ラベル判定ロジック
    const isAttentionWorthy = () => {
      if (!candidate.last_login_at) return false;
      const lastLogin = new Date(candidate.last_login_at);
      const seventyTwoHoursAgo = new Date();
      seventyTwoHoursAgo.setHours(seventyTwoHoursAgo.getHours() - 72);
      const isRecentLogin = lastLogin >= seventyTwoHoursAgo;

      const scoutReceives = scoutReceiveMap.get(candidate.id) || [];
      const hasEnoughScouts = scoutReceives.length >= 5;

      const scoutReplies = scoutReplyMap.get(candidate.id) || [];
      const hasReplied = scoutReplies.length >= 1;

      return isRecentLogin && hasEnoughScouts && hasReplied;
    };

    // 年齢計算
    const calculateAge = (birthDate: string) => {
      if (!birthDate) return '年齢未設定';
      const birth = new Date(birthDate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
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
      if (diffDays <= 7) return `${diffDays}日前`;
      return '1週間以上前';
    };

    // バッジ種別の判定
    let badgeType = '';
    let badgeText = '';
    const scoutReceives = scoutReceiveMap.get(candidate.id) || [];
    const scoutReplies = scoutReplyMap.get(candidate.id) || [];

    if (isAttentionWorthy()) {
      badgeType = 'attention';
      badgeText = '注目';
    } else if (scoutReplies.length >= 1) {
      badgeType = 'scout-reply';
      badgeText = 'スカウト返信済み';
    } else if (scoutReceives.length >= 5) {
      badgeType = 'multiple-scout';
      badgeText = 'スカウト多数受信';
    }

    // 給与情報のフォーマット関数（動作している関数と同じロジック）
    const formatSalary = (
      currentSalary: any,
      currentIncome: any,
      desiredSalary: any
    ) => {
      // 優先順位: currentIncome > currentSalary > desiredSalary
      const salaryOptions = [
        currentIncome,
        currentSalary,
        desiredSalary,
      ].filter(Boolean);

      for (const salary of salaryOptions) {
        if (salary) {
          const salaryValue = String(salary);
          const match = salaryValue.match(/(\d+)/);
          if (match) {
            const salaryNum = parseInt(match[1]);
            if (salaryNum > 0) {
              return `${salaryValue}`;
            }
          }
        }
      }

      return '未設定';
    };

    // 実際のデータを活用してフィールドを設定
    let experienceJobs = candidate.job_type_experience
      ?.map((exp: any) => exp.job_type_name)
      .filter(Boolean);
    if (!experienceJobs || experienceJobs.length === 0) {
      experienceJobs = candidate.recent_job_types?.slice(0, 3) || [];
    }

    let experienceIndustries = candidate.work_experience
      ?.map((exp: any) => exp.industry_name)
      .filter(Boolean);
    if (!experienceIndustries || experienceIndustries.length === 0) {
      experienceIndustries = candidate.recent_job_industries?.slice(0, 3) || [];
    }

    // 選考中企業の情報を構築
    const selectionCompanies =
      candidate.career_status_entries
        ?.filter((entry: any) => entry.progress_status)
        .map((entry: any) => ({
          company: entry.company_name || '企業名未設定',
          detail: Array.isArray(entry.industries)
            ? entry.industries.join('、')
            : entry.industries || '業界情報なし',
        })) || [];

    // 職歴情報の構築
    const careerHistory = [
      {
        period: candidate.recent_job_company_name ? '直近' : '現在',
        company:
          candidate.current_company ||
          candidate.recent_job_company_name ||
          '企業名未設定',
        position: candidate.recent_job_department_position || '役職未設定',
        detail: candidate.recent_job_description || '職歴詳細未設定',
      },
    ];

    return {
      id: candidate.id,
      isPickup: false,
      isHidden: false,
      isAttention: isAttentionWorthy(),
      badgeType,
      badgeText,
      lastLogin: getLastLoginText(candidate.last_login_at),
      companyName:
        candidate.current_company ||
        candidate.recent_job_company_name ||
        '企業名未設定',
      department: candidate.recent_job_department_position || '部署名未設定',
      position: candidate.recent_job_department_position || '役職未設定',
      location: candidate.prefecture || '未設定',
      age: calculateAge(candidate.birth_date),
      gender:
        candidate.gender === 'male'
          ? '男性'
          : candidate.gender === 'female'
            ? '女性'
            : '未設定',
      salary: formatSalary(candidate.current_salary, null, null),
      university: candidate.education?.[0]?.school_name || '大学名未設定',
      degree: candidate.education?.[0]?.final_education || '学歴未設定',
      language: candidate.skills
        ? candidate.skills.join('、')
        : '言語スキル未設定',
      languageLevel: candidateSkills?.english_level || '英語レベル未設定',
      experienceJobs:
        experienceJobs.length > 0
          ? experienceJobs.slice(0, 3)
          : ['経験職種未設定'],
      experienceIndustries:
        experienceIndustries.length > 0
          ? experienceIndustries.slice(0, 3)
          : ['経験業種未設定'],
      careerHistory,
      selectionCompanies:
        selectionCompanies.length > 0
          ? selectionCompanies.slice(0, 3)
          : [{ company: '選考中企業未設定', detail: '未設定' }],
    };
  });
}

// 検索条件に基づいて候補者を検索する関数
export async function searchCandidatesWithConditions(
  conditions: SearchConditions
): Promise<CandidateData[]> {
  console.log('🔍 [searchCandidatesWithConditions] 開始');
  console.log('🔍 [searchCandidatesWithConditions] 検索条件:', conditions);

  try {
    const supabase = createServerActionClient();
    console.log(
      '📡 [searchCandidatesWithConditions] ServerActionクライアント作成完了'
    );

    // 認証状態を確認
    console.log('🔐 [searchCandidatesWithConditions] 認証状態を確認中...');
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError) {
      console.error(
        '❌ [searchCandidatesWithConditions] 認証エラー:',
        authError
      );
      return [];
    }

    if (!user) {
      console.error(
        '❌ [searchCandidatesWithConditions] ユーザーが存在しません'
      );
      return [];
    }

    console.log(
      '✅ [searchCandidatesWithConditions] 認証成功 - User ID:',
      user.id
    );
    console.log('👤 [searchCandidatesWithConditions] User詳細:', {
      id: user.id,
      email: user.email,
      role: user.role,
      aud: user.aud,
    });

    // Use the same field selection as the working getCandidateDetailData function
    let query = supabase.from('candidates').select(`
        id,
        first_name,
        last_name,
        current_company,
        prefecture,
        birth_date,
        gender,
        current_salary,
        last_login_at,
        job_summary,
        skills,
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

    // キーワード検索（職務要約、職務経歴内、業務内容で検索）
    if (conditions.keyword && conditions.keyword.trim()) {
      const keyword = conditions.keyword.trim();
      query = query.or(`
        job_summary.ilike.%${keyword}%,
        recent_job_description.ilike.%${keyword}%,
        recent_job_department_position.ilike.%${keyword}%
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

    console.log(
      '📊 [searchCandidatesWithConditions] データベースクエリを実行中...'
    );
    const { data: candidates, error } = await query;

    if (error) {
      console.error(
        '❌ [searchCandidatesWithConditions] Supabaseクエリエラー:',
        error
      );
      console.error('❌ [searchCandidatesWithConditions] エラー詳細:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
      });
      return [];
    }

    console.log('✅ [searchCandidatesWithConditions] クエリ成功');
    console.log(
      '📊 [searchCandidatesWithConditions] 取得した候補者数 (フィルタリング前):',
      candidates?.length || 0
    );

    if (!candidates) {
      console.log('⚠️ [searchCandidatesWithConditions] 候補者データがnullです');
      return [];
    }

    // クライアントサイドでの詳細フィルタリング
    console.log(
      '🔧 [searchCandidatesWithConditions] クライアントサイドフィルタリング開始'
    );
    let filteredCandidates = candidates;

    // 経験職種フィルタ
    if (
      conditions.experienceJobTypes &&
      conditions.experienceJobTypes.length > 0
    ) {
      console.log(
        '🏢 [searchCandidatesWithConditions] 経験職種フィルタを適用:',
        conditions.experienceJobTypes
      );
      const targetJobTypes = conditions.experienceJobTypes.map(jt =>
        jt.name.toLowerCase()
      );
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        const candidateJobTypes = [
          ...(candidate.job_type_experience?.map((exp: any) =>
            exp.job_type_name?.toLowerCase()
          ) || []),
          candidate.recent_job_department_position?.toLowerCase(),
        ].filter(Boolean);

        return targetJobTypes.some(targetType =>
          candidateJobTypes.some(
            (candidateType: string) =>
              candidateType.includes(targetType) ||
              targetType.includes(candidateType)
          )
        );
      });
      console.log(
        '📊 [searchCandidatesWithConditions] 経験職種フィルタ適用後の候補者数:',
        filteredCandidates.length
      );
    }

    // 経験業種フィルタ
    if (
      conditions.experienceIndustries &&
      conditions.experienceIndustries.length > 0
    ) {
      console.log(
        '🏭 [searchCandidatesWithConditions] 経験業種フィルタを適用:',
        conditions.experienceIndustries
      );
      const targetIndustries = conditions.experienceIndustries.map(ind =>
        ind.name.toLowerCase()
      );
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        const candidateIndustries = [
          ...(candidate.work_experience?.map((exp: any) =>
            exp.industry_name?.toLowerCase()
          ) || []),
          ...(candidate.recent_job_industries
            ? JSON.stringify(candidate.recent_job_industries).toLowerCase()
            : []),
        ].filter(Boolean);

        return targetIndustries.some(targetIndustry =>
          candidateIndustries.some(
            (candidateIndustry: string) =>
              candidateIndustry.includes(targetIndustry) ||
              targetIndustry.includes(candidateIndustry)
          )
        );
      });
      console.log(
        '📊 [searchCandidatesWithConditions] 経験業種フィルタ適用後の候補者数:',
        filteredCandidates.length
      );
    }

    // 年収フィルタ（クライアントサイド）- 復活
    if (conditions.currentSalaryMin || conditions.currentSalaryMax) {
      console.log('💰 [searchCandidatesWithConditions] 年収フィルタを適用:', {
        min: conditions.currentSalaryMin,
        max: conditions.currentSalaryMax,
      });
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        // current_salary のみを使用してチェック
        let salary = 0;

        if (candidate.current_salary) {
          const salaryMatch = String(candidate.current_salary).match(/(\d+)/);
          if (salaryMatch) {
            salary = parseInt(salaryMatch[1]);
          }
        }

        if (salary === 0) return false; // 年収が不明な場合は除外

        if (
          conditions.currentSalaryMin &&
          salary < parseInt(conditions.currentSalaryMin)
        ) {
          return false;
        }
        if (
          conditions.currentSalaryMax &&
          salary > parseInt(conditions.currentSalaryMax)
        ) {
          return false;
        }

        return true;
      });
      console.log(
        '📊 [searchCandidatesWithConditions] 年収フィルタ適用後の候補者数:',
        filteredCandidates.length
      );
    }

    // 年齢フィルタ
    if (conditions.ageMin || conditions.ageMax) {
      console.log('👶 [searchCandidatesWithConditions] 年齢フィルタを適用:', {
        min: conditions.ageMin,
        max: conditions.ageMax,
      });
      filteredCandidates = filteredCandidates.filter((candidate: any) => {
        if (!candidate.birth_date) return false;

        const birth = new Date(candidate.birth_date);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
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
      console.log(
        '📊 [searchCandidatesWithConditions] 年齢フィルタ適用後の候補者数:',
        filteredCandidates.length
      );
    }

    console.log(
      '✅ [searchCandidatesWithConditions] 全フィルタ適用完了 - 最終候補者数:',
      filteredCandidates.length
    );

    // フィルタリング済み候補者のデータ変換を直接実行（N+1問題解決）
    console.log(
      '🔄 [searchCandidatesWithConditions] フィルタリング済み候補者のデータ変換中...'
    );
    const finalResults =
      await transformCandidatesToDisplayFormat(filteredCandidates);

    console.log(
      '🎯 [searchCandidatesWithConditions] 最終結果:',
      finalResults.length,
      '件'
    );

    if (finalResults.length > 0) {
      console.log('👥 [searchCandidatesWithConditions] 最終結果サンプル:', {
        id: finalResults[0].id,
        companyName: finalResults[0].companyName,
        position: finalResults[0].position,
      });
    }

    return finalResults;
  } catch (error) {
    console.error('❌ [searchCandidatesWithConditions] 関数実行エラー:', error);
    return [];
  }
}
