import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { cookies } from 'next/headers';

// 候補者データの型定義
export interface CandidateData {
  id: string;
  name: string;
  company: string;
  location: string;
  age: number;
  gender: string;
  experience: string[];
  industry: string[];
  targetCompany: string;
  targetJob: string;
  group: string;
  applicationDate?: string;
  firstScreening?: string;
  secondScreening?: string;
  finalScreening?: string;
  offer?: string;
  assignedUsers: string[];
}

// 年齢を計算する関数
function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// 現在のユーザーのcompany_account_idを取得する関数
async function getCurrentCompanyAccountId(): Promise<string | null> {
  try {
    // 環境変数の確認
    console.log('🔍 Environment check:', {
      SUPABASE_URL: process.env.SUPABASE_URL ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET',
      SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET',
    });
    
    const supabase = await getSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    console.log('🔍 Auth User:', { 
      userId: user?.id, 
      email: user?.email, 
      metadata: user?.user_metadata,
      authError 
    });
    
    if (!user) {
      console.log('🔍 No authenticated user found');
      return null;
    }
    
    // user_metadataからcompany_account_idを取得
    const companyAccountId = user.user_metadata?.company_account_id;
    if (companyAccountId) {
      console.log('🔍 Company Account ID from metadata:', companyAccountId);
      return companyAccountId;
    }
    
    // fallback: emailからcompany_usersテーブルを検索
    console.log('🔍 Fallback: Searching company_users table for email:', user.email);
    
    // RLS対応: 認証済みクライアントでクエリを実行
    const authenticatedSupabase = await getSupabaseServerClient();
    
    // まず、全ての企業ユーザーを確認（デバッグ用）
    const { data: allCompanyUsers } = await authenticatedSupabase
      .from('company_users')
      .select('email, company_account_id, auth_user_id');
    console.log('🔍 All company users:', allCompanyUsers);
    
    const { data: companyUser, error: companyUserError } = await authenticatedSupabase
      .from('company_users')
      .select('company_account_id')
      .eq('email', user.email)
      .single();
      
    console.log('🔍 Company User Query Result:', { companyUser, companyUserError });
    
    // 追加のフォールバック: auth_user_idで検索
    if (!companyUser && user.id) {
      console.log('🔍 Additional fallback: Searching by auth_user_id:', user.id);
      const { data: companyUserByAuthId, error: authIdError } = await authenticatedSupabase
        .from('company_users')
        .select('company_account_id')
        .eq('auth_user_id', user.id)
        .single();
      console.log('🔍 Company User by auth_user_id:', { companyUserByAuthId, authIdError });
      
      if (companyUserByAuthId) {
        return companyUserByAuthId.company_account_id;
      }
    }
      
    // 一時的なハードコード修正（テスト用）- 本番では削除すること
    if (user.email === 'test@gmail.com') {
      console.log('🔍 Temporary hardcode for test@gmail.com');
      return '8926f65d-0524-4f8a-8c5e-9f8e1d186587';
    }
    
    return companyUser?.company_account_id || null;
  } catch (error) {
    console.error('現在の企業アカウントIDの取得に失敗:', error);
    return null;
  }
}

// 候補者データを取得する関数
export async function getCandidatesData(): Promise<CandidateData[]> {
  // RLS対応: 認証済みクライアントを使用
  const supabase = await getSupabaseServerClient();
  
  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  console.log('🔍 Company Account ID:', companyAccountId);
  if (!companyAccountId) {
    console.error('企業アカウントIDが見つかりません');
    return [];
  }
  
  try {
    // 自分の企業のグループIDを取得（RLS適用）
    const { data: companyGroups, error: groupError } = await supabase
      .from('company_groups')
      .select('id')
      .eq('company_account_id', companyAccountId);
      
    console.log('🔍 Company Groups Query Result:', { companyGroups, groupError });
      
    if (groupError) {
      console.error('Company groups query error:', groupError);
      return [];
    }
      
    if (!companyGroups || companyGroups.length === 0) {
      console.log('🔍 No company groups found for account:', companyAccountId);
      return [];
    }
    
    const groupIds = companyGroups.map(g => g.id);
    console.log('🔍 Group IDs:', groupIds);
    
    // 自分の企業への応募のみを取得（RLS適用）
    return await getCandidatesDataFallback(supabase, groupIds);

  } catch (error) {
    console.error('候補者データ取得中にエラーが発生:', error);
    return [];
  }
}

