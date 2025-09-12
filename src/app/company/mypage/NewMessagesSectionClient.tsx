'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Message } from './NewMessageItem';
import { NewMessageList } from './NewMessageList';

export function NewMessagesSectionClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            sent_at,
            room_id,
            status,
            rooms!room_id (
              id,
              candidates!candidate_id (
                first_name,
                last_name
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
          .order('sent_at', { ascending: false })
          .limit(3);

        if (error) {
          // 失敗してもUIは継続
          console.error('[NewMessagesSectionClient] fetch error:', error);
          if (mounted) setMessages([]);
          return;
        }

        const mapped: Message[] = (data || []).map((msg: any) => ({
          id: msg.id,
          date: new Date(msg.sent_at).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
          }),
          group:
            (msg.rooms?.company_groups?.group_name as string) ||
            (msg.rooms?.company_groups?.company_accounts?.company_name as string) ||
            'グループ',
          user: `${msg.rooms?.candidates?.last_name || ''} ${msg.rooms?.candidates?.first_name || ''}`.trim() || '候補者',
          content:
            msg.content && msg.content.length > 50
              ? msg.content.substring(0, 50) + '...'
              : msg.content || '',
          room_id: msg.room_id,
        }));

        if (mounted) setMessages(mapped);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchMessages();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col gap-2 mt-2 mb-6'>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className='w-full bg-white px-6 py-4 rounded-lg'
            style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}
          >
            <div className='flex items-center gap-6'>
              <div className='w-16 h-3 bg-gray-200 animate-pulse rounded' />
              <div className='w-40 h-8 bg-gray-200 animate-pulse rounded' />
              <div className='w-28 h-4 bg-gray-200 animate-pulse rounded' />
              <div className='flex-1 h-4 bg-gray-100 animate-pulse rounded' />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return <NewMessageList messages={messages} />;
}

export default NewMessagesSectionClient;


