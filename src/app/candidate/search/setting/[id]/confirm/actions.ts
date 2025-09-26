'use server';

import { getSupabaseServerClient } from '@/lib/supabase/server-client';
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
async function uploadFile(
  file: File,
  type: 'resume' | 'career',
  candidateId: string
): Promise<UploadResult> {
  try {
    // ファイルサイズチェック（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'ファイルサイズは5MB以下にしてください',
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
      'text/plain',
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error:
          'PDF、Word、画像ファイル（JPEG/PNG/GIF）、テキストファイルのみアップロード可能です',
      };
    }

    // ファイル拡張子を取得
    const getFileExtension = (mimeType: string, fileName: string): string => {
      const mimeToExtension: { [key: string]: string } = {
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
          '.docx',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'text/plain': '.txt',
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
    const supabase = await getSupabaseServerClient();
    const fileBuffer = await file.arrayBuffer();

    const { data, error } = await supabase.storage
      .from('applications')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      logger.error('Supabase upload error:', error);
      return {
        success: false,
        error: 'ファイルのアップロードに失敗しました',
      };
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('applications')
      .getPublicUrl(fileName);

    return {
      success: true,
      url: urlData.publicUrl,
    };
  } catch (error) {
    logger.error('File upload error:', error);
    return {
      success: false,
      error: 'ファイルのアップロード中にエラーが発生しました',
    };
  }
}

/**
 * 求人応募処理（サーバーアクション）
 */
