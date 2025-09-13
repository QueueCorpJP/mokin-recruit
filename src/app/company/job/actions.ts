'use server'

import { createClient } from '@/lib/supabase/server';
import { requireCompanyAuthForAction } from '@/lib/auth/server';
import { unstable_cache, revalidateTag } from 'next/cache';

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

// 求人一覧取得の内部実装（キャッシュ可能版）
async function _getCompanyJobs(params: {
  status?: string;
  groupId?: string;
  scope?: string;
  search?: string;
}, companyAccountId: string, supabase: any) {
  try {
    if (process.env.NODE_ENV === 'development') console.log('[_getCompanyJobs] Fetching company jobs data for company:', companyAccountId);

    // 基本クエリ：同じ会社アカウントの求人のみ（グループ情報もJOINで取得）
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
        company_group_id,
        company_groups (
          id,
          group_name
        )
      `
      )
      .eq('company_account_id', companyAccountId)
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
      const searchTerm = params.search.trim();
      if (searchTerm) {
        query = query.or(
          `title.ilike.%${searchTerm}%,job_type.cs.{${searchTerm}},industry.cs.{${searchTerm}}`
        );
      }
    }

    const { data: jobs, error: jobsError } = await query;

    if (jobsError) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to fetch jobs:', {
        error: jobsError,
        message: jobsError.message,
        details: jobsError.details,
        hint: jobsError.hint,
        code: jobsError.code,
        companyAccountId
      });
      return { success: false, error: `求人情報の取得に失敗しました: ${jobsError.message}` };
    }

    // レスポンス用にデータを整形（JOINされたグループ情報を使用）
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
      groupName: (job.company_groups as any)?.group_name || 'グループ',
      groupId: job.company_group_id,
      createdAt: job.created_at,
      updatedAt: job.updated_at,
      publishedAt: job.published_at,
    }));

    return { success: true, data: formattedJobs };
  } catch (e: any) {
    if (process.env.NODE_ENV === 'development') console.error('Company jobs error:', e);
    return { success: false, error: e.message };
  }
}

// 新規求人作成
export async function createJob(data: any) {
  try {
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const { 
      companyUserId: actualUserId, 
      companyAccountId: companyAccountId 
    } = authResult.data;
    const supabase = await createClient();

    // 利用可能なグループを確認
    const { data: availableGroups } = await supabase
      .from('company_groups')
      .select('id, group_name')
      .eq('company_account_id', companyAccountId);

    let finalCompanyGroupId = data.company_group_id;
    if (!finalCompanyGroupId || !availableGroups?.some(group => group.id === data.company_group_id)) {
      // デフォルトグループまたは最初のグループを使用
      finalCompanyGroupId = availableGroups?.[0]?.id || actualUserId;
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
          
          // ファイル拡張子の決定（SVGを含む）
          let fileExtension;
          if (contentType.includes('jpeg')) {
            fileExtension = 'jpg';
          } else if (contentType.includes('svg')) {
            fileExtension = 'svg';
          } else {
            fileExtension = contentType.split('/')[1];
          }
          
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
        if (process.env.NODE_ENV === 'development') console.error('Image upload process failed:', error);
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
      company_account_id: companyAccountId,
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
      if (process.env.NODE_ENV === 'development') console.error('Supabase insert error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: insertResult };
  } catch (e: any) {
    if (process.env.NODE_ENV === 'development') console.error('Job creation error:', e);
    return { success: false, error: e.message };
  }
}

// 求人情報取得（編集用）
export async function getJobForEdit(jobId: string) {
  try {
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const supabase = await createClient();

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

// 求人詳細表示用（job_idベース）
export async function getJobDetail(jobId: string) {
  try {
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const { companyAccountId: companyAccountId } = authResult.data;
    const supabase = await createClient();

    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_groups (
          id,
          group_name
        )
      `)
      .eq('id', jobId)
      .eq('company_account_id', companyAccountId)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data) {
      return { success: false, error: '求人情報が見つかりません' };
    }

    // レスポンス用にデータを整形
    const formattedJob = {
      id: data.id,
      title: data.title,
      jobDescription: data.job_description,
      positionSummary: data.position_summary,
      requiredSkills: data.required_skills,
      preferredSkills: data.preferred_skills,
      salaryMin: data.salary_min,
      salaryMax: data.salary_max,
      salaryNote: data.salary_note,
      employmentType: data.employment_type,
      workLocation: data.work_location || [],
      locationNote: data.location_note,
      employmentTypeNote: data.employment_type_note,
      workingHours: data.working_hours,
      overtimeInfo: data.overtime_info,
      holidays: data.holidays,
      remoteWorkAvailable: data.remote_work_available,
      jobType: data.job_type || [],
      industry: data.industry || [],
      selectionProcess: data.selection_process,
      appealPoints: data.appeal_points || [],
      smokingPolicy: data.smoking_policy,
      smokingPolicyNote: data.smoking_policy_note,
      requiredDocuments: data.required_documents || [],
      internalMemo: data.internal_memo,
      publicationType: data.publication_type,
      imageUrls: data.image_urls || [],
      groupName: (data.company_groups as any)?.group_name || 'グループ',
      groupId: data.company_group_id,
      status: data.status,
      applicationDeadline: data.application_deadline,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      publishedAt: data.published_at,
    };

    return { success: true, data: formattedJob };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// 求人情報更新
