'use server';

import { getCachedCompanyUser } from '@/lib/auth/server';
import { createServerAdminClient } from '@/lib/supabase/server-admin';
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
  }>;
  
  // Task 3: 未確認応募（24時間以上経過）
  hasUnreadApplication: boolean;
  unreadApplications?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    appliedAt: Date;
  }>;
  
  // Task 4: 新着メッセージ（72時間以内）
  hasNewMessage: boolean;
  newMessages?: Array<{
    roomId: string;
    candidateName: string;
    jobTitle: string;
    sentAt: Date;
    messagePreview?: string;
  }>;
  
  // Task 5: 未読メッセージ（72時間以上経過）
  hasUnreadMessage: boolean;
  unreadMessages?: Array<{
    roomId: string;
    candidateName: string;
    jobTitle: string;
    sentAt: Date;
    messagePreview?: string;
  }>;
  
  // Task 6: 選考結果未登録
  hasUnregisteredInterviewResult: boolean;
  unregisteredInterviews?: Array<{
    id: string;
    candidateName: string;
    jobTitle: string;
    interviewDate?: Date;
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
const FORCE_SHOW_TASKS_FOR_DESIGN_TEST = true;

export async function getCompanyTaskData(): Promise<TaskData> {
  const user = await getCachedCompanyUser();
  
  if (!user || !user.company_account_id) {
    return {
      hasNoJobPostings: false,
      hasNewApplication: false,
      hasUnreadApplication: false,
      hasNewMessage: false,
      hasUnreadMessage: false,
      hasUnregisteredInterviewResult: false,
    };
  }

  const companyAccountId = user.company_account_id;
  const companyGroupIds = user.company_group_ids || [];
  const supabase = createServerAdminClient();
  
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
      getApplications(companyAccountId, companyGroupIds),
      getMessages(companyAccountId, companyGroupIds),
      getInterviewResults(companyAccountId, companyGroupIds)
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
  const supabase = createServerAdminClient();
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
async function getApplications(companyAccountId: string, companyGroupIds: string[]) {
  const supabase = createServerAdminClient();
  const query = supabase
    .from('application')
    .select(`
      id,
      status,
      created_at,
      updated_at,
      candidate_id,
      job_posting_id,
      candidates!candidate_id (
        first_name,
        last_name,
        first_name_kana,
        last_name_kana
      ),
      job_postings!job_posting_id (
        title
      )
    `)
    .eq('company_account_id', companyAccountId)
    .order('created_at', { ascending: false });

  // グループIDがある場合はフィルタリング
  if (companyGroupIds.length > 0) {
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
 * メッセージ情報を取得
 */
async function getMessages(companyAccountId: string, companyGroupIds: string[]) {
  // まず企業に関連するルームを取得
  const roomQuery = supabase
    .from('rooms')
    .select('id')
    .eq('type', 'direct');

  if (companyGroupIds.length > 0) {
    roomQuery.in('company_group_id', companyGroupIds);
  }

  const { data: rooms, error: roomError } = await roomQuery;

  if (roomError || !rooms || rooms.length === 0) {
    return [];
  }

  const roomIds = rooms.map(r => r.id);

  // 候補者からのメッセージを取得
  const { data, error } = await supabase
    .from('messages')
    .select(`
      id,
      content,
      status,
      sent_at,
      read_at,
      room_id,
      rooms!room_id (
        id,
        candidate_id,
        related_job_posting_id,
        candidates!candidate_id (
          first_name,
          last_name,
          first_name_kana,
          last_name_kana
        ),
        job_postings!related_job_posting_id (
          title
        )
      )
    `)
    .in('room_id', roomIds)
    .eq('sender_type', 'CANDIDATE')
    .in('status', ['SENT', 'READ']) // 未返信のメッセージ
    .order('sent_at', { ascending: false });

  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }

  return data || [];
}

/**
 * 面接結果情報を取得
 * ※実際のテーブル構造に応じて調整が必要
 */
async function getInterviewResults(companyAccountId: string, companyGroupIds: string[]) {
  // 面接済みだが選考結果が未登録の応募を取得
  // statusがRESPONDED（企業が返信済み、面接設定済み）で、72時間以上経過したものを探す
  const supabase = createServerAdminClient();
  const query = supabase
    .from('application')
    .select(`
      id,
      status,
      updated_at,
      created_at,
      candidate_id,
      job_posting_id,
      candidates!candidate_id (
        first_name,
        last_name,
        first_name_kana,
        last_name_kana
      ),
      job_postings!job_posting_id (
        title
      )
    `)
    .eq('company_account_id', companyAccountId)
    .eq('status', 'RESPONDED') // 面接設定済みのステータス
    .order('updated_at', { ascending: false });

  if (companyGroupIds.length > 0) {
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

      const appData = {
        id: app.id,
        candidateName,
        jobTitle,
        appliedAt
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
    // 候補者からの未読メッセージのみ処理
    if (msg.sender_type === 'CANDIDATE' && (msg.status === 'SENT' || !msg.read_at)) {
      const sentAt = new Date(msg.sent_at);
      const candidateName = formatCandidateName(msg.rooms?.candidates);
      const jobTitle = msg.rooms?.job_postings?.title || 'メッセージ';

      const msgData = {
        roomId: msg.room_id,
        candidateName,
        jobTitle,
        sentAt,
        messagePreview: msg.content?.substring(0, 50) || ''
      };

      if (sentAt >= twentyFourHoursAgo) {
        // Task 4: 24時間以内の新着メッセージ - 迅速返信で印象向上
        newMessages.push(msgData);
      } else if (sentAt <= fortyEightHoursAgo) {
        // Task 5: 48時間以上の遅延メッセージ - 候補者をお待たせ、至急対応
        overdueMessages.push(msgData);
      }
    }
  }

  console.log('💬 New messages (24h):', newMessages.length);
  console.log('💬 Overdue messages (48h+):', overdueMessages.length);

  // Task 4: 新着メッセージ（24時間以内）
  if (newMessages.length > 0) {
    taskData.hasNewMessage = true;
    taskData.newMessages = newMessages.slice(0, 5);
    console.log('✅ New message task triggered');
  }

  // Task 5: 遅延メッセージ（48時間以上）
  if (overdueMessages.length > 0) {
    taskData.hasUnreadMessage = true;
    taskData.unreadMessages = overdueMessages.slice(0, 5);
    console.log('⚠️ Overdue message task triggered');
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
      const interviewDate = interview.updated_at ? new Date(interview.updated_at) : undefined;

      return {
        id: interview.id,
        candidateName,
        jobTitle,
        interviewDate
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

  const supabase = createServerAdminClient();

  try {
    switch (taskType) {
      case 'APPLICATION':
        // 応募を既読（READ）に更新
        const { error: appError } = await supabase
          .from('application')
          .update({ status: 'READ', updated_at: new Date().toISOString() })
          .in('id', taskIds);
        
        if (appError) throw appError;
        break;
      
      case 'MESSAGE':
        // メッセージを既読に更新
        const { error: msgError } = await supabase
          .from('messages')
          .update({ 
            status: 'READ', 
            read_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .in('id', taskIds);
        
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

  const supabase = createServerAdminClient();

  try {
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
          .single();
        
        return appData;
      
      case 'MESSAGE':
        const { data: msgData } = await supabase
          .from('messages')
          .select(`
            *,
            rooms!room_id (
              *,
              candidates!candidate_id (*),
              job_postings!related_job_posting_id (*)
            )
          `)
          .eq('id', taskId)
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