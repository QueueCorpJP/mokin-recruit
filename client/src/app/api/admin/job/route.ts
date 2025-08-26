import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    const supabase = getSupabaseAdminClient();
    
    let query = supabase
      .from('job_postings')
      .select(`
        id,
        updated_at,
        status,
        publication_type,
        job_type,
        industry,
        work_location,
        title,
        job_description,
        salary_min,
        salary_max,
        employment_type,
        created_at,
        published_at,
        company_accounts (
          id,
          company_name
        ),
        company_groups (
          id,
          group_name
        )
      `, { count: 'exact' })
      .order('updated_at', { ascending: false });

    // ステータスフィルター
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // 検索フィルター
    if (search) {
      query = query.or(`title.ilike.%${search}%,job_description.ilike.%${search}%,company_accounts.company_name.ilike.%${search}%`);
    }

    // ページネーション
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error('Jobs fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      jobs: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit)
      }
    });
  } catch (error) {
    console.error('Jobs fetch error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const jobData = await req.json();
    
    const supabase = getSupabaseAdminClient();
    
    // 必須フィールドの検証
    if (!jobData.company_group_id || !jobData.title) {
      return NextResponse.json(
        { error: 'Company group ID and title are required' },
        { status: 400 }
      );
    }

    // job_postingsテーブルに挿入
    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        company_group_id: jobData.company_group_id,
        company_account_id: jobData.company_account_id,
        title: jobData.title,
        job_description: jobData.job_description,
        position_summary: jobData.position_summary,
        required_skills: jobData.required_skills,
        preferred_skills: jobData.preferred_skills,
        salary_min: jobData.salary_min,
        salary_max: jobData.salary_max,
        salary_note: jobData.salary_note,
        employment_type: jobData.employment_type,
        employment_type_note: jobData.employment_type_note,
        work_location: jobData.work_locations,
        location_note: jobData.location_note,
        working_hours: jobData.working_hours,
        overtime: jobData.overtime,
        overtime_info: jobData.overtime_info,
        holidays: jobData.holidays,
        remote_work_available: jobData.remote_work_available || false,
        job_type: jobData.job_types,
        industry: jobData.industries,
        selection_process: jobData.selection_process,
        appeal_points: jobData.appeal_points,
        smoking_policy: jobData.smoking_policy,
        smoking_policy_note: jobData.smoking_policy_note,
        required_documents: jobData.required_documents,
        internal_memo: jobData.internal_memo,
        publication_type: jobData.publication_type || 'public',
        image_urls: jobData.image_urls || [],
        status: jobData.status || 'DRAFT',
        application_deadline: jobData.application_deadline,
        published_at: jobData.status === 'PUBLISHED' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) {
      console.error('Job creation error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Job creation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}