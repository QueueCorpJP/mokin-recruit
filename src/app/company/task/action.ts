'use server';

import { getCachedCompanyUser, requireCompanyAuthForAction, getCompanySupabaseClient } from '@/lib/auth/server';
import { formatCandidateName } from './utils';

export interface TaskData {
  // Task 1: 求人作成が0件
  hasNoJobPostings: boolean;
  
  // Task 2: 新着応募（24時間以内）
  hasNewApplication: boolean;
  newApplications?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedAt: Date;
    groupName?: string;
  }>;
  
  // Task 3: 未確認応募（24時間以上経過）
  hasUnreadApplication: boolean;
  unreadApplications?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedAt: Date;
    groupName?: string;
  }>;
  
  // Task 4: 新着メッセージ（72時間以内）
  hasNewMessage: boolean;
  newMessages?: Array<{
    roomId: string;
    candidateName: string;
    jobTitle: string;
    sentAt: Date;
    messagePreview?: string;
    groupName?: string;
  }>;
  
  // Task 5: 未読メッセージ（72時間以上経過）
  hasUnreadMessage: boolean;
  unreadMessages?: Array<{
    roomId: string;
    candidateName: string;
    jobTitle: string;
    sentAt: Date;
    messagePreview?: string;
    groupName?: string;
  }>;
  
  // Task 6: 選考結果未登録
  hasUnregisteredInterviewResult: boolean;
  unregisteredInterviews?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    interviewDate?: Date;
    groupName?: string;
  }>;
}

/**
 * 企業のタスクデータを取得
 * 実際のサービスで必要な全てのトリガー条件を実装
 */
/**
 * デバッグ・デザインテスト用のタスク強制表示フラグ
 * 本番環境では false にすること
 */
const FORCE_SHOW_TASKS_FOR_DESIGN_TEST = false;

