import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { CandidateDetailData } from '../../page';
import CandidateEditConfirmClient from './CandidateEditConfirmClient';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    data?: string;
  }>;
}

async function getCandidateData(id: string): Promise<CandidateDetailData | null> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data: candidate, error } = await supabase
      .from('candidates')
      .select(`
        *,
        education(*),
        work_experience(*),
        job_type_experience(*),
        skills(*)
      `)
      .eq('id', id)
      .single();

    if (error) {
      if (process.env.NODE_ENV === 'development') console.error('Error fetching candidate:', error);
      return null;
    }

    return candidate;
  } catch (error) {
    if (process.env.NODE_ENV === 'development') console.error('Error fetching candidate data:', error);
    return null;
  }
}

export default async function CandidateEditConfirmPage({ params, searchParams }: Props) {
  const { id } = await params;
  const candidate = await getCandidateData(id);
  
  if (!candidate) {
    notFound();
  }

  // FormData will be retrieved from sessionStorage in the client component
  return <CandidateEditConfirmClient candidate={candidate} formData={null} />;
}