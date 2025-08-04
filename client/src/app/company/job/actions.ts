'use server'

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { SessionService } from '@/lib/server/core/services/SessionService';
import { cookies } from 'next/headers';

// 求人データの型定義
interface JobPosting {
  id: string;
  title: string;
  jobType: string[];
  industry: string[];
  employmentType: string;
  workLocation: string[];
  salaryMin: number | null;
  salaryMax: number | null;
  status: string;
  groupName: string;
  groupId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  publicationType: string;
  internalMemo: string;
}

// 求人一覧取得
export async function getCompanyJobs(params: {
  status?: string;
  groupId?: string;
  scope?: string;
  search?: string;
}) {
  try {
    const sessionService = new SessionService();
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return { success: false, error: '認証トークンがありません' };
    }

    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return { success: false, error: '認証エラー' };
    }

    const supabase = getSupabaseAdminClient();

    // セッション認証のユーザーIDとcompany_usersのIDは異なるため、メールアドレスで検索
    const { data: userByEmail, error: emailError } = await supabase
      .from('company_users')
      .select('id, company_account_id, email, full_name')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();

    if (emailError || !userByEmail) {
      return { success: false, error: '企業アカウント情報の取得に失敗しました' };
    }

    const userCompanyAccountId = userByEmail.company_account_id;

    // 基本クエリ：同じ会社アカウントの求人のみ
    let query = supabase
      .from('job_postings')
      .select(
        `
        id,
        title,
        job_description,
        required_skills,
        preferred_skills,
        salary_min,
        salary_max,
        employment_type,
        work_location,
        remote_work_available,
        job_type,
        industry,
        status,
        application_deadline,
        created_at,
        updated_at,
        published_at,
        position_summary,
        salary_note,
        location_note,
        employment_type_note,
        working_hours,
        overtime_info,
        holidays,
        selection_process,
        appeal_points,
        smoking_policy,
        smoking_policy_note,
        required_documents,
        internal_memo,
        publication_type,
        image_urls,
        company_group_id
      `
      )
      .eq('company_account_id', userCompanyAccountId)
      .order('updated_at', { ascending: false })
      .order('created_at', { ascending: false });

    // ステータスフィルター
    if (params.status && params.status !== 'すべて') {
      const statusMap: Record<string, string> = {
        下書き: 'DRAFT',
        '掲載待ち（承認待ち）': 'PENDING_APPROVAL',
        掲載済: 'PUBLISHED',
        停止: 'CLOSED',
      };
      if (statusMap[params.status]) {
        query = query.eq('status', statusMap[params.status]);
      }
    }

    // グループフィルター
    if (params.groupId && params.groupId !== 'すべて') {
      query = query.eq('company_group_id', params.groupId);
    }

    // 公開範囲フィルター
    if (params.scope && params.scope !== 'すべて') {
      if (params.scope === '公開停止') {
        query = query.eq('status', 'CLOSED');
      } else {
        const scopeMap: Record<string, string> = {
          '一般公開': 'public',
          '登録会員限定': 'members',
          'スカウト限定': 'scout'
        };
        if (scopeMap[params.scope]) {
          query = query.eq('publication_type', scopeMap[params.scope]);
        }
      }
    }

    // キーワード検索
    if (params.search) {
      query = query.or(
        `title.ilike.%${params.search}%,job_type.ilike.%${params.search}%,job_types.cs.{${params.search}},industries.cs.{${params.search}}`
      );
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      console.error('Failed to fetch jobs:', jobsError);
      return { success: false, error: '求人情報の取得に失敗しました' };
    }

    // グループ名を取得
    const groupIds = [
      ...new Set(jobs?.map(job => job.company_group_id).filter(Boolean)),
    ];
    let groupNames: Record<string, string> = {};

    if (groupIds.length > 0) {
      const { data: users, error: usersError } = await supabase
        .from('company_users')
        .select('id, full_name')
        .in('id', groupIds);

      if (!usersError && users) {
        groupNames = users.reduce(
          (acc, user) => {
            acc[user.id] = user.full_name || 'ユーザー';
            return acc;
          },
          {} as Record<string, string>
        );
      }
    }

    // レスポンス用にデータを整形
    const formattedJobs = (jobs || []).map(job => ({
      id: job.id,
      title: job.title,
      jobDescription: job.job_description,
      requiredSkills: job.required_skills,
      preferredSkills: job.preferred_skills,
      salaryMin: job.salary_min,
      salaryMax: job.salary_max,
      employmentType: job.employment_type,
      workLocation: job.work_location || [],
      remoteWorkAvailable: job.remote_work_available,
      jobType: job.job_type || [],
      industry: job.industry || [],
      status: job.status,
      applicationDeadline: job.application_deadline,
      positionSummary: job.position_summary,
      salaryNote: job.salary_note,
      locationNote: job.location_note,
      employmentTypeNote: job.employment_type_note,
      workingHours: job.working_hours,
      overtimeInfo: job.overtime_info,
      holidays: job.holidays,
      selectionProcess: job.selection_process,
      appealPoints: job.appeal_points || [],
      smokingPolicy: job.smoking_policy,
      smokingPolicyNote: job.smoking_policy_note,
      requiredDocuments: job.required_documents || [],
      internalMemo: job.internal_memo,
      publicationType: job.publication_type,
      imageUrls: job.image_urls || [],
      groupName: groupNames[job.company_group_id] || 'ユーザー',
      groupId: job.company_group_id,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      publishedAt: job.published_at,
    }));

    return { success: true, data: formattedJobs };
  } catch (e: any) {
    console.error('Company jobs error:', e);
    return { success: false, error: e.message };
  }
}