export async function submitApplication(
  formData: FormData
): Promise<ApplicationResult> {
  logger.info('=== Application submission started ===');

  try {
    // FormDataの内容をログに出力（File constructor の代わりにプロパティで判定）
    try {
      const entries = [];
      for (const [key, value] of formData.entries()) {
        entries.push({
          key,
          value:
            value &&
            typeof value === 'object' &&
            'name' in value &&
            'size' in value
              ? `File: ${(value as any).name} (${(value as any).size} bytes)`
              : String(value),
        });
      }
      logger.info('FormData entries:', entries);
    } catch (error) {
      logger.warn('Could not log FormData entries:', error);
    }

    // FormDataから値を取得
    const jobId = formData.get('jobId') as string;

    logger.info('Basic form data:', { jobId });

    // ファイルを取得
    const resumeFiles = formData.getAll('resumeFiles') as File[];
    const careerFiles = formData.getAll('careerFiles') as File[];

    // ファイルのバリデーション（サーバー環境では File constructor が存在しないため、プロパティで判定）
    const validResumeFiles = resumeFiles.filter(
      file =>
        file &&
        typeof file === 'object' &&
        'name' in file &&
        'size' in file &&
        typeof file.size === 'number' &&
        file.size > 0
    );
    const validCareerFiles = careerFiles.filter(
      file =>
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
      careerFileNames: validCareerFiles.map(f => f.name),
    });

    if (!jobId) {
      logger.error('No jobId provided');
      return {
        success: false,
        error: String('求人IDが必要です'),
      };
    }

    // 統一的な認証チェック
    const authResult = await requireCandidateAuthForAction();
    if (!authResult.success) {
      logger.warn(
        'Authentication failed:',
        (authResult as any).error || '認証エラー'
      );
      const authErrorResponse = {
        success: false,
        error: String('認証が必要です。ログインしてください。'),
        needsAuth: true,
      };
      logger.info('Returning auth error response:', authErrorResponse);
      return authErrorResponse;
    }

    const candidateId = authResult.data.candidateId;
    logger.info(`Application attempt by candidate: ${candidateId}`);

    const supabase = await getSupabaseServerClient();

    // 求人情報取得と応募済みチェックを並列実行
    const [
      { data: jobPosting, error: jobError },
      { data: existingApplication, error: checkError },
    ] = await Promise.all([
      supabase
        .from('job_postings')
        .select(
          `
          id,
          title,
          company_account_id,
          company_group_id,
          status
        `
        )
        .eq('id', jobId)
        .maybeSingle(),
      supabase
        .from('application')
        .select('id')
        .eq('candidate_id', candidateId)
        .eq('job_posting_id', jobId)
        .maybeSingle(),
    ]);

    if (jobError || !jobPosting) {
      logger.error('Failed to fetch job posting:', jobError);
      return {
        success: false,
        error: String('求人情報が見つかりませんでした'),
      };
    }

    if (checkError) {
      logger.error('Failed to check existing application:', checkError);
      return {
        success: false,
        error: String('サーバーエラーが発生しました'),
      };
    }

    // 求人がアクティブかどうかチェック
    if (jobPosting.status !== 'PUBLISHED') {
      logger.error('Job not published:', { jobId, status: jobPosting.status });
      return {
        success: false,
        error: String('この求人は現在応募できません'),
      };
    }

    if (existingApplication) {
      logger.error('Application already exists:', { candidateId, jobId });
      return {
        success: false,
        error: String('この求人には既に応募済みです'),
      };
    }

    // ファイルアップロード処理
    const resumeUrls: string[] = [];
    const careerUrls: string[] = [];

    // 履歴書をアップロード
    logger.info(`Uploading ${validResumeFiles.length} resume files`);
    for (const resumeFile of validResumeFiles) {
      logger.info(
        `Uploading resume file: ${resumeFile.name}, size: ${resumeFile.size}`
      );
      const uploadResult = await uploadFile(resumeFile, 'resume', candidateId);
      if (!uploadResult.success) {
        logger.error('Resume upload failed:', uploadResult.error);
        return {
          success: false,
          error: String(
            uploadResult.error || '履歴書のアップロードに失敗しました'
          ),
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
      logger.info(
        `Uploading career file: ${careerFile.name}, size: ${careerFile.size}`
      );
      const uploadResult = await uploadFile(careerFile, 'career', candidateId);
      if (!uploadResult.success) {
        logger.error('Career upload failed:', uploadResult.error);
        return {
          success: false,
          error: String(
            uploadResult.error || '職務経歴書のアップロードに失敗しました'
          ),
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
        logger.warn(
          `Company group ${jobPosting.company_group_id} not found, creating default group`
        );

        const { data: newGroup, error: createGroupError } = await supabase
          .from('company_groups')
          .insert({
            id: jobPosting.company_group_id,
            company_account_id: jobPosting.company_account_id,
            group_name: '採用チーム',
            description: '自動作成された採用チーム',
          })
          .select('id')
          .maybeSingle();

        if (createGroupError || !newGroup) {
          logger.error('Failed to create company group:', createGroupError);
          return {
            success: false,
            error: String('企業グループ情報の作成に失敗しました'),
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
        error: String('企業ユーザー情報が見つかりませんでした'),
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
      careerUrlsCount: careerUrls.length,
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
        application_message: null,
        status: 'SENT',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .maybeSingle();

    if (applicationError) {
      logger.error('Failed to create application:', applicationError);
      logger.error('Application error details:', {
        message: applicationError.message,
        details: applicationError.details,
        hint: applicationError.hint,
        code: applicationError.code,
      });
      return {
        success: false,
        error: String(`応募の送信に失敗しました: ${applicationError.message}`),
      };
    }

    logger.info(`Application created successfully:`, {
      applicationId: application.id,
      candidateId,
      jobPostingId: jobId,
    });

    // 選考進捗レコードを作成（企業グループが候補者の進捗状況を閲覧・編集できるようにする）
    logger.info('Creating selection progress record');

    const { data: selectionProgress, error: selectionProgressError } =
      await supabase
        .from('selection_progress')
        .insert({
          candidate_id: candidateId,
          company_group_id: validCompanyGroupId,
          application_id: application.id,
          job_posting_id: jobId,
          document_screening_result: null,
          first_interview_result: null,
          secondary_interview_result: null,
          final_interview_result: null,
          offer_result: null,
          internal_memo: `求人「${jobPosting.title}」への応募が完了しました。`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select('id')
        .single();

    if (selectionProgressError) {
      logger.error(
        'Failed to create selection progress:',
        selectionProgressError
      );
      // 進捗レコード作成失敗してもアプリケーション自体は成功とする
    } else {
      logger.info('Selection progress created successfully:', {
        progressId: selectionProgress.id,
      });
    }

    // ルームの作成または取得（応募成功後にメッセージ用のルームを作成）
    logger.info('Creating or getting room for application messaging');

    // candidateIdとvalidCompanyGroupIdの値を検証
    if (!candidateId) {
      logger.error('Critical: candidateId is missing or invalid:', {
        candidateId,
      });
      return {
        success: false,
        error: String('候補者情報が不正です。再度ログインしてお試しください。'),
      };
    }

    if (!validCompanyGroupId) {
      logger.error('Critical: validCompanyGroupId is missing or invalid:', {
        validCompanyGroupId,
      });
      return {
        success: false,
        error: String(
          '企業グループ情報が不正です。求人情報を確認してください。'
        ),
      };
    }

    // 既存のルームがあるかチェック
    let roomId: string | null = null;
    logger.info('Searching for existing room with params:', {
      candidateId,
      validCompanyGroupId,
      type: 'direct',
    });

    // RLS問題を回避するため、ルーム操作にはAdmin clientを使用
    const adminSupabase = getSupabaseAdminClient();

    // データベース接続テスト
    try {
      const { data: testQuery, error: testError } = await adminSupabase
        .from('rooms')
        .select('id')
        .limit(1);

      if (testError) {
        logger.error('Database connection test failed:', testError);
        return {
          success: false,
          error: String(
            'データベース接続に失敗しました。しばらく待ってから再度お試しください。'
          ),
        };
      }
      logger.info('Database connection test passed');
    } catch (dbTestError) {
      logger.error('Database connection test exception:', dbTestError);
      return {
        success: false,
        error: String('データベース接続エラーが発生しました。'),
      };
    }

    // まず、該当するルームが何件あるか調査（求人IDも含めて検索）
    const { data: allRooms, error: allRoomsError } = await adminSupabase
      .from('rooms')
      .select('id, created_at, related_job_posting_id')
      .eq('candidate_id', candidateId)
      .eq('company_group_id', validCompanyGroupId)
      .eq('related_job_posting_id', jobId)
      .eq('type', 'direct')
      .order('created_at', { ascending: false });

    logger.info('Room search investigation:', {
      candidateId,
      validCompanyGroupId,
      jobId,
      roomCount: allRooms?.length || 0,
      rooms: allRooms,
    });

    if (allRoomsError) {
      logger.error('Critical: Room investigation failed:', allRoomsError);
      return {
        success: false,
        error: String(
          `メッセージルームの調査に失敗しました。エラー詳細: ${allRoomsError.message || allRoomsError.code || 'Unknown error'}`
        ),
      };
    }

    let existingRoom = null;
    let roomSearchError = null;

    if (allRooms && allRooms.length > 1) {
      // 複数のルームが存在する場合、最新のものを選択
      logger.warn(
        'Multiple rooms found for this job application, using the latest one:',
        {
          roomCount: allRooms.length,
          latestRoom: allRooms[0],
          jobId,
          candidateId,
          validCompanyGroupId,
        }
      );
      existingRoom = allRooms[0];
    } else if (allRooms && allRooms.length === 1) {
      // 1件の場合は正常
      existingRoom = allRooms[0];
      logger.info('Existing room found for this job application:', {
        room: existingRoom,
        jobId,
        candidateId,
        validCompanyGroupId,
      });
    } else {
      // 0件の場合は新規作成が必要
      logger.info(
        'No existing room found for this job application, will create new one:',
        {
          jobId,
          candidateId,
          validCompanyGroupId,
        }
      );
    }

    if (existingRoom) {
      roomId = existingRoom.id;
      logger.info('Using existing room:', { roomId });
    } else {
      // 新しいルームを作成（同時作成防止のため再度チェック）
      logger.info('Creating new room for application');

      // 同時作成を防ぐため、作成直前にもう一度チェック（求人IDも含めて）
      const { data: finalCheck, error: finalCheckError } = await adminSupabase
        .from('rooms')
        .select('id')
        .eq('candidate_id', candidateId)
        .eq('company_group_id', validCompanyGroupId)
        .eq('related_job_posting_id', jobId)
        .eq('type', 'direct')
        .limit(1);

      if (!finalCheckError && finalCheck && finalCheck.length > 0) {
        // 他の処理で作成された場合はそれを使用
        roomId = finalCheck[0].id;
        logger.info('Room was created by another process, using it:', {
          roomId,
        });
      } else {
        // 本当に存在しない場合のみ作成
        const { data: newRoom, error: roomInsertError } = await adminSupabase
          .from('rooms')
          .insert({
            type: 'direct',
            candidate_id: candidateId,
            company_group_id: validCompanyGroupId,
            related_job_posting_id: jobId,
          })
          .select('id')
          .single();

        if (roomInsertError) {
          logger.error('Critical: Failed to create room:', roomInsertError);
          return {
            success: false,
            error: String(
              'メッセージルームの作成に失敗しました。しばらく待ってから再度お試しください。'
            ),
          };
        }

        roomId = newRoom.id;
        logger.info('New room created successfully for job application:', {
          roomId,
          jobId,
          candidateId,
          validCompanyGroupId,
        });
      }

      // 新しく作成したルームの場合のみ、企業ユーザーを追加
      if (!finalCheckError && !(finalCheck && finalCheck.length > 0)) {
        // 企業グループのユーザーを取得（管理者またはアクティブユーザー）
        const { data: groupUsers, error: groupUsersError } =
          (await adminSupabase
            .from('company_user_group_permissions')
            .select('company_user_id')
            .eq('company_group_id', validCompanyGroupId)) as {
            data: { company_user_id: string }[] | null;
            error: any;
          };

        if (groupUsersError) {
          logger.error(
            'Warning: Failed to fetch group users:',
            groupUsersError
          );
          // 企業ユーザーの取得に失敗した場合でも続行
        } else if (groupUsers && groupUsers.length > 0) {
          // 企業ユーザーIDの配列を作成
          const companyUserIds = groupUsers.map(gu => gu.company_user_id);

          logger.info('Updating room with participating company users:', {
            roomId,
            companyUserIds,
            candidateId,
            validCompanyGroupId,
          });

          // roomsテーブルのparticipating_company_usersフィールドを更新
          const { error: updateRoomError } = await adminSupabase
            .from('rooms')
            .update({
              participating_company_users: companyUserIds,
            })
            .eq('id', roomId);

          if (updateRoomError) {
            logger.error(
              'Critical: Failed to update room with participating users:',
              {
                error: updateRoomError,
                message: updateRoomError.message,
                code: updateRoomError.code,
                details: updateRoomError.details,
                hint: updateRoomError.hint,
                roomId,
                companyUserIds,
              }
            );
            return {
              success: false,
              error: String(
                `メッセージルームの参加者設定に失敗しました。エラー詳細: ${updateRoomError.message || updateRoomError.code || 'Unknown error'}`
              ),
            };
          }

          logger.info('Room participants updated successfully:', {
            roomId,
            participatingUsersCount: companyUserIds.length,
          });
        } else {
          logger.info(
            'No company users found for group, room created with candidate only'
          );
        }
      } else {
        logger.info('Using existing room, skipping participant updates');
      }
    }

    // ルームが正常に作成または取得できたので、メッセージを必ず送信
    if (!roomId) {
      logger.error('Critical: No room ID available for message sending');
      return {
        success: false,
        error: String('メッセージルームが準備できませんでした。'),
      };
    }

    logger.info('Sending application message to room:', { roomId });

    // 応募メッセージのコンテンツ作成（ファイル情報をより詳細に記載）
    const attachmentInfo = [];
    const fileDetails = [];

    // 履歴書ファイルの詳細情報を作成
    if (resumeUrls.length > 0) {
      attachmentInfo.push(`・履歴書: ${resumeUrls.length}件添付`);
      resumeUrls.forEach((url, index) => {
        const fileName = validResumeFiles[index]?.name || `履歴書_${index + 1}`;
        fileDetails.push({
          url,
          name: fileName,
          type: 'resume',
          size: validResumeFiles[index]?.size || 0,
        });
      });
    }

    // 職務経歴書ファイルの詳細情報を作成
    if (careerUrls.length > 0) {
      attachmentInfo.push(`・職務経歴書: ${careerUrls.length}件添付`);
      careerUrls.forEach((url, index) => {
        const fileName =
          validCareerFiles[index]?.name || `職務経歴書_${index + 1}`;
        fileDetails.push({
          url,
          name: fileName,
          type: 'career',
          size: validCareerFiles[index]?.size || 0,
        });
      });
    }

    // ファイル名一覧を作成
    const fileNamesList = fileDetails
      .map(
        file =>
          `・${file.name} (${file.type === 'resume' ? '履歴書' : '職務経歴書'})`
      )
      .join('\n');

    const messageContent = `【求人応募のお知らせ】

求人「${jobPosting.title}」に応募いたしました。

${attachmentInfo.length > 0 ? `提出書類:\n${attachmentInfo.join('\n')}\n\n添付ファイル:\n${fileNamesList}\n` : ''}
よろしくお願いいたします。`;

    // ファイルURLを配列形式で準備してfile_urlsフィールドに設定
    const allFileUrls = [...resumeUrls, ...careerUrls];

    // メッセージデータの構造（database.mdに基づく正確な実装）
    const messageData: any = {
      room_id: roomId,
      sender_type: 'CANDIDATE',
      sender_candidate_id: candidateId,
      message_type: 'APPLICATION',
      subject: `求人「${jobPosting.title}」への応募`,
      content: messageContent,
      file_urls: allFileUrls, // jsonb形式でファイルURLを格納
      status: 'SENT',
      sent_at: new Date().toISOString(),
      // created_at, updated_atはデフォルト値で自動設定されるため不要
      // sender_company_user_idは存在しない（sender_company_group_idのみ）
    };

    logger.info('Message data prepared for insertion:', {
      roomId,
      messageType: messageData.message_type,
      fileCount: allFileUrls.length,
      fileUrls: allFileUrls,
    });

    const { data: message, error: messageInsertError } = await adminSupabase
      .from('messages')
      .insert(messageData)
      .select('id')
      .single();

    if (messageInsertError) {
      logger.error(
        'Critical: Failed to create application message:',
        messageInsertError
      );
      return {
        success: false,
        error: String(
          '応募メッセージの送信に失敗しました。しばらく待ってから再度お試しください。'
        ),
      };
    }

    logger.info('Message created successfully:', { messageId: message.id });

    // 企業側への通知を作成（これは失敗してもOK）
    try {
      const { data: groupUsers, error: groupUsersError } = await adminSupabase
        .from('company_user_group_permissions')
        .select('company_user_id')
        .eq('company_group_id', validCompanyGroupId);

      if (!groupUsersError && groupUsers && groupUsers.length > 0) {
        // 各企業ユーザーに通知を作成
        const notificationPromises = groupUsers.map(groupUser =>
          adminSupabase.from('company_unread_notifications').insert({
            company_user_id: groupUser.company_user_id,
            message_id: message.id,
            notification_type: 'APPLICATION',
          })
        );

        const notificationResults =
          await Promise.allSettled(notificationPromises);

        const successCount = notificationResults.filter(
          result => result.status === 'fulfilled'
        ).length;
        const failureCount = notificationResults.filter(
          result => result.status === 'rejected'
        ).length;

        logger.info('Company notifications created:', {
          total: groupUsers.length,
          success: successCount,
          failure: failureCount,
        });

        if (failureCount > 0) {
          logger.warn(
            'Some notifications failed, but application is still successful'
          );
        }
      }
    } catch (notificationError) {
      logger.error(
        'Notification creation failed, but application is still successful:',
        notificationError
      );
    }

    const responseData = {
      success: true,
      data: {
        application_id: String(application.id),
        job_title: String(jobPosting.title),
        status: 'SENT',
        applied_at: String(application.created_at),
      },
    };

    logger.info('Returning success response:', responseData);
    return responseData;
  } catch (error) {
    logger.error('Application submission error:', error);
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    logger.error('Detailed error message:', errorMessage);

    const errorResponse = {
      success: false,
      error: String(`サーバーエラーが発生しました: ${errorMessage}`),
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
    const supabase = await getSupabaseServerClient();

    // デバッグ: jobIdの型と値を確認
    logger.info(
      `Job ID type: ${typeof jobId}, value: "${jobId}", length: ${jobId?.length}`
    );

    // まず、ランダムな求人を1つ取得してデータベース接続を確認
    const { data: randomJob, error: randomError } = await supabase
      .from('job_postings')
      .select('id, title, status')
      .limit(1)
      .maybeSingle();

    logger.info(`Random job query for connection test:`, {
      randomJob,
      randomError,
    });

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
      idsMatch: jobCheck?.id === jobId,
    });

    // もしjobCheckで見つからない場合、すべての求人IDを取得して比較
    if (!jobCheck && !checkError) {
      logger.warn(
        `Job ${jobId} not found, fetching all job IDs for comparison`
      );
      const { data: allJobs, error: allJobsError } = await supabase
        .from('job_postings')
        .select('id, title, status, publication_type')
        .limit(10);

      logger.info(`All jobs (first 10):`, { allJobs, allJobsError });

      if (allJobs) {
        const exactMatch = allJobs.find(job => job.id === jobId);
        const similarIds = allJobs.filter(
          job => job.id.includes(jobId) || jobId.includes(job.id)
        );
        logger.info(
          `Exact match: ${exactMatch?.id}, Similar IDs:`,
          similarIds.map(j => j.id)
        );
      }
    }

    // ユーザー認証状態を確認
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const isAuthenticated = !!user;

    // 求人情報を取得（job detail pageと同じフィルタ条件を適用）
    let jobQuery = supabase
      .from('job_postings')
      .select(
        `
        id,
        title,
        job_description,
        required_documents,
        status,
        company_account_id
      `
      )
      .eq('id', jobId)
      .eq('status', 'PUBLISHED');

    // 認証状態に応じてpublication_typeフィルターを適用
    if (isAuthenticated) {
      // ログインユーザーはpublicとmembersの両方を閲覧可能
      jobQuery = jobQuery.in('publication_type', ['public', 'members']);
    } else {
      // 未認証ユーザーはpublicのみ閲覧可能
      jobQuery = jobQuery.eq('publication_type', 'public');
    }

    const { data: jobPosting, error } = await jobQuery.maybeSingle();

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
        logger.info(
          `Job exists but not accessible: status=${status}, publication_type=${publicationType}`
        );

        if (status !== 'PUBLISHED') {
          return {
            success: false,
            error: `この求人は現在公開されていません (ステータス: ${status})`,
          };
        } else if (!['public', 'members'].includes(publicationType)) {
          return {
            success: false,
            error: `この求人は現在応募できません (公開設定: ${publicationType})`,
          };
        }
      }

      // より詳細なエラーメッセージを提供
      return {
        success: false,
        error: `指定された求人が見つかりませんでした (ID: ${jobId})`,
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
        status: jobPosting.status,
      },
    };
  } catch (error) {
    logger.error('Get job details error:', error);
    return {
      success: false,
      error: 'サーバーエラーが発生しました',
    };
  }
}
