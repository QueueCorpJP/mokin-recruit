'use server'

import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { requireCandidateAuthForAction } from '@/lib/auth/server';
import { logger } from '@/lib/server/utils/logger';

interface ApplicationResult {
  success: boolean;
  data?: {
    application_id: string;
    job_title: string;
    status: string;
    applied_at: string;
  };
  error?: string;
  needsAuth?: boolean;
}

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * ファイルアップロード処理
 */
async function uploadFile(file: File, type: 'resume' | 'career', candidateId: string): Promise<UploadResult> {
  try {
    // ファイルサイズチェック（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'ファイルサイズは5MB以下にしてください'
      };
    }

    // ファイル形式チェック
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: 'PDF、Word、画像ファイル（JPEG/PNG/GIF）、テキストファイルのみアップロード可能です'
      };
    }

    // ファイル拡張子を取得
    const getFileExtension = (mimeType: string, fileName: string): string => {
      const mimeToExtension: { [key: string]: string } = {
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'text/plain': '.txt'
      };

      if (mimeToExtension[mimeType]) {
        return mimeToExtension[mimeType];
      }

      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        return fileName.substring(lastDotIndex);
      }

      return '.bin';
    };

    // ファイル名の生成
    const timestamp = new Date().getTime();
    const fileExtension = getFileExtension(file.type, file.name);
    const fileName = `${candidateId}/${type}_${timestamp}${fileExtension}`;

    // Supabase Storageにアップロード
    const supabase = getSupabaseAdminClient();
    const fileBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('applications')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      logger.error('Supabase upload error:', error);
      return {
        success: false,
        error: 'ファイルのアップロードに失敗しました'
      };
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('applications')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl
    };

  } catch (error) {
    logger.error('File upload error:', error);
    return {
      success: false,
      error: 'ファイルのアップロード中にエラーが発生しました'
    };
  }
}

/**
 * 求人応募処理（サーバーアクション）
 */
