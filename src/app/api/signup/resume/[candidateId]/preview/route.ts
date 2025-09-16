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
  { params }: { params: { candidateId: string } }
) {
  try {
    const candidateId = params.candidateId;
    const { searchParams } = new URL(request.url);
    const fileType = searchParams.get('type'); // 'resume' or 'career'

    if (!fileType || !['resume', 'career'].includes(fileType)) {
      return NextResponse.json(
        { error: 'Invalid file type. Must be "resume" or "career"' },
        { status: 400 }
      );
    }

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

    // Find the appropriate file based on type
    const supabaseStorage = supabase.storage.from('resumes');

    // List files in the candidate directory
    const { data: files, error: filesError } = await supabaseStorage.list(
      candidateId,
      {
        limit: 100,
      }
    );

    if (filesError || !files) {
      return NextResponse.json(
        { error: 'Failed to list files' },
        { status: 500 }
      );
    }

    // Find the requested file type
    const targetFile = files.find(file => {
      if (fileType === 'resume') {
        return file.name.startsWith('resume_');
      } else if (fileType === 'career') {
        return file.name.startsWith('career_summary_');
      }
      return false;
    });

    if (!targetFile) {
      return NextResponse.json(
        { error: `No ${fileType} file found` },
        { status: 404 }
      );
    }

    const filePath = `${candidateId}/${targetFile.name}`;

    // Generate signed URL for secure access (expires in 30 minutes)
    const signedUrl = await generateSignedUrl(filePath, 1800);

    if (!signedUrl) {
      return NextResponse.json(
        { error: 'Failed to generate access URL' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      url: signedUrl,
      filename: targetFile.name,
      type: fileType,
      expires_in: 1800, // 30 minutes
    });
  } catch (error) {
    console.error('Error getting signup resume preview URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
