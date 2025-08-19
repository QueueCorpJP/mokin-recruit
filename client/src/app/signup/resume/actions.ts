'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getOrCreateCandidateId } from '@/lib/signup/candidateId';

export async function uploadResumeFiles(formData: FormData) {
  console.log('=== Start uploadResumeFiles ===');
  try {
    // 環境変数の確認
    console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + '...');
    console.log('SUPABASE_KEY exists:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    // サインアップ段階では認証不要なので、直接Supabaseクライアントを作成
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
    
    console.log('Supabase client created successfully');
    
    // Get or create candidate ID using the centralized function
    const candidateId = await getOrCreateCandidateId();
    console.log('Using candidate ID for resume upload:', candidateId);

    const resumeFile = formData.get('resumeFile') as File | null;
    const careerSummaryFile = formData.get('careerSummaryFile') as File | null;
    const agreement = formData.get('agreement') === 'true';

    // バリデーション
    if (!agreement) {
      throw new Error('アップロードには同意が必要です');
    }

    if (!resumeFile && !careerSummaryFile) {
      throw new Error('少なくとも1つのファイルをアップロードしてください');
    }

    const uploadResults: string[] = [];
    let resumeUrl = '';
    let resumeFilename = '';

    // 履歴書のアップロード
    if (resumeFile) {
      console.log('Uploading resume file:', resumeFile.name, resumeFile.size, resumeFile.type);
      const fileExt = resumeFile.name.split('.').pop();
      const fileName = `${candidateId}/resume_${Date.now()}.${fileExt}`;
      
      console.log('Target file path:', fileName);
      
      const { data: resumeUploadData, error: resumeUploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, resumeFile, {
          cacheControl: '3600',
          upsert: false
        });

      console.log('Resume upload result:', { data: resumeUploadData, error: resumeUploadError });

      if (resumeUploadError) {
        throw new Error(`履歴書のアップロードに失敗しました: ${resumeUploadError.message}`);
      }

      resumeUrl = fileName;
      resumeFilename = resumeFile.name;
      uploadResults.push('履歴書');
    }

    // 職務経歴書のアップロード
    if (careerSummaryFile) {
      const fileExt = careerSummaryFile.name.split('.').pop();
      const fileName = `${candidateId}/career_summary_${Date.now()}.${fileExt}`;
      
      const { data: careerUploadData, error: careerUploadError } = await supabase.storage
        .from('resumes')
        .upload(fileName, careerSummaryFile, {
          cacheControl: '3600',
          upsert: false
        });

      if (careerUploadError) {
        throw new Error(`職務経歴書のアップロードに失敗しました: ${careerUploadError.message}`);
      }

      // 履歴書がない場合は職務経歴書をメインファイルとして設定
      if (!resumeUrl) {
        resumeUrl = fileName;
        resumeFilename = careerSummaryFile.name;
      }
      
      uploadResults.push('職務経歴書');
    }

    // candidatesテーブルの履歴書情報を更新
    const { data: candidateData, error: candidateError } = await supabase
      .from('candidates')
      .update({
        resume_url: resumeUrl,
        resume_filename: resumeFilename,
        resume_uploaded_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', candidateId);

    console.log('Candidate data save result:', { data: candidateData, error: candidateError });

    if (candidateError) {
      throw new Error(`データベース保存に失敗: ${candidateError.message}`);
    }

    console.log(`アップロード成功: ${uploadResults.join(', ')}`);
    
    // 成功時のみ完了ページにリダイレクト
    redirect('/signup/resume/complete');
    
  } catch (error) {
    console.error('Resume upload error:', error);
    throw error;
  }
}