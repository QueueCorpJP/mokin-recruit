import { ChevronRightIcon } from 'lucide-react';
import { FaqBox } from '@/components/ui/FaqBox';
import { SectionHeading } from '@/components/ui/SectionHeading';
// import { Button } from '@/components/ui/button';
import { getCachedCandidateUser } from '@/lib/auth/server';
import { getSupabaseServerClient } from '@/lib/supabase/server-client';
import { getRooms } from '@/lib/rooms';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import SharedBanner from '@/components/ui/SharedBanner';

const TaskList = dynamic(() => import('./TaskList'), {
  loading: () => (
    <div className='bg-white rounded-[10px] p-6 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'>
      <div className='animate-pulse space-y-4'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='flex items-center p-4 border border-gray-200 rounded'
          >
            <div className='w-4 h-4 bg-gray-200 rounded mr-4'></div>
            <div className='flex-1'>
              <div className='h-4 bg-gray-200 rounded w-3/4 mb-2'></div>
              <div className='h-3 bg-gray-200 rounded w-1/2'></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
});

// 包括的なやることリスト取得関数（mypageから移植）
async function getTaskData(candidateId: string) {
  const tasks: unknown[] = [];
  const client = await getSupabaseServerClient();

  try {
    // 1. プロフィール完成度チェック
    const { data: candidate } = await client
      .from('candidates')
      .select('*')
      .eq('id', candidateId)
      .single();

    if (candidate) {
      // 基本情報チェック
      if (!candidate.last_name || !candidate.first_name) {
        tasks.push({
          id: 'profile-name',
          title: '氏名を登録してください',
          description: 'プロフィールの基本情報から氏名を入力してください',
        });
      }

      if (!candidate.phone_number) {
        tasks.push({
          id: 'profile-phone',
          title: '電話番号を登録してください',
          description: '企業からの連絡に必要な電話番号を登録してください',
        });
      }

      // キャリア状況チェック（career_status_entriesテーブルを参照）
      const { data: careerStatusEntries } = await client
        .from('career_status_entries')
        .select('*')
        .eq('candidate_id', candidateId);

      if (!careerStatusEntries || careerStatusEntries.length === 0) {
        tasks.push({
          id: 'career-status',
          title: '転職活動状況を設定してください',
          description: '転職経験の有無や現在の活動状況を入力してください',
        });
      }

      // 自己PR・職務要約チェック
      if (!candidate.job_summary || !candidate.self_pr) {
        tasks.push({
          id: 'profile-summary',
          title: '職務要約・自己PRを入力してください',
          description: 'あなたの経験とアピールポイントを記載してください',
        });
      }

      // 履歴書チェック
      if (!candidate.resume_url) {
        tasks.push({
          id: 'resume-upload',
          title: '履歴書をアップロードしてください',
          description: '応募時に必要な履歴書ファイルをアップロードしてください',
        });
      }
    }

    // 2. 学歴情報チェック
    const { data: education } = await client
      .from('education')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();

    if (!education) {
      tasks.push({
        id: 'education-info',
        title: '学歴情報を登録してください',
        description: '最終学歴を入力してください',
      });
    }

    // 3. スキル情報チェック
    const { data: skills } = await client
      .from('skills')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();

    if (!skills || skills.skills_list?.length === 0) {
      tasks.push({
        id: 'skills-info',
        title: 'スキル情報を登録してください',
        description: '保有スキルや資格を入力してください',
      });
    }

    // 4. 直近の職歴チェック（candidatesテーブルのrecent_job_*フィールドを参照）
    if (
      !candidate.recent_job_company_name ||
      !candidate.recent_job_department_position ||
      !candidate.recent_job_start_year ||
      !candidate.recent_job_industries ||
      !candidate.recent_job_types ||
      !candidate.recent_job_description
    ) {
      tasks.push({
        id: 'recent-job',
        title: '直近の職歴を登録してください',
        description: '直近の勤務先と職務内容を入力してください',
      });
    }

    // 5. 期待条件テーブルチェック（expectationsテーブルを参照）
    const { data: expectations } = await client
      .from('expectations')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();

    if (
      !expectations ||
      !expectations.desired_income ||
      !expectations.desired_industries ||
      (expectations.desired_industries as any[])?.length === 0 ||
      !expectations.desired_job_types ||
      (expectations.desired_job_types as any[])?.length === 0 ||
      !expectations.desired_work_locations ||
      (expectations.desired_work_locations as any[])?.length === 0
    ) {
      tasks.push({
        id: 'expectations-settings',
        title: '希望条件を設定してください',
        description: '希望年収・業界・職種・勤務地を設定してください',
      });
    }

    // 6. 未返信スカウトチェック
    const seventyTwoHoursAgo = new Date(
      Date.now() - 72 * 60 * 60 * 1000
    ).toISOString();
    const { data: unrepliedScouts } = await client
      .from('scout_sends')
      .select('*')
      .eq('candidate_id', candidateId)
      .in('status', ['sent', 'read'])
      .gte('sent_at', seventyTwoHoursAgo);

    if (unrepliedScouts && unrepliedScouts.length > 0) {
      tasks.push({
        id: 'scout-reply',
        title: `${unrepliedScouts.length}件のスカウトに返信してください`,
        description: '72時間以内の返信を推奨します',
      });
    }

    // 7. 応募後の対応チェック
    const { data: applications } = await client
      .from('application')
      .select('*')
      .eq('candidate_id', candidateId)
      .eq('status', 'RESPONDED');

    if (applications && applications.length > 0) {
      tasks.push({
        id: 'application-response',
        title: `${applications.length}件の応募に企業から返信があります`,
        description: '企業からの返信を確認してください',
      });
    }

    // 8. 選考中のステータス確認
    const { data: selections } = await client
      .from('selection_progress')
      .select('*, job_postings(title)')
      .eq('candidate_id', candidateId)
      .or(
        'document_screening_result.eq.pending,first_interview_result.eq.pending,secondary_interview_result.eq.pending,final_interview_result.eq.pending'
      );

    if (selections && selections.length > 0) {
      tasks.push({
        id: 'selection-status',
        title: `${selections.length}件の選考が進行中です`,
        description: '選考状況を確認してください',
      });
    }

    // 9. 通知設定チェック
    const { data: notificationSettings } = await client
      .from('notification_settings')
      .select('*')
      .eq('candidate_id', candidateId)
      .single();

    if (!notificationSettings) {
      tasks.push({
        id: 'notification-settings',
        title: '通知設定を確認してください',
        description: '重要な通知を見逃さないよう設定を確認してください',
      });
    }

    // 10. 未読メッセージチェック
    const rooms = await getRooms(candidateId, 'candidate');
    const unreadRooms = rooms.filter(
      (room: { unreadCount?: number }) =>
        room.unreadCount && room.unreadCount > 0
    );

    if (unreadRooms.length > 0) {
      tasks.push({
        id: 'unread-messages',
        title: `${unreadRooms.length}件の未読メッセージがあります`,
        description: '企業からのメッセージを確認してください',
      });
    }

    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

export default async function CandidateTaskPage() {
  const user = await getCachedCandidateUser();

  if (!user) {
    redirect('/candidate/auth/login');
  }

  const tasks = await getTaskData(user.id);

  const headingListStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const qaLinkBoxStyle: React.CSSProperties = {
    background: '#fff',
    padding: '15px 24px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    cursor: 'pointer',
    fontWeight: 700,
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
  };

  const qaLinkTextStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
    color: '#0F9058',
    lineHeight: '200%',
    margin: 0,
    whiteSpace: 'normal',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    wordBreak: 'break-word',
  };

  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          <div className='max-w-[880px] md:px-6 flex-1 box-border w-full'>
            <div style={{ marginBottom: '8px' }}>
              <SectionHeading
                iconSrc='/images/list.svg'
                iconAlt='やることリストアイコン'
              >
                やることリスト
              </SectionHeading>
            </div>

            <TaskList tasks={tasks} />
          </div>

          <div className='w-full md:max-w-[320px] md:flex-none'>
            <div className='mb-20'>
              <SharedBanner
                width={1200}
                height={300}
                quality={85}
                sizes='(max-width: 768px) 100vw, 320px'
              />
            </div>
            <div style={headingListStyle}>
              <SectionHeading
                iconSrc='/images/question.svg'
                iconAlt='よくある質問アイコン'
              >
                よくある質問
              </SectionHeading>
              <FaqBox
                title='退会したい場合はどうすれば良いですか？退会手続きの流れを教えてください'
                body='マイページの「アカウント設定」から「退会」ボタンを押し、画面の案内に従って手続きを進めてください。退会後はすべてのデータが削除されます。'
              />
              <FaqBox
                title='パスワードを忘れた場合はどうすれば良いですか？'
                body='ログイン画面の「パスワードをお忘れですか？」リンクから再設定手続きを行ってください。'
              />
              <FaqBox
                title='登録したメールアドレスを変更したいです'
                body='マイページの「アカウント設定」からメールアドレスの変更が可能です。'
              />
              <FaqBox
                title='求人への応募方法を教えてください'
                body='求人詳細ページの「応募する」ボタンから応募手続きを進めてください。'
              />
              <FaqBox
                title='企業からのスカウトを受け取るにはどうすれば良いですか？'
                body='プロフィールを充実させることで、企業からのスカウトを受けやすくなります。'
              />
              <FaqBox
                title='面接日程の調整はどのように行いますか？'
                body='メッセージ機能を使って企業担当者と直接日程調整が可能です。'
              />
              <div style={qaLinkBoxStyle}>
                <span
                  style={{
                    ...qaLinkTextStyle,
                    fontWeight: 'bold',
                    fontFamily:
                      "'Noto Sans JP', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif",
                  }}
                >
                  Q&A一覧を見る
                </span>
                <ChevronRightIcon
                  className='h-[16px] w-auto'
                  style={{
                    display: 'block',
                    marginLeft: '12px',
                    color: '#0F9058',
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