export async function updateJob(jobId: string, updateData: any) {
  try {
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const supabase = await createClient();

    // 画像処理
    let imageUrls: string[] | undefined = undefined;
    if (updateData.images && Array.isArray(updateData.images) && updateData.images.length > 0) {
      // 既存のURL（文字列）と新規画像データ（オブジェクト）を分離
      const existingUrls: string[] = [];
      const newImageData: any[] = [];
      
      updateData.images.forEach((item: any) => {
        if (typeof item === 'string') {
          // 既存の画像URL
          existingUrls.push(item);
        } else if (item && typeof item === 'object' && item.data) {
          // 新規画像データ
          newImageData.push(item);
        }
      });
      
      // 新規画像データがある場合のみアップロード処理を実行
      let uploadedUrls: string[] = [];
      if (newImageData.length > 0) {
        try {
          const uploadPromises = newImageData.map(async (imageData: any, index: number) => {
          // 画像データ構造の検証
          let base64Data, contentType;
          
          if (imageData.data && imageData.contentType) {
            // 期待される構造: { data: base64string, contentType: string }
            base64Data = imageData.data;
            contentType = imageData.contentType;
          } else if (typeof imageData === 'string') {
            // base64文字列のみの場合（デフォルトでjpegとして扱う）
            base64Data = imageData;
            contentType = 'image/jpeg';
          } else {
            if (process.env.NODE_ENV === 'development') console.error('Invalid image data structure:', imageData);
            throw new Error('画像データの形式が正しくありません');
          }

          if (!base64Data) {
            if (process.env.NODE_ENV === 'development') console.error('Missing base64Data in imageData:', imageData);
            throw new Error('画像データが見つかりません');
          }

          const buffer = Buffer.from(base64Data, 'base64');
          
          const timestamp = Date.now();
          const randomSuffix = Math.random().toString(36).substring(2, 15);
          
          // ファイル拡張子の決定（SVGを含む）
          let fileExtension;
          if (contentType.includes('jpeg')) {
            fileExtension = 'jpg';
          } else if (contentType.includes('svg')) {
            fileExtension = 'svg';
          } else {
            fileExtension = contentType.split('/')[1];
          }
          
          const fileName = `job-${jobId}-${timestamp}-${index}-${randomSuffix}.${fileExtension}`;
          
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
          
          uploadedUrls = await Promise.all(uploadPromises);
        } catch (error) {
          if (process.env.NODE_ENV === 'development') console.error('Image upload process failed:', error);
          return { 
            success: false, 
            error: `画像のアップロードに失敗しました: ${error instanceof Error ? error.message : String(error)}` 
          };
        }
      }
      
      // 既存のURLと新規アップロードされたURLを結合
      imageUrls = [...existingUrls, ...uploadedUrls];
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
    
    const mappedEmploymentType = updateData.employment_type ? 
      (employmentTypeMapping[updateData.employment_type] || updateData.employment_type) : 
      undefined;

    // 更新用データの準備（idフィールドとUI用の一時フィールドを除外）
    const { id, _existingImages, ...updateDataWithoutId } = updateData;
    const finalUpdateData: any = {
      ...updateDataWithoutId,
      updated_at: new Date().toISOString()
    };

    // camelCase -> snake_case のマッピング
    if (updateData.applicationDeadline !== undefined) {
      finalUpdateData.application_deadline = updateData.applicationDeadline || null;
      delete finalUpdateData.applicationDeadline;
    }
    
    if (updateData.employmentType !== undefined) {
      finalUpdateData.employment_type = updateData.employmentType;
      delete finalUpdateData.employmentType;
    }
    
    if (updateData.employmentTypeNote !== undefined) {
      finalUpdateData.employment_type_note = updateData.employmentTypeNote;
      delete finalUpdateData.employmentTypeNote;
    }
    
    if (updateData.jobDescription !== undefined) {
      finalUpdateData.job_description = updateData.jobDescription;
      delete finalUpdateData.jobDescription;
    }
    
    if (updateData.positionSummary !== undefined) {
      finalUpdateData.position_summary = updateData.positionSummary;
      delete finalUpdateData.positionSummary;
    }
    
    if (updateData.requiredSkills !== undefined) {
      finalUpdateData.required_skills = updateData.requiredSkills;
      delete finalUpdateData.requiredSkills;
    }
    
    if (updateData.preferredSkills !== undefined) {
      finalUpdateData.preferred_skills = updateData.preferredSkills;
      delete finalUpdateData.preferredSkills;
    }
    
    if (updateData.salaryMin !== undefined) {
      finalUpdateData.salary_min = updateData.salaryMin;
      delete finalUpdateData.salaryMin;
    }
    
    if (updateData.salaryMax !== undefined) {
      finalUpdateData.salary_max = updateData.salaryMax;
      delete finalUpdateData.salaryMax;
    }
    
    if (updateData.salaryNote !== undefined) {
      finalUpdateData.salary_note = updateData.salaryNote;
      delete finalUpdateData.salaryNote;
    }
    
    if (updateData.locationNote !== undefined) {
      finalUpdateData.location_note = updateData.locationNote;
      delete finalUpdateData.locationNote;
    }
    
    if (updateData.workingHours !== undefined) {
      finalUpdateData.working_hours = updateData.workingHours;
      delete finalUpdateData.workingHours;
    }
    
    if (updateData.overtimeInfo !== undefined) {
      finalUpdateData.overtime_info = updateData.overtimeInfo;
      delete finalUpdateData.overtimeInfo;
    }
    
    if (updateData.selectionProcess !== undefined) {
      finalUpdateData.selection_process = updateData.selectionProcess;
      delete finalUpdateData.selectionProcess;
    }
    
    if (updateData.smokingPolicy !== undefined) {
      finalUpdateData.smoking_policy = updateData.smokingPolicy;
      delete finalUpdateData.smokingPolicy;
    }
    
    if (updateData.smokingPolicyNote !== undefined) {
      finalUpdateData.smoking_policy_note = updateData.smokingPolicyNote;
      delete finalUpdateData.smokingPolicyNote;
    }
    
    if (updateData.internalMemo !== undefined) {
      finalUpdateData.internal_memo = updateData.internalMemo;
      delete finalUpdateData.internalMemo;
    }
    
    if (updateData.publicationType !== undefined) {
      finalUpdateData.publication_type = updateData.publicationType;
      delete finalUpdateData.publicationType;
    }
    
    if (updateData.remoteWorkAvailable !== undefined) {
      finalUpdateData.remote_work_available = updateData.remoteWorkAvailable;
      delete finalUpdateData.remoteWorkAvailable;
    }
    
    if (updateData.groupId !== undefined) {
      finalUpdateData.company_group_id = updateData.groupId;
      delete finalUpdateData.groupId;
    }

    // その他の残りのcamelCase -> snake_caseマッピング
    if (updateData.images !== undefined) {
      // imagesは画像処理で既に処理されているため削除のみ
      delete finalUpdateData.images;
    }
    
    if (updateData.overtimeMemo !== undefined) {
      finalUpdateData.overtime_info = updateData.overtimeMemo;
      delete finalUpdateData.overtimeMemo;
    }
    
    if (updateData.memo !== undefined) {
      finalUpdateData.internal_memo = updateData.memo;
      delete finalUpdateData.memo;
    }
    
    if (updateData.smoke !== undefined) {
      finalUpdateData.smoking_policy = updateData.smoke;
      delete finalUpdateData.smoke;
    }
    
    if (updateData.smokeNote !== undefined) {
      finalUpdateData.smoking_policy_note = updateData.smokeNote;
      delete finalUpdateData.smokeNote;
    }
    
    if (updateData.resumeRequired !== undefined) {
      finalUpdateData.required_documents = ensureArray(updateData.resumeRequired);
      delete finalUpdateData.resumeRequired;
    }
    
    if (updateData.skills !== undefined) {
      finalUpdateData.required_skills = updateData.skills;
      delete finalUpdateData.skills;
    }
    
    if (updateData.otherRequirements !== undefined) {
      finalUpdateData.preferred_skills = updateData.otherRequirements;
      delete finalUpdateData.otherRequirements;
    }
    
    if (updateData.locations !== undefined) {
      finalUpdateData.work_location = ensureArray(updateData.locations);
      delete finalUpdateData.locations;
    }
    
    if (updateData.overtime !== undefined) {
      finalUpdateData.overtime_info = updateData.overtime;
      delete finalUpdateData.overtime;
    }
    
    if (updateData.appealPoints !== undefined) {
      finalUpdateData.appeal_points = ensureArray(updateData.appealPoints);
      delete finalUpdateData.appealPoints;
    }
    
    if (updateData.jobTypes !== undefined) {
      finalUpdateData.job_type = ensureArray(updateData.jobTypes);
      delete finalUpdateData.jobTypes;
    }
    
    if (updateData.job_types !== undefined) {
      finalUpdateData.job_type = ensureArray(updateData.job_types);
      delete finalUpdateData.job_types;
    }
    
    if (updateData.industries !== undefined) {
      finalUpdateData.industry = ensureArray(updateData.industries);
      delete finalUpdateData.industries;
    }
    
    if (updateData.workLocation !== undefined) {
      finalUpdateData.work_location = ensureArray(updateData.workLocation);
      delete finalUpdateData.workLocation;
    }
    
    if (updateData.work_location !== undefined) {
      finalUpdateData.work_location = ensureArray(updateData.work_location);
      delete finalUpdateData.work_location;
    }
    
    if (updateData.imageUrls !== undefined) {
      finalUpdateData.image_urls = updateData.imageUrls;
      delete finalUpdateData.imageUrls;
    }
    
    if (updateData.image_urls !== undefined) {
      finalUpdateData.image_urls = updateData.image_urls;
      delete finalUpdateData.image_urls;
    }
    
    if (updateData.requiredDocuments !== undefined) {
      finalUpdateData.required_documents = ensureArray(updateData.requiredDocuments);
      delete finalUpdateData.requiredDocuments;
    }
    
    if (updateData.required_documents !== undefined) {
      finalUpdateData.required_documents = ensureArray(updateData.required_documents);
      delete finalUpdateData.required_documents;
    }
    
    // Additional snake_case fields that might come from editData
    if (updateData.working_hours !== undefined) {
      finalUpdateData.working_hours = updateData.working_hours;
      delete finalUpdateData.working_hours;
    }
    
    if (updateData.overtime_info !== undefined) {
      finalUpdateData.overtime_info = updateData.overtime_info;
      delete finalUpdateData.overtime_info;
    }
    
    if (updateData.selection_process !== undefined) {
      finalUpdateData.selection_process = updateData.selection_process;
      delete finalUpdateData.selection_process;
    }
    
    if (updateData.smoking_policy !== undefined) {
      finalUpdateData.smoking_policy = updateData.smoking_policy;
      delete finalUpdateData.smoking_policy;
    }
    
    if (updateData.smoking_policy_note !== undefined) {
      finalUpdateData.smoking_policy_note = updateData.smoking_policy_note;
      delete finalUpdateData.smoking_policy_note;
    }
    
    if (updateData.internal_memo !== undefined) {
      finalUpdateData.internal_memo = updateData.internal_memo;
      delete finalUpdateData.internal_memo;
    }
    
    if (updateData.publication_type !== undefined) {
      finalUpdateData.publication_type = updateData.publication_type;
      delete finalUpdateData.publication_type;
    }
    
    if (updateData.remote_work_available !== undefined) {
      finalUpdateData.remote_work_available = updateData.remote_work_available;
      delete finalUpdateData.remote_work_available;
    }
    
    if (updateData.location_note !== undefined) {
      finalUpdateData.location_note = updateData.location_note;
      delete finalUpdateData.location_note;
    }
    
    if (updateData.employment_type_note !== undefined) {
      finalUpdateData.employment_type_note = updateData.employment_type_note;
      delete finalUpdateData.employment_type_note;
    }
    
    if (updateData.appeal_points !== undefined) {
      finalUpdateData.appeal_points = ensureArray(updateData.appeal_points);
      delete finalUpdateData.appeal_points;
    }

    // 画像URLが生成された場合のみ追加
    if (imageUrls) {
      finalUpdateData.image_urls = imageUrls;
    }

    // 雇用形態のマッピングを適用
    if (mappedEmploymentType) {
      finalUpdateData.employment_type = mappedEmploymentType;
    }

    // 配列フィールドの処理（snake_caseのみ - 上でマッピングされていないもののみ）
    if (updateData.work_locations) {
      finalUpdateData.work_location = ensureArray(updateData.work_locations);
      delete finalUpdateData.work_locations;
    }
    
    // camelCaseフィールドは上で既に削除されているため、ここでは処理しない

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
        finalUpdateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('job_postings')
      .update(finalUpdateData)
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

// キャッシュ付きの求人一覧取得（公開関数）
export async function getCompanyJobs(params: {
  status?: string;
  groupId?: string;
  scope?: string;
  search?: string;
}) {
  try {
    // 認証チェック（キャッシュ外で実行）
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return { success: false, error: authResult.error };
    }

    const { companyAccountId } = authResult.data;
    
    // Supabaseクライアントを作成（キャッシュ外で実行）
    const supabase = await createClient();

    // キャッシュ付きで内部関数を呼び出し（認証済みのcompanyAccountIdとsupabaseクライアントを渡す）
    const getCachedJobs = unstable_cache(
      (params: any, companyAccountId: string, supabase: any) => _getCompanyJobs(params, companyAccountId, supabase),
      [`company-jobs-${companyAccountId}`, JSON.stringify(params)],
      {
        tags: [`company-jobs-${companyAccountId}`],
        revalidate: 30, // 30秒間キャッシュ
      }
    );

    return await getCachedJobs(params, companyAccountId, supabase);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') console.error('getCompanyJobs error:', error);
    return { success: false, error: error.message };
  }
}

// キャッシュ無効化関数
export async function revalidateCompanyJobs() {
  try {
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) {
      return;
    }

    const { companyAccountId } = authResult.data;
    revalidateTag(`company-jobs-${companyAccountId}`);
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Failed to revalidate company jobs cache:', error);
  }
}

// 簡単なメモリキャッシュ
const groupsCache = new Map<string, { data: any; timestamp: number }>();
const GROUPS_CACHE_TTL = 2 * 60 * 1000; // 2分

// グループ一覧取得
export async function getCompanyGroups() {
  try {
    // 統一的な認証チェック
    const authResult = await requireCompanyAuthForAction();
    if (process.env.NODE_ENV === 'development') console.log('🔍 getCompanyGroups - Auth result:', authResult);
    if (!authResult.success) {
      if (process.env.NODE_ENV === 'development') console.log('❌ getCompanyGroups - Auth failed:', authResult.error);
      return { success: false, error: authResult.error };
    }

    const { companyUserId, companyAccountId } = authResult.data;

    // キャッシュキーの生成（ユーザー固有に）
    const cacheKey = `${companyAccountId}-${companyUserId}`;
    const cached = groupsCache.get(cacheKey);
    
    // 期限切れキャッシュを即座に削除
    if (cached && Date.now() - cached.timestamp >= GROUPS_CACHE_TTL) {
      groupsCache.delete(cacheKey);
    } else if (cached) {
      return cached.data;
    }
    const supabase = await createClient();

    // ユーザーが権限を持つグループのみ取得（検索機能と統一）
    const { data: userPermissions, error } = await supabase
      .from('company_user_group_permissions')
      .select(`
        company_group:company_groups (
          id,
          group_name,
          description
        )
      `)
      .eq('company_user_id', companyUserId);

    if (error) {
      return { success: false, error: error.message };
    }

    // グループ形式に変換
    const formattedGroups = (userPermissions || [])
      .map((perm: any) => perm.company_group)
      .filter((group: any) => group && group.id && group.group_name)
      .map((group: any) => ({
        id: group.id,
        group_name: group.group_name,
        description: group.description || ''
      }));

    const result = { success: true, data: formattedGroups };

    // 成功した場合のみキャッシュに保存
    groupsCache.set(cacheKey, { data: result, timestamp: Date.now() });
    
    // キャッシュサイズを制限（メモリ使用量対策）
    if (groupsCache.size > 20) {
      const oldestKey = groupsCache.keys().next().value;
      if (oldestKey) {
        groupsCache.delete(oldestKey);
      }
    }

    return result;
  } catch (e: any) {
    if (process.env.NODE_ENV === 'development') console.error('Company groups error:', e);
    return { success: false, error: e.message };
  }
}