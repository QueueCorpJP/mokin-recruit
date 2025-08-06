'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface Room {
  id: string;
  companyName: string;
  candidateName: string;
  lastMessage?: string;
  lastMessageTime?: string;
  isUnread?: boolean;
  jobTitle: string;
  groupName?: string;
}

export async function getRooms(userId: string, userType: 'candidate' | 'company'): Promise<Room[]> {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // Ignore cookie setting errors in Server Actions
          }
        },
      },
    }
  );

  try {
    // ユーザーが参加しているルームを取得
    const { data: participantRooms, error: participantError } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        rooms!inner(
          id,
          type,
          created_at,
          related_job_posting_id
        )
      `)
      .eq(
        userType === 'candidate' ? 'candidate_id' : 'company_user_id',
        userId
      )
      .eq(
        'participant_type',
        userType === 'candidate' ? 'CANDIDATE' : 'COMPANY_USER'
      );

    if (participantError) {
      console.error('Error fetching participant rooms:', participantError);
      return [];
    }

    if (!participantRooms || participantRooms.length === 0) {
      return [];
    }

    const roomIds = participantRooms.map((pr: any) => pr.room_id);

    // 各ルームの参加者情報を取得
    const { data: allParticipants, error: participantsError } = await supabase
      .from('room_participants')
      .select(`
        room_id,
        participant_type,
        candidate_id,
        company_user_id,
        candidates(
          id,
          first_name,
          last_name
        ),
        company_users(
          id,
          full_name,
          company_account_id,
          company_accounts(
            company_name
          )
        )
      `)
      .in('room_id', roomIds);

    if (participantsError) {
      console.error('Error fetching all participants:', participantsError);
      return [];
    }

    // 各ルームの最新メッセージを取得
    const { data: latestMessages, error: messagesError } = await supabase
      .from('messages')
      .select(`
        room_id,
        content,
        created_at,
        status
      `)
      .in('room_id', roomIds)
      .order('created_at', { ascending: false });

    if (messagesError) {
      console.error('Error fetching latest messages:', messagesError);
    }

    // 関連する求人情報を取得
    const jobPostingIds = participantRooms
      .map((pr: any) => pr.rooms?.related_job_posting_id)
      .filter(Boolean);

    let jobPostings: any[] = [];
    if (jobPostingIds.length > 0) {
      const { data: jobData, error: jobError } = await supabase
        .from('job_postings')
        .select('id, job_title')
        .in('id', jobPostingIds);

      if (!jobError) {
        jobPostings = jobData || [];
      }
    }

    // データを組み立て
    const rooms: Room[] = participantRooms.map((pr: any) => {
      const roomId = pr.room_id;
      const room = pr.rooms;

      // このルームの参加者を取得（現在のユーザー以外）
      const roomParticipants = allParticipants?.filter((p: any) => p.room_id === roomId) || [];
      const otherParticipant = roomParticipants.find((p: any) => {
        if (userType === 'candidate') {
          return p.participant_type === 'COMPANY_USER';
        } else {
          return p.participant_type === 'CANDIDATE';
        }
      });

      // 会社名と候補者名を取得
      let companyName = '';
      let candidateName = '';
      let groupName = '';

      if (userType === 'candidate') {
        // 候補者の場合、相手は企業ユーザー
        const companyUser = otherParticipant?.company_users;
        if (companyUser) {
          companyName = companyUser.full_name;
          groupName = companyUser.company_accounts?.company_name || '';
        }
        const currentCandidate = roomParticipants.find((p: any) => p.candidate_id === userId)?.candidates;
        if (currentCandidate) {
          candidateName = `${currentCandidate.last_name} ${currentCandidate.first_name}`;
        }
      } else {
        // 企業の場合、相手は候補者
        const candidate = otherParticipant?.candidates;
        if (candidate) {
          candidateName = `${candidate.last_name} ${candidate.first_name}`;
        }
        const currentCompanyUser = roomParticipants.find((p: any) => p.company_user_id === userId)?.company_users;
        if (currentCompanyUser) {
          companyName = currentCompanyUser.full_name;
          groupName = currentCompanyUser.company_accounts?.company_name || '';
        }
      }

      // 最新メッセージを取得
      const roomMessages = latestMessages?.filter((m: any) => m.room_id === roomId) || [];
      const latestMessage = roomMessages[0];

      // 求人タイトルを取得
      const jobPosting = jobPostings.find((jp: any) => jp.id === room?.related_job_posting_id);
      const jobTitle = jobPosting?.job_title || '求人情報なし';

      // 未読判定
      const hasUnread = roomMessages.some((m: any) => m.status !== 'READ');

      return {
        id: roomId,
        companyName,
        candidateName,
        lastMessage: latestMessage?.content || '',
        lastMessageTime: latestMessage ? new Date(latestMessage.created_at).toLocaleString('ja-JP') : '',
        isUnread: hasUnread,
        jobTitle,
        groupName,
      };
    });

    return rooms;

  } catch (error) {
    console.error('Error in getRooms:', error);
    return [];
  }
}