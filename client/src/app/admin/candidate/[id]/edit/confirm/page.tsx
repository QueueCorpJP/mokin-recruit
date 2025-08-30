import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { CandidateDetailData } from '../../page';
import CandidateEditConfirmClient from './CandidateEditConfirmClient';
import { notFound } from 'next/navigation';

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    data?: string;
  };
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
      console.error('Error fetching candidate:', error);
      return null;
    }

    return candidate;
  } catch (error) {
    console.error('Error fetching candidate data:', error);
    return null;
  }
}

export default async function CandidateEditConfirmPage({ params, searchParams }: Props) {
  const candidate = await getCandidateData(params.id);
  
  if (!candidate) {
    notFound();
  }

  // Get the form data from search params
  const formDataString = searchParams.data;
  if (!formDataString) {
    notFound();
  }

  let formData;
  try {
    formData = JSON.parse(decodeURIComponent(formDataString));
  } catch (error) {
    console.error('Error parsing form data:', error);
    notFound();
  }

  return <CandidateEditConfirmClient candidate={candidate} formData={formData} />;
}