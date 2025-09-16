import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { generateSignedUrl } from '@/lib/storage/resume';

async function createSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const candidateId = params.id;
    const supabase = await createSupabaseClient();

    // Get candidate data to verify access and get resume path
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('resume_url, resume_filename')
      .eq('id', candidateId)
      .single();

    if (candidateError || !candidate) {
      return NextResponse.json(
        { error: 'Candidate not found' },
        { status: 404 }
      );
    }

    if (!candidate.resume_url) {
      return NextResponse.json(
        { error: 'No resume file found' },
        { status: 404 }
      );
    }

    // Generate signed URL for secure access (expires in 1 hour)
    const signedUrl = await generateSignedUrl(candidate.resume_url, 3600);

    if (!signedUrl) {
      return NextResponse.json(
        { error: 'Failed to generate access URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: signedUrl,
      filename: candidate.resume_filename,
      expires_in: 3600, // 1 hour
    });
  } catch (error) {
    console.error('Error getting resume URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