export async function getCompanyTaskData(): Promise<TaskData> {
  const user = await getCachedCompanyUser();
  
  if (!user) {
    return {
      hasNoJobPostings: false,
      hasNewApplication: false,
      hasUnreadApplication: false,
      hasNewMessage: false,
      hasUnreadMessage: false,
      hasUnregisteredInterviewResult: false,
    };
  }

  const supabase = await getCompanySupabaseClient();

  // requireCompanyAuthForAction で companyUserId / companyAccountId を決定
  let companyUserId = user.user_metadata?.company_user_id || user.id;
  let companyAccountId = user.user_metadata?.company_account_id as string | undefined;

  try {
    const authResult = await requireCompanyAuthForAction();
    if (authResult.success) {
      companyUserId = authResult.data.companyUserId;
      companyAccountId = authResult.data.companyAccountId;
    }
  } catch (_) {
    // noop: user_metadata の値をフォールバック使用
  }

  if (!companyAccountId) {
    console.error('❌ Company account ID not found');
    return {
      hasNoJobPostings: false,
      hasNewApplication: false,
      hasUnreadApplication: false,
      hasNewMessage: false,
      hasUnreadMessage: false,
      hasUnregisteredInterviewResult: false,
    };
  }

  // ユーザーの権限に基づいてアクセス可能なグループIDを取得
  const { data: permissions } = await supabase
    .from('company_user_group_permissions')
    .select('company_group_id, permission_level')
    .eq('company_user_id', companyUserId);

  let companyGroupIds: string[] = [];
  let hasAdminPermission = false;

  if (permissions && permissions.length > 0) {
    hasAdminPermission = permissions.some(p => p.permission_level === 'ADMINISTRATOR');
    
    if (hasAdminPermission) {
      // ADMINの場合は同じcompany_accountの全グループ
      const { data: allGroups } = await supabase
        .from('company_groups')
        .select('id')
        .eq('company_account_id', companyAccountId);
      
      companyGroupIds = allGroups?.map(g => g.id) || [];
    } else {
      // SCOUT_STAFFの場合は所属グループのみ
      companyGroupIds = permissions.map(p => p.company_group_id);
    }
  }
  
  const taskData: TaskData = {
    hasNoJobPostings: false,
    hasNewApplication: false,
    hasUnreadApplication: false,
    hasNewMessage: false,
    hasUnreadMessage: false,
    hasUnregisteredInterviewResult: false,
  };

  try {
    console.log('🔍 Getting task data for company:', companyAccountId, 'groups:', companyGroupIds);
    
    // 並列でデータ取得を実行
    const [
      jobPostings,
      applications,
      messages,
      interviewResults
    ] = await Promise.all([
      getJobPostings(companyAccountId),
      getApplications(supabase, companyAccountId, companyGroupIds, hasAdminPermission),
      getMessages(supabase, companyGroupIds),
      getInterviewResults(supabase, companyAccountId, companyGroupIds, hasAdminPermission)
    ]);

    console.log('📊 Raw data fetched:', {
      jobPostings: jobPostings.length,
      applications: applications.length,
      messages: messages.length,
      interviewResults: interviewResults.length
    });

    console.log('📊 Sample data for debugging:', {
      sampleJobPosting: jobPostings[0] || 'No job postings',
      sampleApplication: applications[0] || 'No applications',
      sampleMessage: messages[0] || 'No messages',
      sampleInterview: interviewResults[0] || 'No interview results'
    });

    // Task 1: 求人が0件かチェック
    taskData.hasNoJobPostings = jobPostings.length === 0;
    console.log('🎯 Task 1 (No job postings):', taskData.hasNoJobPostings);

    // デバッグ用：とりあえず求人作成タスクを表示
    if (jobPostings.length === 0) {
      console.log('🔧 DEBUG: Forcing "No job postings" task to show');
      taskData.hasNoJobPostings = true;
    }

    // Task 2 & 3: 応募の処理
    processApplications(applications, taskData);
    console.log('🎯 Task 2 (New applications):', taskData.hasNewApplication);
    console.log('🎯 Task 3 (Unread applications):', taskData.hasUnreadApplication);

    // Task 4 & 5: メッセージの処理
    processMessages(messages, taskData);
    console.log('🎯 Task 4 (New messages):', taskData.hasNewMessage);
    console.log('🎯 Task 5 (Unread messages):', taskData.hasUnreadMessage);

    // Task 6: 面接結果の処理
    processInterviewResults(interviewResults, taskData);
    console.log('🎯 Task 6 (Interview results):', taskData.hasUnregisteredInterviewResult);

    console.log('🏁 Final task data summary:', {
      hasNoJobPostings: taskData.hasNoJobPostings,
      hasNewApplication: taskData.hasNewApplication,
      hasUnreadApplication: taskData.hasUnreadApplication,
      hasNewMessage: taskData.hasNewMessage,
      hasUnreadMessage: taskData.hasUnreadMessage,
      hasUnregisteredInterviewResult: taskData.hasUnregisteredInterviewResult,
      totalActiveTasks: [
        taskData.hasNoJobPostings,
        taskData.hasNewApplication,
        taskData.hasUnreadApplication,
        taskData.hasNewMessage,
        taskData.hasUnreadMessage,
        taskData.hasUnregisteredInterviewResult
      ].filter(Boolean).length
    });

    // デザインテスト用の強制表示機能
    if (FORCE_SHOW_TASKS_FOR_DESIGN_TEST) {
      console.log('🎨 Design test mode: Forcing all tasks to show');
      taskData.hasNoJobPostings = true;
      taskData.hasNewApplication = true;
      taskData.hasUnreadApplication = true;
      taskData.hasNewMessage = true;
      taskData.hasUnreadMessage = true;
      taskData.hasUnregisteredInterviewResult = true;

      // サンプルデータも追加
      taskData.newApplications = [{
        id: 'sample-1',
        candidateName: '田中 太郎',
        jobTitle: 'フロントエンドエンジニア',
        appliedAt: new Date()
      }];

      taskData.unreadApplications = [{
        id: 'sample-2',
        candidateName: '佐藤 花子',
        jobTitle: 'バックエンドエンジニア',
        appliedAt: new Date()
      }];

      taskData.newMessages = [{
        roomId: 'room-1',
        candidateName: '山田 一郎',
        jobTitle: 'デザイナー',
        sentAt: new Date(),
        messagePreview: 'ご質問があります'
      }];

      taskData.unreadMessages = [{
        roomId: 'room-2',
        candidateName: '鈴木 美香',
        jobTitle: 'プロダクトマネージャー',
        sentAt: new Date(),
        messagePreview: '面接についてご相談です'
      }];

      taskData.unregisteredInterviews = [{
        id: 'interview-1',
        candidateName: '高橋 健太',
        jobTitle: 'データサイエンティスト',
        interviewDate: new Date()
      }];

      console.log('🎨 Sample data added for design testing');
    }

  } catch (error) {
    console.error('❌ Failed to fetch task data:', error);
  }

  return taskData;
}