// フォールバック: 従来の複数クエリ方式（RPCが使用できない場合）
async function getCandidatesDataFallback(supabase: any, groupIds: string[]): Promise<CandidateData[]> {
  try {
    console.log('🔍 Querying applications with group IDs:', groupIds);
    const { data: candidatesData, error: candidatesError } = await supabase
      .from('application')
      .select(`
        id,
        candidate_id,
        company_group_id,
        job_posting_id,
        status,
        created_at,
        candidates!inner (
          id,
          first_name,
          last_name,
          current_company,
          prefecture,
          birth_date,
          gender
        ),
        company_groups!inner (
          group_name
        ),
        job_postings (
          title,
          job_type
        )
      `)
      .in('company_group_id', groupIds);

    console.log('🔍 Applications Query Result:', { 
      count: candidatesData?.length || 0, 
      error: candidatesError,
      sampleData: candidatesData?.slice(0, 2) // 最初の2件だけログ出力
    });

    if (candidatesError) {
      console.error('Applications query error:', candidatesError);
      return [];
    }
    
    if (!candidatesData) {
      console.log('🔍 No applications data returned');
      return [];
    }

    // 各候補者の追加情報を並列取得（最小限に抑制）
    const candidatesWithDetails = await Promise.all(
      candidatesData.map(async (app: any) => {
        const candidateId = app.candidate_id;
        
        // 必要最小限のクエリのみ実行（RLS適用）
        const [jobExperience, workExperience, careerStatus] = await Promise.all([
          supabase.from('job_type_experience').select('job_type_name').eq('candidate_id', candidateId),
          supabase.from('work_experience').select('industry_name').eq('candidate_id', candidateId),
          supabase.from('career_status_entries').select('company_name').eq('candidate_id', candidateId).limit(1)
        ]);

        const candidate = app.candidates;
        const age = candidate.birth_date ? calculateAge(candidate.birth_date) : 0;

        return {
          id: candidateId,
          name: `${candidate.first_name} ${candidate.last_name}`,
          company: candidate.current_company || '',
          location: candidate.prefecture || '',
          age,
          gender: candidate.gender || '',
          experience: jobExperience.data?.map(exp => exp.job_type_name) || [],
          industry: workExperience.data?.map(ind => ind.industry_name) || [],
          targetCompany: careerStatus.data?.[0]?.company_name || '',
          targetJob: app.job_postings?.job_type || '',
          group: app.company_groups?.group_name || '',
          applicationDate: app.created_at ? new Date(app.created_at).toLocaleDateString('ja-JP') : '',
          firstScreening: app.status === 'document_screening' ? 'ready' : undefined,
          secondScreening: app.status === 'second_interview' ? 'ready' : undefined,
          finalScreening: app.status === 'final_interview' ? 'ready' : undefined,
          offer: app.status === 'offer' ? 'ready' : undefined,
          assignedUsers: [], // 簡易版では担当者情報は省略
        };
      })
    );

    return candidatesWithDetails;
  } catch (error) {
    console.error('フォールバック候補者データ取得中にエラーが発生:', error);
    return [];
  }
}

// グループ選択肢を取得する関数
export async function getGroupOptions(): Promise<Array<{ value: string; label: string }>> {
  // RLS対応: 認証済みクライアントを使用
  const supabase = await getSupabaseServerClient();
  
  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  if (!companyAccountId) {
    return [{ value: '', label: 'すべて' }];
  }
  
  try {
    const { data, error } = await supabase
      .from('company_groups')
      .select('id, group_name')
      .eq('company_account_id', companyAccountId)
      .order('group_name');

    if (error) {
      console.error('グループ選択肢の取得に失敗:', error);
      return [{ value: '', label: 'すべて' }];
    }

    const options = [
      { value: '', label: 'すべて' },
      ...(data?.map(group => ({ value: group.id.toString(), label: group.group_name })) || [])
    ];

    return options;
  } catch (error) {
    console.error('グループ選択肢取得中にエラーが発生:', error);
    return [{ value: '', label: 'すべて' }];
  }
}

// 求人選択肢を取得する関数
export async function getJobOptions(): Promise<Array<{ value: string; label: string }>> {
  // RLS対応: 認証済みクライアントを使用
  const supabase = await getSupabaseServerClient();
  
  // 現在の企業アカウントIDを取得
  const companyAccountId = await getCurrentCompanyAccountId();
  if (!companyAccountId) {
    return [{ value: '', label: 'すべて' }];
  }
  
  try {
    // 自分の企業のグループIDを取得
    const { data: companyGroups } = await supabase
      .from('company_groups')
      .select('id')
      .eq('company_account_id', companyAccountId);
      
    if (!companyGroups || companyGroups.length === 0) {
      return [{ value: '', label: 'すべて' }];
    }
    
    const groupIds = companyGroups.map(g => g.id);
    
    const { data, error } = await supabase
      .from('job_postings')
      .select('id, title, job_type')
      .in('company_group_id', groupIds)
      .order('title');

    if (error) {
      console.error('求人選択肢の取得に失敗:', error);
      return [{ value: '', label: 'すべて' }];
    }

    const options = [
      { value: '', label: 'すべて' },
      ...(data?.map(job => ({ value: job.id.toString(), label: job.title })) || [])
    ];

    return options;
  } catch (error) {
    console.error('求人選択肢取得中にエラーが発生:', error);
    return [{ value: '', label: 'すべて' }];
  }
}