import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createSupabaseClient() {
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

// サーバーコンポーネント専用のSupabaseクライアント（サービスロール）
export async function createSupabaseServiceClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async get() {
          return undefined;
        },
        async set() {},
        async remove() {},
      },
    }
  );
}

export async function generateSignedUrl(
  filePath: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, expiresIn, {
        download: false, // Set to true if you want to force download
      });

    if (error) {
      console.error('Error generating signed URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Failed to generate signed URL:', error);
    return null;
  }
}

export async function generateDownloadUrl(
  filePath: string,
  fileName?: string,
  expiresIn: number = 3600
): Promise<string | null> {
  try {
    const supabase = await createSupabaseClient();

    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(filePath, expiresIn, {
        download: fileName || true, // Force download with optional custom filename
      });

    if (error) {
      console.error('Error generating download URL:', error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error('Failed to generate download URL:', error);
    return null;
  }
}

export async function getResumeUrl(
  candidateId: string,
  resumeFileName: string
): Promise<string | null> {
  const filePath = `${candidateId}/${resumeFileName}`;
  return await generateSignedUrl(filePath);
}

export async function getResumeDownloadUrl(
  candidateId: string,
  resumeFileName: string,
  downloadFileName?: string
): Promise<string | null> {
  const filePath = `${candidateId}/${resumeFileName}`;
  return await generateDownloadUrl(filePath, downloadFileName);
}

// ===== サーバーコンポーネント専用関数 =====

export async function getResumeUrlForServer(
  candidateId: string,
  expiresIn: number = 3600
): Promise<{
  resumeUrl: string | null;
  careerUrl: string | null;
  candidate: any;
}> {
  try {
    const supabase = await createSupabaseServiceClient();

    // 候補者情報とファイル情報を取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, first_name, last_name, resume_url, resume_filename')
      .eq('id', candidateId)
      .single();

    if (candidateError || !candidate) {
      return { resumeUrl: null, careerUrl: null, candidate: null };
    }

    // ファイル一覧を取得
    const { data: files, error: filesError } = await supabase.storage
      .from('resumes')
      .list(candidateId, { limit: 100 });

    if (filesError || !files) {
      return { resumeUrl: null, careerUrl: null, candidate };
    }

    // 履歴書と職務経歴書のファイルを検索
    const resumeFile = files.find(file => file.name.startsWith('resume_'));
    const careerFile = files.find(file =>
      file.name.startsWith('career_summary_')
    );

    // Signed URLを生成
    let resumeUrl: string | null = null;
    let careerUrl: string | null = null;

    if (resumeFile) {
      const { data: resumeData } = await supabase.storage
        .from('resumes')
        .createSignedUrl(`${candidateId}/${resumeFile.name}`, expiresIn);
      resumeUrl = resumeData?.signedUrl || null;
    }

    if (careerFile) {
      const { data: careerData } = await supabase.storage
        .from('resumes')
        .createSignedUrl(`${candidateId}/${careerFile.name}`, expiresIn);
      careerUrl = careerData?.signedUrl || null;
    }

    return { resumeUrl, careerUrl, candidate };
  } catch (error) {
    console.error('Error getting resume URLs for server:', error);
    return { resumeUrl: null, careerUrl: null, candidate: null };
  }
}

export async function getResumeDownloadUrlForServer(
  candidateId: string,
  fileType: 'resume' | 'career',
  expiresIn: number = 3600
): Promise<{ url: string | null; filename: string | null }> {
  try {
    const supabase = await createSupabaseServiceClient();

    // 候補者情報を取得
    const { data: candidate, error: candidateError } = await supabase
      .from('candidates')
      .select('id, first_name, last_name')
      .eq('id', candidateId)
      .single();

    if (candidateError || !candidate) {
      return { url: null, filename: null };
    }

    // ファイル一覧を取得
    const { data: files, error: filesError } = await supabase.storage
      .from('resumes')
      .list(candidateId, { limit: 100 });

    if (filesError || !files) {
      return { url: null, filename: null };
    }

    // 指定されたファイルタイプを検索
    const targetFile = files.find(file => {
      if (fileType === 'resume') {
        return file.name.startsWith('resume_');
      } else {
        return file.name.startsWith('career_summary_');
      }
    });

    if (!targetFile) {
      return { url: null, filename: null };
    }

    // ダウンロード用ファイル名を生成
    const fileExtension = targetFile.name.split('.').pop();
    const downloadFilename =
      fileType === 'resume'
        ? `${candidate.last_name || ''}${candidate.first_name || ''}_履歴書.${fileExtension}`
        : `${candidate.last_name || ''}${candidate.first_name || ''}_職務経歴書.${fileExtension}`;

    // Signed Download URLを生成
    const { data, error } = await supabase.storage
      .from('resumes')
      .createSignedUrl(`${candidateId}/${targetFile.name}`, expiresIn, {
        download: downloadFilename,
      });

    if (error || !data) {
      return { url: null, filename: null };
    }

    return { url: data.signedUrl, filename: downloadFilename };
  } catch (error) {
    console.error('Error getting resume download URL for server:', error);
    return { url: null, filename: null };
  }
}

// signup段階でのサーバーコンポーネント専用関数
export async function getSignupResumeUrlsForServer(
  candidateId: string,
  expiresIn: number = 1800
): Promise<{
  resumeUrl: string | null;
  careerUrl: string | null;
  resumeFilename: string | null;
  careerFilename: string | null;
}> {
  try {
    const supabase = await createSupabaseServiceClient();

    // ファイル一覧を取得
    const { data: files, error: filesError } = await supabase.storage
      .from('resumes')
      .list(candidateId, { limit: 100 });

    if (filesError || !files) {
      return {
        resumeUrl: null,
        careerUrl: null,
        resumeFilename: null,
        careerFilename: null,
      };
    }

    // 履歴書と職務経歴書のファイルを検索
    const resumeFile = files.find(file => file.name.startsWith('resume_'));
    const careerFile = files.find(file =>
      file.name.startsWith('career_summary_')
    );

    // Signed URLを生成
    let resumeUrl: string | null = null;
    let careerUrl: string | null = null;

    if (resumeFile) {
      const { data: resumeData } = await supabase.storage
        .from('resumes')
        .createSignedUrl(`${candidateId}/${resumeFile.name}`, expiresIn);
      resumeUrl = resumeData?.signedUrl || null;
    }

    if (careerFile) {
      const { data: careerData } = await supabase.storage
        .from('resumes')
        .createSignedUrl(`${candidateId}/${careerFile.name}`, expiresIn);
      careerUrl = careerData?.signedUrl || null;
    }

    return {
      resumeUrl,
      careerUrl,
      resumeFilename: resumeFile?.name || null,
      careerFilename: careerFile?.name || null,
    };
  } catch (error) {
    console.error('Error getting signup resume URLs for server:', error);
    return {
      resumeUrl: null,
      careerUrl: null,
      resumeFilename: null,
      careerFilename: null,
    };
  }
}