/**
 * 求人情報を取得
 */
async function getJobPostings(companyAccountId: string) {
  const supabase = await getCompanySupabaseClient();
  const { data, error } = await supabase
    .from('job_postings')
    .select('id, status')
    .eq('company_account_id', companyAccountId)
    .in('status', ['PUBLISHED', 'PENDING_APPROVAL']); // 公開中または承認待ちの求人のみ

  if (error) {
    console.error('❌ Error fetching job postings:', error);
    return [];
  }

  console.log('📋 Job postings found:', data?.length || 0);
  return data || [];
}

/**
 * 応募情報を取得
 */
async function getApplications(supabase: any, companyAccountId: string, companyGroupIds: string[], hasAdminPermission: boolean) {
  // 権限がなくグループが取得できなかった場合は0件
  if (!hasAdminPermission && companyGroupIds.length === 0) {
    return [];
  }

  const query = supabase
    .from('application')
    .select(`
      id,
      status,
      created_at,
      updated_at,
      candidate_id,
      job_posting_id,
      company_group_id,
      candidates!candidate_id (
        first_name,
        last_name,
        first_name_kana,
        last_name_kana
      ),
      job_postings!job_posting_id (
        title
      ),
      company_groups!company_group_id (
        group_name,
        company_accounts!company_account_id (
          company_name
        )
      )
    `)
    .eq('company_account_id', companyAccountId)
    .order('created_at', { ascending: false });

  // ADMINは全グループ、それ以外は所属グループのみ
  if (!hasAdminPermission) {
    query.in('company_group_id', companyGroupIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error fetching applications:', error);
    console.error('Query details:', { companyAccountId, companyGroupIds });
    return [];
  }

  console.log('📨 Applications found:', data?.length || 0);
  return data || [];
}

/**
 * メッセージ情報を取得（mypageと同じアプローチを使用）
 */
async function getMessages(supabase: any, companyGroupIds: string[]) {
  // 権限がなくグループが取得できなかった場合は0件
  if (companyGroupIds.length === 0) {
    return [];
  }

  // 候補者からの未読メッセージを取得（所属グループのルームに限定）
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      status,
      sender_type,
      sent_at,
      read_at,
      room_id,
      rooms!inner (
        id,
        candidate_id,
        related_job_posting_id,
        company_group_id,
        candidates!candidate_id (
          first_name,
          last_name,
          first_name_kana,
          last_name_kana
        ),
        job_postings!related_job_posting_id (
          title
        ),
        company_groups!company_group_id (
          group_name,
          company_accounts!company_account_id (
            company_name
          )
        )
      )
    `)
    .eq('sender_type', 'CANDIDATE')
    .eq('status', 'SENT')
    .in('rooms.company_group_id', companyGroupIds)
    .order('sent_at', { ascending: false });

  console.log('💬 [TASK DEBUG] Messages query result:', {
    data,
    error,
    messagesCount: data?.length || 0,
    sampleMessages: data?.slice(0, 2).map(msg => ({
      id: msg.id,
      status: msg.status,
      sender_type: msg.sender_type,
      sent_at: msg.sent_at,
      room_id: msg.room_id,
      groupName: msg.rooms?.company_groups?.group_name
    }))
  });

  if (error) {
    console.error('❌ [TASK DEBUG] Error fetching messages:', error);
    return [];
  }

  // 追加の検証：実際に SENT ステータスのみを返すように二重チェック
  const filteredMessages = (data || []).filter(msg => 
    msg.status === 'SENT' && msg.sender_type === 'CANDIDATE'
  );
  
  console.log('✅ [TASK DEBUG] Filtered SENT messages only:', {
    originalCount: data?.length || 0,
    filteredCount: filteredMessages.length,
    filteredSample: filteredMessages.slice(0, 2).map(msg => ({
      id: msg.id,
      status: msg.status,
      room_id: msg.room_id
    }))
  });

  return filteredMessages;
}

/**
 * 面接結果情報を取得
 * ※実際のテーブル構造に応じて調整が必要
 */
async function getInterviewResults(supabase: any, companyAccountId: string, companyGroupIds: string[], hasAdminPermission: boolean) {
  if (!hasAdminPermission && companyGroupIds.length === 0) {
    return [];
  }
  // 面接済みだが選考結果が未登録の応募を取得
  // statusがRESPONDED（企業が返信済み、面接設定済み）で、72時間以上経過したものを探す
  const query = supabase
    .from('application')
    .select(`
      id,
      status,
      updated_at,
      created_at,
      candidate_id,
      job_posting_id,
      company_group_id,
      candidates!candidate_id (
        first_name,
        last_name,
        first_name_kana,
        last_name_kana
      ),
      job_postings!job_posting_id (
        title
      ),
      company_groups!company_group_id (
        group_name,
        company_accounts!company_account_id (
          company_name
        )
      )
    `)
    .eq('company_account_id', companyAccountId)
    .eq('status', 'RESPONDED') // 面接設定済みのステータス
    .order('updated_at', { ascending: false });

  if (!hasAdminPermission) {
    query.in('company_group_id', companyGroupIds);
  }

  const { data, error } = await query;

  if (error) {
    console.error('❌ Error fetching interview results:', error);
    return [];
  }

  console.log('📋 Interview candidates found:', data?.length || 0);

  // 72時間以上経過しているものをフィルタリング（実際のプラットフォームでは面接完了から72時間）
  const seventyTwoHoursAgo = new Date();
  seventyTwoHoursAgo.setTime(seventyTwoHoursAgo.getTime() - 72 * 60 * 60 * 1000);

  const overdueInterviews = (data || []).filter(item => {
    const respondedAt = new Date(item.updated_at);
    return respondedAt <= seventyTwoHoursAgo;
  });

  console.log('📋 Overdue interview results (72h+):', overdueInterviews.length);
  return overdueInterviews;
}

/**
 * 応募データを処理してタスクデータに設定
 */
function processApplications(applications: any[], taskData: TaskData) {
  console.log('📨 Processing applications:', applications.length);

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const newApplications = [];
  const overdueApplications = [];

  for (const app of applications) {
    // 未対応の応募のみ処理（SENT ステータス）
    if (app.status === 'SENT') {
      const appliedAt = new Date(app.created_at);
      const candidateName = formatCandidateName(app.candidates);
      const jobTitle = app.job_postings?.title || '求人タイトル未設定';
      const groupName = app.company_groups?.group_name || '';

      const appData = {
        id: app.id,
        candidateName,
        jobTitle,
        appliedAt,
        groupName
      };

      if (appliedAt >= twentyFourHoursAgo) {
        // Task 2: 24時間以内の新着応募 - 迅速対応で競争力向上
        newApplications.push(appData);
      } else if (appliedAt <= fortyEightHoursAgo) {
        // Task 3: 48時間以上の遅延応募 - 候補者離れのリスク、至急対応
        overdueApplications.push(appData);
      }
    }
  }

  console.log('📨 New applications (24h):', newApplications.length);
  console.log('📨 Overdue applications (48h+):', overdueApplications.length);

  // Task 2: 新着応募（24時間以内）
  if (newApplications.length > 0) {
    taskData.hasNewApplication = true;
    taskData.newApplications = newApplications.slice(0, 5);
    console.log('✅ New application task triggered');
  }

  // Task 3: 遅延応募（48時間以上）
  if (overdueApplications.length > 0) {
    taskData.hasUnreadApplication = true;
    taskData.unreadApplications = overdueApplications.slice(0, 5);
    console.log('⚠️ Overdue application task triggered');
  }
}

/**
 * メッセージデータを処理してタスクデータに設定
 */
function processMessages(messages: any[], taskData: TaskData) {
  console.log('💬 Processing messages:', messages.length);

  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const fortyEightHoursAgo = new Date(now.getTime() - 48 * 60 * 60 * 1000);

  const newMessages = [];
  const overdueMessages = [];

  for (const msg of messages) {
    // 候補者からの未読メッセージのみ処理（既にクエリで絞り込み済み）
    if (msg.sender_type === 'CANDIDATE' && msg.status === 'SENT') {
      const sentAt = new Date(msg.sent_at);
      const candidateName = formatCandidateName(msg.rooms?.candidates);
      const jobTitle = msg.rooms?.job_postings?.title || 'メッセージ';
      const groupName = msg.rooms?.company_groups?.group_name || '';

      const msgData = {
        roomId: msg.room_id,
        candidateName,
        jobTitle,
        sentAt,
        messagePreview: msg.content?.substring(0, 50) || '',
        groupName
      };

      console.log('📝 [MSG DEBUG] Processing message:', {
        id: msg.id,
        status: msg.status,
        sentAt: sentAt.toISOString(),
        candidateName,
        jobTitle,
        groupName,
        timeChecks: {
          isWithin24h: sentAt >= twentyFourHoursAgo,
          isOver48h: sentAt <= fortyEightHoursAgo,
          hoursAgo: Math.floor((now.getTime() - sentAt.getTime()) / (1000 * 60 * 60))
        }
      });

      if (sentAt >= twentyFourHoursAgo) {
        // Task 4: 24時間以内の新着メッセージ - 迅速返信で印象向上
        newMessages.push(msgData);
        console.log('✅ Added to new messages (24h):', candidateName);
      } else if (sentAt <= fortyEightHoursAgo) {
        // Task 5: 48時間以上の遅延メッセージ - 候補者をお待たせ、至急対応
        overdueMessages.push(msgData);
        console.log('⚠️ Added to overdue messages (48h+):', candidateName);
      }
    }
  }

  console.log('💬 New messages (24h):', newMessages.length);
  console.log('💬 Overdue messages (48h+):', overdueMessages.length);

  // Task 4: 新着メッセージ（24時間以内）
  if (newMessages.length > 0) {
    taskData.hasNewMessage = true;
    taskData.newMessages = newMessages.slice(0, 5);
    console.log('✅ New message task triggered with', newMessages.length, 'messages');
  }

  // Task 5: 遅延メッセージ（48時間以上）
  if (overdueMessages.length > 0) {
    taskData.hasUnreadMessage = true;
    taskData.unreadMessages = overdueMessages.slice(0, 5);
    console.log('⚠️ Overdue message task triggered with', overdueMessages.length, 'messages');
  }
}

/**
 * 面接結果データを処理してタスクデータに設定
 */
function processInterviewResults(interviews: any[], taskData: TaskData) {
  console.log('📋 Processing interview results:', interviews.length);

  if (interviews.length > 0) {
    taskData.hasUnregisteredInterviewResult = true;
    taskData.unregisteredInterviews = interviews.slice(0, 5).map(interview => {
      const candidateName = formatCandidateName(interview.candidates);
      const jobTitle = interview.job_postings?.title || '求人タイトル未設定';
      const groupName = interview.company_groups?.group_name || '';
      const interviewDate = interview.updated_at ? new Date(interview.updated_at) : undefined;

      return {
        id: interview.id,
        candidateName,
        jobTitle,
        interviewDate,
        groupName
      };
    });
    
    console.log('✅ Interview result task triggered');
    console.log('📋 Overdue interviews:', taskData.unregisteredInterviews.length);
  }
}


/**
 * タスクをバッチで既読にする
 */
export async function markTasksAsRead(taskIds: string[], taskType: string) {
  const user = await getCachedCompanyUser();
  if (!user) return { success: false, error: 'User not authenticated' };

  const supabase = await getCompanySupabaseClient();

  try {
    // 権限チェックとアクセス可能グループの算出
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) throw new Error('Unauthorized');

    const companyUserId = authResult.data.companyUserId;
    const companyAccountId = authResult.data.companyAccountId;

    const { data: permissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id, permission_level')
      .eq('company_user_id', companyUserId);

    const isAdmin = (permissions || []).some(p => p.permission_level === 'ADMINISTRATOR');
    let accessibleGroupIds: string[] = [];
    if (isAdmin) {
      const { data: allGroups } = await supabase
        .from('company_groups')
        .select('id')
        .eq('company_account_id', companyAccountId);
      accessibleGroupIds = allGroups?.map(g => g.id) || [];
    } else {
      accessibleGroupIds = (permissions || []).map(p => p.company_group_id);
    }

    switch (taskType) {
      case 'APPLICATION':
        if (!isAdmin && accessibleGroupIds.length === 0) throw new Error('No access groups');
        // 応募を既読（READ）に更新（スコープ制限）
        const { error: appError } = await supabase
          .from('application')
          .update({ status: 'READ', updated_at: new Date().toISOString() })
          .in('id', taskIds)
          .eq('company_account_id', companyAccountId)
          .in('company_group_id', isAdmin ? (accessibleGroupIds.length ? accessibleGroupIds : ['__all__']) : accessibleGroupIds);
        
        if (appError) throw appError;
        break;
      
      case 'MESSAGE':
        if (!isAdmin && accessibleGroupIds.length === 0) throw new Error('No access groups');
        // アクセス可能なルームIDを取得
        const { data: rooms } = await supabase
          .from('rooms')
          .select('id, company_group_id')
          .in('company_group_id', isAdmin ? (accessibleGroupIds.length ? accessibleGroupIds : ['__all__']) : accessibleGroupIds);
        const accessibleRoomIds = (rooms || []).map(r => r.id);
        // メッセージを既読に更新（スコープ制限）
        const { error: msgError } = await supabase
          .from('messages')
          .update({ 
            status: 'READ', 
            read_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', taskIds)
          .in('room_id', accessibleRoomIds);
        
        if (msgError) throw msgError;
        break;
    }

    return { success: true };
  } catch (error) {
    console.error('Error marking tasks as read:', error);
    return { success: false, error: 'Failed to update task status' };
  }
}

/**
 * タスクの詳細情報を取得
 */
export async function getTaskDetails(taskId: string, taskType: string) {
  const user = await getCachedCompanyUser();
  if (!user) return null;

  const supabase = await getCompanySupabaseClient();

  try {
    // 権限チェックとアクセス可能グループの算出
    const authResult = await requireCompanyAuthForAction();
    if (!authResult.success) throw new Error('Unauthorized');

    const companyUserId = authResult.data.companyUserId;
    const companyAccountId = authResult.data.companyAccountId;

    const { data: permissions } = await supabase
      .from('company_user_group_permissions')
      .select('company_group_id, permission_level')
      .eq('company_user_id', companyUserId);

    const isAdmin = (permissions || []).some(p => p.permission_level === 'ADMINISTRATOR');
    let accessibleGroupIds: string[] = [];
    if (isAdmin) {
      const { data: allGroups } = await supabase
        .from('company_groups')
        .select('id')
        .eq('company_account_id', companyAccountId);
      accessibleGroupIds = allGroups?.map(g => g.id) || [];
    } else {
      accessibleGroupIds = (permissions || []).map(p => p.company_group_id);
    }

    switch (taskType) {
      case 'APPLICATION':
        const { data: appData } = await supabase
          .from('application')
          .select(`
            *,
            candidates!candidate_id (*),
            job_postings!job_posting_id (*)
          `)
          .eq('id', taskId)
          .eq('company_account_id', companyAccountId)
          .in('company_group_id', isAdmin ? (accessibleGroupIds.length ? accessibleGroupIds : ['__all__']) : accessibleGroupIds)
          .single();
        
        return appData;
      
      case 'MESSAGE':
        const { data: msgData } = await supabase
          .from('messages')
          .select(`
            *,
            rooms!inner (
              *,
              candidates!candidate_id (*),
              job_postings!related_job_posting_id (*)
            )
          `)
          .eq('id', taskId)
          .in('rooms.company_group_id', isAdmin ? (accessibleGroupIds.length ? accessibleGroupIds : ['__all__']) : accessibleGroupIds)
          .single();
        
        return msgData;
      
      default:
        return null;
    }
  } catch (error) {
    console.error('Error fetching task details:', error);
    return null;
  }
}