// 新規求人作成
export async function createJob(data: any) {
  try {
    const sessionService = new SessionService();
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return { success: false, error: '認証トークンがありません' };
    }

    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return { success: false, error: '認証エラー' };
    }

    const supabase = getSupabaseAdminClient();

    // ユーザー情報取得
    const { data: userByEmail, error: emailError } = await supabase
      .from('company_users')
      .select('id, company_account_id, email, full_name')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();

    if (emailError || !userByEmail) {
      return { success: false, error: '企業アカウント情報の取得に失敗しました' };
    }

    const actualUserId = userByEmail.id;
    const userCompanyAccountId = userByEmail.company_account_id;

    // 利用可能なグループを確認
    const { data: availableUsers } = await supabase
      .from('company_users')
      .select('id, email, full_name')
      .eq('company_account_id', userCompanyAccountId);

    let finalCompanyGroupId = actualUserId;
    if (data.company_group_id && availableUsers?.some(user => user.id === data.company_group_id)) {
      finalCompanyGroupId = data.company_group_id;
    }

    // 画像処理
    let imageUrls: string[] = [];
    if (data.images && Array.isArray(data.images) && data.images.length > 0) {
      try {
        const uploadPromises = data.images.map(async (imageData: any, index: number) => {
          const { data: base64Data, contentType } = imageData;
          const buffer = Buffer.from(base64Data, 'base64');
          
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 15);
          const fileExtension = contentType.includes('jpeg') ? 'jpg' : contentType.split('/')[1];
          const fileName = `job-${finalCompanyGroupId}-${timestamp}-${index}-${randomSuffix}.${fileExtension}`;
          
          const { data: uploadData, error } = await supabase.storage
            .from('job-images')
            .upload(fileName, buffer, {
              contentType: contentType,
              upsert: false
            });
          
          if (error) {
            throw new Error(`画像のアップロードに失敗しました: ${error.message}`);
          }
          
          const { data: urlData } = supabase.storage
            .from('job-images')
            .getPublicUrl(fileName);
          
          return urlData.publicUrl;
        });
        
        imageUrls = await Promise.all(uploadPromises);
      } catch (error) {
        console.error('Image upload process failed:', error);
        return { 
          success: false, 
          error: `画像のアップロードに失敗しました: ${error instanceof Error ? error.message : String(error)}` 
        };
      }
    }

    // 配列フィールドの処理
    const ensureArray = (value: any): string[] => {
      if (Array.isArray(value)) {
        return value.filter(v => v && typeof v === 'string');
      }
      if (value && typeof value === 'string') {
        return [value];
      }
      return [];
    };

    // テキストフィールドの処理
    const ensureText = (value: any): string | null => {
      if (typeof value === 'string') {
        return value || null;
      }
      if (Array.isArray(value)) {
        const textResult = value.filter(v => v && typeof v === 'string').join(', ');
        return textResult || null;
      }
      return null;
    };

    // 雇用形態の日本語→英語マッピング
    const employmentTypeMapping: Record<string, string> = {
      '正社員': 'FULL_TIME',
      '契約社員': 'CONTRACT',
      '派遣社員': 'CONTRACT',
      'アルバイト・パート': 'PART_TIME',
      '業務委託': 'CONTRACT',
      'インターン': 'INTERN'
    };
    
    const mappedEmploymentType = employmentTypeMapping[data.employment_type] || 'FULL_TIME';

    const insertData = {
      company_account_id: userCompanyAccountId,
      company_group_id: finalCompanyGroupId,
      title: data.title || '未設定',
      job_description: data.job_description || '未設定',
      position_summary: data.position_summary || null,
      required_skills: ensureText(data.required_skills),
      preferred_skills: ensureText(data.preferred_skills),
      salary_min: data.salary_min !== undefined ? Number(data.salary_min) : null,
      salary_max: data.salary_max !== undefined ? Number(data.salary_max) : null,
      salary_note: data.salary_note || null,
      employment_type: mappedEmploymentType,
      work_location: ensureArray(data.work_locations),
      location_note: data.location_note || null,
      employment_type_note: data.employment_type_note || null,
      working_hours: data.working_hours || null,
      overtime: data.overtime || 'あり',
      overtime_info: data.overtime_info || null,
      holidays: data.holidays || null,
      remote_work_available: data.remote_work_available === true || data.remote_work_available === 'true',
      job_type: ensureArray(data.job_types),
      industry: ensureArray(data.industries),
      selection_process: data.selection_process || null,
      appeal_points: ensureArray(data.appeal_points),
      smoking_policy: data.smoking_policy || null,
      smoking_policy_note: data.smoking_policy_note || null,
      required_documents: ensureArray(data.required_documents),
      internal_memo: data.internal_memo || null,
      publication_type: data.publication_type || 'public',
      image_urls: imageUrls,
      status: data.status || 'PENDING_APPROVAL',
      application_deadline: data.application_deadline || null,
      published_at: data.published_at || null,
    };

    const { data: insertResult, error } = await supabase.from('job_postings').insert([insertData]);

    if (error) {
      console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: insertResult };
  } catch (e: any) {
    console.error('Job creation error:', e);
    return { success: false, error: e.message };
  }
}

