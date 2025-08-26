import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const { job_id } = params;
    
    if (!job_id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', job_id);

    if (error) {
      console.error('Job deletion error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Job deletion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const { job_id } = params;
    
    if (!job_id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('job_postings')
      .select(`
        *,
        company_accounts (
          company_name,
          industry
        ),
        company_groups (
          group_name
        )
      `)
      .eq('id', job_id)
      .single();

    if (error) {
      console.error('Job fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Job fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { job_id: string } }
) {
  try {
    const { job_id } = params;
    const updates = await req.json();
    
    if (!job_id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase
      .from('job_postings')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', job_id)
      .select()
      .single();

    if (error) {
      console.error('Job update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Job update error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}