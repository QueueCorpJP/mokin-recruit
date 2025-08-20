import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function PATCH(req: NextRequest) {
  try {
    const { jobId } = await req.json();
    if (!jobId) {
      return NextResponse.json({ error: 'jobId is required' }, { status: 400 });
    }
    const supabase = getSupabaseAdminClient();
    const { error } = await supabase
      .from('job_postings')
      .update({
        status: 'PUBLISHED',
        updated_at: new Date().toISOString(),
        published_at: new Date().toISOString(),
      })
      .eq('id', jobId);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