// 求人情報取得（編集用）
export async function getJobForEdit(jobId: string) {
  try {
    const sessionService = new SessionService();
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return { success: false, error: '認証トークンがありません' };
    }

    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return { success: false, error: '認証エラー' };
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: '求人情報が見つかりません' };
    }

    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// 求人情報更新
export async function updateJob(jobId: string, updateData: any) {
  try {
    const sessionService = new SessionService();
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return { success: false, error: '認証トークンがありません' };
    }

    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return { success: false, error: '認証エラー' };
    }

    const supabase = getSupabaseAdminClient();

    // ステータスが'PUBLISHED'に変更される場合、published_atを自動設定
    if (updateData.status === 'PUBLISHED') {
      const { data: currentJob, error: fetchError } = await supabase
        .from('job_postings')
        .select('status, published_at')
        .eq('id', jobId)
        .single();

      if (fetchError) {
        return { success: false, error: fetchError.message };
      }

      if (currentJob.status !== 'PUBLISHED') {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('job_postings')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', jobId)
      .select();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data || data.length === 0) {
      return { success: false, error: '求人情報が見つかりません' };
    }

    return { success: true, data };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// 求人削除（ステータスをCLOSEDに変更）
export async function deleteJob(jobId: string) {
  return updateJob(jobId, { status: 'CLOSED' });
}

// グループ一覧取得
export async function getCompanyGroups() {
  try {
    const sessionService = new SessionService();
    const cookieStore = await cookies();
    const token = cookieStore.get('supabase-auth-token')?.value;

    if (!token) {
      return { success: false, error: '認証トークンがありません' };
    }

    const sessionResult = await sessionService.validateSession(token);
    if (!sessionResult.success || !sessionResult.sessionInfo) {
      return { success: false, error: '認証エラー' };
    }

    const supabase = getSupabaseAdminClient();

    // ユーザー情報取得
    const { data: userByEmail, error: emailError } = await supabase
      .from('company_users')
      .select('id, company_account_id')
      .eq('email', sessionResult.sessionInfo.user.email)
      .single();

    if (emailError || !userByEmail) {
      return { success: false, error: '企業アカウント情報の取得に失敗しました' };
    }

    // 同じcompany_accountに属するユーザー一覧を取得
    const { data: groups, error } = await supabase
      .from('company_users')
      .select('id, email, full_name')
      .eq('company_account_id', userByEmail.company_account_id)
      .order('created_at', { ascending: true });

    if (error) {
      return { success: false, error: error.message };
    }

    // グループ形式に変換
    const formattedGroups = (groups || []).map(user => ({
      id: user.id,
      group_name: user.full_name || user.email,
      description: user.email
    }));

    return { success: true, data: formattedGroups };
  } catch (e: any) {
    console.error('Company groups error:', e);
    return { success: false, error: e.message };
  }
}