export async function submitApplication(formData: FormData): Promise<ApplicationResult> {
  logger.info('=== Application submission started ===');
  
  try {

    // FormDataの内容をログに出力（File constructor の代わりにプロパティで判定）
    try {
      const entries = [];
      for (const [key, value] of formData.entries()) {
        entries.push({
          key,
          value: (value && typeof value === 'object' && 'name' in value && 'size' in value) 
            ? `File: ${(value as any).name} (${(value as any).size} bytes)` 
            : String(value)
        });
      }
      logger.info('FormData entries:', entries);
    } catch (error) {
      logger.warn('Could not log FormData entries:', error);
    }

    // FormDataから値を取得
    const jobId = formData.get('jobId') as string;
    const applicationMessage = formData.get('applicationMessage') as string || '求人に応募いたします。';
    
    logger.info('Basic form data:', { jobId, applicationMessage });
    
    // ファイルを取得
    const resumeFiles = formData.getAll('resumeFiles') as File[];
    const careerFiles = formData.getAll('careerFiles') as File[];
    
    // ファイルのバリデーション（サーバー環境では File constructor が存在しないため、プロパティで判定）
    const validResumeFiles = resumeFiles.filter(file => 
      file && 
      typeof file === 'object' && 
      'name' in file && 
      'size' in file && 
      typeof file.size === 'number' && 
      file.size > 0
    );
    const validCareerFiles = careerFiles.filter(file => 
      file && 
      typeof file === 'object' && 
      'name' in file && 
      'size' in file && 
      typeof file.size === 'number' && 
      file.size > 0
    );
    
    logger.info('Files received:', {
      resumeFilesCount: resumeFiles.length,
      careerFilesCount: careerFiles.length,
      validResumeFilesCount: validResumeFiles.length,
      validCareerFilesCount: validCareerFiles.length,
      resumeFileNames: validResumeFiles.map(f => f.name),
      careerFileNames: validCareerFiles.map(f => f.name)
    });

    if (!jobId) {
      logger.error('No jobId provided');
      return {
        success: false,
        error: String('求人IDが必要です')
      };
    }

    // 統一的な認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      logger.warn('Authentication failed:', authResult.error);
      const authErrorResponse = {
        success: false,
        error: String('認証が必要です。ログインしてください。'),
        needsAuth: true
      };
      logger.info('Returning auth error response:', authErrorResponse);
      return authErrorResponse;
    }

    const candidateId = authResult.data.candidateId;
    logger.info(`Application attempt by candidate: ${candidateId}`);

    const supabase = getSupabaseAdminClient();

    // 求人情報取得と応募済みチェックを並列実行
    const [
      { data: jobPosting, error: jobError },
      { data: existingApplication, error: checkError }
    ] = await Promise.all([
      supabase
        .from('job_postings')
        .select(`
          id,
          title,
          company_account_id,
          company_group_id,
          status
        `)
        .eq('id', jobId)
        .maybeSingle(),
      supabase
        .from('application')
        .select('id')
        .eq('candidate_id', candidateId)
        .eq('job_posting_id', jobId)
        .maybeSingle()
    ]);

    if (jobError || !jobPosting) {
      logger.error('Failed to fetch job posting:', jobError);
      return {
        success: false,
        error: String('求人情報が見つかりませんでした')
      };
    }

    if (checkError) {
      logger.error('Failed to check existing application:', checkError);
      return {
        success: false,
        error: String('サーバーエラーが発生しました')
      };
    }

    // 求人がアクティブかどうかチェック
    if (jobPosting.status !== 'PUBLISHED') {
      logger.error('Job not published:', { jobId, status: jobPosting.status });
      return {
        success: false,
        error: String('この求人は現在応募できません')
      };
    }

    if (existingApplication) {
      logger.error('Application already exists:', { candidateId, jobId });
      return {
        success: false,
        error: String('この求人には既に応募済みです')
      };
    }

    // ファイルアップロード処理
    const resumeUrls: string[] = [];
    const careerUrls: string[] = [];

    // 履歴書をアップロード
    logger.info(`Uploading ${validResumeFiles.length} resume files`);
    for (const resumeFile of validResumeFiles) {
      logger.info(`Uploading resume file: ${resumeFile.name}, size: ${resumeFile.size}`);
      const uploadResult = await uploadFile(resumeFile, 'resume', candidateId);
      if (!uploadResult.success) {
        logger.error('Resume upload failed:', uploadResult.error);
        return {
          success: false,
          error: String(uploadResult.error || '履歴書のアップロードに失敗しました')
        };
      }
      if (uploadResult.url) {
        resumeUrls.push(uploadResult.url);
        logger.info(`Resume uploaded successfully: ${uploadResult.url}`);
      }
    }

    // 職務経歴書をアップロード
    logger.info(`Uploading ${validCareerFiles.length} career files`);
    for (const careerFile of validCareerFiles) {
      logger.info(`Uploading career file: ${careerFile.name}, size: ${careerFile.size}`);
      const uploadResult = await uploadFile(careerFile, 'career', candidateId);
      if (!uploadResult.success) {
        logger.error('Career upload failed:', uploadResult.error);
        return {
          success: false,
          error: String(uploadResult.error || '職務経歴書のアップロードに失敗しました')
        };
      }
      if (uploadResult.url) {
        careerUrls.push(uploadResult.url);
        logger.info(`Career uploaded successfully: ${uploadResult.url}`);
      }
    }

    // company_group_idが存在するかチェック、存在しない場合はデフォルトグループを作成
    let validCompanyGroupId = jobPosting.company_group_id;
    
    if (jobPosting.company_group_id) {
      const { data: existingGroup, error: groupCheckError } = await supabase
        .from('company_groups')
        .select('id, company_account_id')
        .eq('id', jobPosting.company_group_id)
        .maybeSingle();
        
      if (groupCheckError || !existingGroup) {
        logger.warn(`Company group ${jobPosting.company_group_id} not found, creating default group`);
        
        const { data: newGroup, error: createGroupError } = await supabase
          .from('company_groups')
          .insert({
            id: jobPosting.company_group_id,
            company_account_id: jobPosting.company_account_id,
            group_name: '採用チーム',
            description: '自動作成された採用チーム'
          })
          .select('id')
          .maybeSingle();
          
        if (createGroupError || !newGroup) {
          logger.error('Failed to create company group:', createGroupError);
          return {
            success: false,
            error: String('企業グループ情報の作成に失敗しました')
          };
        }
        
        validCompanyGroupId = newGroup.id;
      }
    }
    
    // 該当会社の最初のユーザーを取得（applicationテーブル用）
    const { data: companyUser, error: companyUserError } = await supabase
      .from('company_users')
      .select('id')
      .eq('company_account_id', jobPosting.company_account_id)
      .limit(1)
      .maybeSingle();

    if (companyUserError || !companyUser) {
      logger.error('Failed to fetch company user:', companyUserError);
      return {
        success: false,
        error: String('企業ユーザー情報が見つかりませんでした')
      };
    }

    // applicationテーブルに応募情報を保存
    logger.info('Creating application with data:', {
      candidate_id: candidateId,
      job_posting_id: jobId,
      company_account_id: jobPosting.company_account_id,
      company_group_id: validCompanyGroupId,
      company_user_id: companyUser.id,
      resumeUrlsCount: resumeUrls.length,
      careerUrlsCount: careerUrls.length
    });

    const { data: application, error: applicationError } = await supabase
      .from('application')
      .insert({
        candidate_id: candidateId,
        job_posting_id: jobId,
        company_account_id: jobPosting.company_account_id,
        company_group_id: validCompanyGroupId,
        company_user_id: companyUser.id,
        resume_url: resumeUrls.length > 0 ? resumeUrls[0] : null,
        career_history_url: careerUrls.length > 0 ? careerUrls[0] : null,
        application_message: applicationMessage,
        status: 'SENT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .maybeSingle();

    if (applicationError) {
      logger.error('Failed to create application:', applicationError);
      logger.error('Application error details:', {
        message: applicationError.message,
        details: applicationError.details,
        hint: applicationError.hint,
        code: applicationError.code
      });
      return {
        success: false,
        error: String(`応募の送信に失敗しました: ${applicationError.message}`)
      };
    }

    logger.info(`Application created successfully:`, {
      applicationId: application.id,
      candidateId,
      jobPostingId: jobId
    });

    // ルームの作成（応募成功後にメッセージ用のルームを作成）
    logger.info('Creating room for application messaging');
    
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({
        type: 'direct',
        candidate_id: candidateId,
        company_group_id: validCompanyGroupId,
        related_job_posting_id: jobId
      })
      .select('id')
      .single();

    if (roomError) {
      logger.error('Failed to create room:', roomError);
      // ルーム作成失敗してもアプリケーション自体は成功とする
    } else {
      logger.info('Room created successfully:', { roomId: room.id });
    }

    const responseData = {
      success: true,
      data: {
        application_id: String(application.id),
        job_title: String(jobPosting.title),
        status: 'SENT',
        applied_at: String(application.created_at)
      }
    };
    
    logger.info('Returning success response:', responseData);
    return responseData;

  } catch (error) {
    logger.error('Application submission error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Detailed error message:', errorMessage);
    
    const errorResponse = {
      success: false,
      error: String(`サーバーエラーが発生しました: ${errorMessage}`)
    };
    
    logger.info('Returning error response:', errorResponse);
    return errorResponse;
  }
}

/**
 * 求人情報取得（確認画面用）
 */
export async function getJobDetails(jobId: string) {
  try {
    logger.info(`=== Getting job details for jobId: ${jobId} ===`);
    const supabase = getSupabaseAdminClient();

    // デバッグ: jobIdの型と値を確認
    logger.info(`Job ID type: ${typeof jobId}, value: "${jobId}", length: ${jobId?.length}`);

    // まず、ランダムな求人を1つ取得してデータベース接続を確認
    const { data: randomJob, error: randomError } = await supabase
      .from('job_postings')
      .select('id, title, status')
      .limit(1)
      .maybeSingle();
    
    logger.info(`Random job query for connection test:`, { randomJob, randomError });

    // 指定されたIDの求人が存在するかチェック（ステータス制限なし）
    const { data: jobCheck, error: checkError } = await supabase
      .from('job_postings')
      .select('id, status, publication_type')
      .eq('id', jobId)
      .maybeSingle();

    logger.info(`Job check result:`, { 
      jobCheck, 
      checkError,
      queryJobId: jobId,
      foundId: jobCheck?.id,
      idsMatch: jobCheck?.id === jobId
    });

    // もしjobCheckで見つからない場合、すべての求人IDを取得して比較
    if (!jobCheck && !checkError) {
      logger.warn(`Job ${jobId} not found, fetching all job IDs for comparison`);
      const { data: allJobs, error: allJobsError } = await supabase
        .from('job_postings')
        .select('id, title, status, publication_type')
        .limit(10);
      
      logger.info(`All jobs (first 10):`, { allJobs, allJobsError });
      
      if (allJobs) {
        const exactMatch = allJobs.find(job => job.id === jobId);
        const similarIds = allJobs.filter(job => job.id.includes(jobId) || jobId.includes(job.id));
        logger.info(`Exact match: ${exactMatch?.id}, Similar IDs:`, similarIds.map(j => j.id));
      }
    }

    // 求人情報を取得（job detail pageと同じフィルタ条件を適用）
    const { data: jobPosting, error } = await supabase
      .from('job_postings')
      .select(`
        id,
        title,
        job_description,
        required_documents,
        status,
        company_account_id
      `)
      .eq('id', jobId)
      .eq('status', 'PUBLISHED')
      .in('publication_type', ['public', 'members'])
      .maybeSingle();

    logger.info(`Job details query result:`, { jobPosting, error });

    if (error) {
      logger.error('Database error fetching job posting:', error);
      return { success: false, error: `データベースエラー: ${error.message}` };
    }

    if (!jobPosting) {
      logger.error(`No published job posting found for ID: ${jobId}`);
      
      // 詳細なエラーメッセージを生成
      if (jobCheck) {
        // 求人は存在するが、公開されていない
        const status = jobCheck.status;
        const publicationType = jobCheck.publication_type;
        logger.info(`Job exists but not accessible: status=${status}, publication_type=${publicationType}`);
        
        if (status !== 'PUBLISHED') {
          return { 
            success: false, 
            error: `この求人は現在公開されていません (ステータス: ${status})` 
          };
        } else if (!['public', 'members'].includes(publicationType)) {
          return { 
            success: false, 
            error: `この求人は現在応募できません (公開設定: ${publicationType})` 
          };
        }
      }
      
      // より詳細なエラーメッセージを提供
      return { 
        success: false, 
        error: `指定された求人が見つかりませんでした (ID: ${jobId})` 
      };
    }

    // 企業情報を別途取得
    const { data: company, error: companyError } = await supabase
      .from('company_accounts')
      .select('company_name')
      .eq('id', jobPosting.company_account_id)
      .maybeSingle();

    logger.info(`Company query result:`, { company, companyError });

    return {
      success: true,
      data: {
        id: jobPosting.id,
        title: jobPosting.title,
        description: jobPosting.job_description,
        companyName: company?.company_name || '企業名未設定',
        requiredDocuments: jobPosting.required_documents || [],
        status: jobPosting.status
      }
    };

  } catch (error) {
    logger.error('Get job details error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました'
    };
  }
}