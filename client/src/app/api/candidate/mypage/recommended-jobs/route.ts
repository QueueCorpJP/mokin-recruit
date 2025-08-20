import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// TODO: 本番では認証ミドルウェアで候補者IDを取得する
async function getCandidateIdFromRequest(
  request: NextRequest
): Promise<string | null> {
  const email = 'sekiguchishunya0619@gmail.com';
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('candidates')
    .select('id')
    .eq('email', email)
    .single();
  if (error || !data) return null;
  return data.id;
}

export async function GET(request: NextRequest) {
  const candidateId = await getCandidateIdFromRequest(request);
  if (!candidateId) {
    return NextResponse.json({ error: '認証情報が無効です' }, { status: 401 });
  }

  const supabase = await createClient();
  // 候補者の希望職種・勤務地を取得
  const { data: candidate, error: candidateError } = await supabase
    .from('candidates')
    .select('desired_job_types, desired_locations')
    .eq('id', candidateId)
    .single();
  if (candidateError || !candidate) {
    return NextResponse.json({ jobs: [] });
  }
  const { desired_job_types, desired_locations } = candidate;
  if (
    !desired_job_types ||
    !desired_locations ||
    desired_job_types.length === 0 ||
    desired_locations.length === 0
  ) {
    return NextResponse.json({ jobs: [] });
  }

  // job_postingsテーブルで両方合致する求人を取得
  const { data: jobs, error: jobsError } = await supabase
    .from('job_postings')
    .select('*')
    .eq('status', 'PUBLISHED')
    .order('published_at', { ascending: false })
    .limit(50); // まず多めに取得

  if (jobsError || !jobs) {
    return NextResponse.json({ jobs: [] });
  }

  // 両方合致するものだけに絞る
  const filtered = jobs
    .filter((job: any) => {
      if (!Array.isArray(job.job_type) || !Array.isArray(job.work_location))
        return false;
      const jobTypeMatch = job.job_type.some((t: string) =>
        desired_job_types.includes(t)
      );
      const locationMatch = job.work_location.some((l: string) =>
        desired_locations.includes(l)
      );
      return jobTypeMatch && locationMatch;
    })
    .slice(0, 5);

  return NextResponse.json({ jobs: filtered });
}
