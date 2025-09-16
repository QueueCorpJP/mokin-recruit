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

    // Get candidate data to verify access
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

    // List files in the candidate directory
    const supabaseStorage = supabase.storage.from('resumes');
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

    // Create a meaningful download filename
    const fileExtension = targetFile.name.split('.').pop();
    const downloadFileName =
      fileType === 'resume'
        ? `${candidate.last_name || ''}${candidate.first_name || ''}_履歴書.${fileExtension}`
        : `${candidate.last_name || ''}${candidate.first_name || ''}_職務経歴書.${fileExtension}`;

    // Generate signed download URL (expires in 30 minutes)
    const downloadUrl = await generateDownloadUrl(
      filePath,
      downloadFileName,
      1800
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
      type: fileType,
      expires_in: 1800, // 30 minutes
    });
  } catch (error) {
    console.error('Error getting signup resume download URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
