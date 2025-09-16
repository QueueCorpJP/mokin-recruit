'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Get or create candidate ID for signup process
export async function getOrCreateCandidateId(): Promise<string> {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
        async set(name: string, value: string, options: any) {
          const cookieStore = await cookies();
          cookieStore.set(name, value, options);
        },
      },
    }
  );

  // First check if we have a candidate ID in cookies
  const cookieStore = await cookies();
  const existingCandidateId = cookieStore.get('signup_candidate_id')?.value;

  if (existingCandidateId) {
    // Verify this candidate ID exists in the database
    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('id', existingCandidateId)
      .single();

    if (candidate) {
      return existingCandidateId;
    }
  }

  // If no valid candidate ID exists, get the most recent one or create new one
  const { data: recentCandidate } = await supabase
    .from('candidates')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let candidateId: string;

  if (recentCandidate) {
    candidateId = recentCandidate.id;
  } else {
    // Create a new candidate record if none exists
    const { data: newCandidate, error } = await supabase
      .from('candidates')
      .insert({
        email: `temp-${Date.now()}@example.com`, // Temporary email
        status: 'temporary', // 仮登録状態
      })
      .select('id')
      .single();

    if (error || !newCandidate) {
      throw new Error('Failed to create candidate record');
    }

    candidateId = newCandidate.id;
  }

  // Store the candidate ID in a cookie
  cookieStore.set('signup_candidate_id', candidateId, {
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return candidateId;
}

// Get existing candidate ID from cookies/database
export async function getCandidateId(): Promise<string | null> {
  const cookieStore = await cookies();
  const candidateId = cookieStore.get('signup_candidate_id')?.value;

  if (!candidateId) {
    return null;
  }

  // Verify the candidate exists in database
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          const cookieStore = await cookies();
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const { data: candidate } = await supabase
    .from('candidates')
    .select('id')
    .eq('id', candidateId)
    .single();

  return candidate ? candidateId : null;
}
