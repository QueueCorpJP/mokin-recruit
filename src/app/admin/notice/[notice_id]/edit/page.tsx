import React from 'react';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import NoticeEditClient from './NoticeEditClient';

interface NoticeEditPageProps {
  params: Promise<{
    notice_id: string;
  }>;
}

interface NoticeDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  thumbnail_url: string | null;
  status: string;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
  meta_title: string | null;
  meta_description: string | null;
}

async function fetchNoticeDetail(noticeId: string): Promise<NoticeDetail | null> {
  const supabase = getSupabaseAdminClient();
  
  const { data, error } = await supabase
    .from('notices')
    .select('*')
    .eq('id', noticeId)
    .single();

  if (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching notice detail:', error);
    return null;
  }

  return data as NoticeDetail;
}

export default async function NoticeEditPage({ params }: NoticeEditPageProps) {
  const { notice_id } = await params;
  const noticeDetail = await fetchNoticeDetail(notice_id);

  if (!noticeDetail) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mt-20">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">お知らせが見つかりません</h1>
          </div>
        </div>
      </div>
    );
  }

  return <NoticeEditClient initialNotice={noticeDetail} />;
}