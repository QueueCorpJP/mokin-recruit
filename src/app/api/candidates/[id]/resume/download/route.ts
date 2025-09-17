import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { generateDownloadUrl } from '@/lib/storage/resume';

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

    // Get candidate data to verify access and get resume pa
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('resume_url, resume_filename, first_name, last_name')
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

    // Create a meaningful download filename
    const downloadFileName =
      candidate.resume_filename ||
      `${candidate.last_name}${candidate.first_name}_履歴書.pdf`;

    // Generate signed download URL (expires in 1 hour)
    const downloadUrl = await generateDownloadUrl(
      candidate.resume_url,
      downloadFileName,
      3600
    );

    if (!downloadUrl) {
      return NextResponse.json(
        { error: 'Failed to generate download URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: downloadUrl,
      filename: downloadFileName,
      expires_in: 3600, // 1 hour
    });
  } catch (error) {
    console.error('Error getting resume download URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
