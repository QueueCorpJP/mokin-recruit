import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient } from '@/lib/server/database/supabase';
import { validateJWT } from '@/lib/server/auth/supabaseAuth';
import { logger } from '@/lib/server/utils/logger';

interface UploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * 候補者のファイルアップロードAPI
 * POST /api/candidate/upload
 */
export async function POST(request: NextRequest): Promise<NextResponse<UploadResponse>> {
  try {
    logger.info('=== File upload started ===');

    // JWT認証
    const validationResult = await validateJWT(request);
    if (!validationResult.isValid || !validationResult.candidateId) {
      logger.warn('Invalid authentication for file upload');
      return NextResponse.json(
        { success: false, error: '認証が必要です' },
        { status: 401 }
      );
    }

    const candidateId = validationResult.candidateId;
    logger.info(`File upload request from candidate: ${candidateId}`);

    // FormDataを解析
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    const requestedCandidateId = formData.get('candidateId') as string;

    // 基本バリデーション
    if (!file || !type || !requestedCandidateId) {
      return NextResponse.json(
        { success: false, error: '必要なパラメータが不足しています' },
        { status: 400 }
      );
    }

    // 認証されたユーザーIDと一致することを確認
    if (candidateId !== requestedCandidateId) {
      logger.warn(`Candidate ID mismatch: ${candidateId} vs ${requestedCandidateId}`);
      return NextResponse.json(
        { success: false, error: '権限がありません' },
        { status: 403 }
      );
    }

    // ファイルサイズチェック（5MB）
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'ファイルサイズは5MB以下にしてください' },
        { status: 400 }
      );
    }

    // ファイル形式チェック
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'PDF、Word、画像ファイル（JPEG/PNG/GIF）、テキストファイルのみアップロード可能です' },
        { status: 400 }
      );
    }

    // ファイル拡張子を取得
    const getFileExtension = (mimeType: string, fileName: string): string => {
      const mimeToExtension: { [key: string]: string } = {
        'application/pdf': '.pdf',
        'application/msword': '.doc',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
        'image/jpeg': '.jpg',
        'image/png': '.png',
        'image/gif': '.gif',
        'text/plain': '.txt'
      };

      if (mimeToExtension[mimeType]) {
        return mimeToExtension[mimeType];
      }

      const lastDotIndex = fileName.lastIndexOf('.');
      if (lastDotIndex !== -1) {
        return fileName.substring(lastDotIndex);
      }

      return '.bin';
    };

    // ファイル名の生成
    const timestamp = new Date().getTime();
    const fileExtension = getFileExtension(file.type, file.name);
    const fileName = `${candidateId}/${type}_${timestamp}${fileExtension}`;

    logger.info(`Uploading file: ${fileName}`);

    // Supabase Storageにアップロード（管理者権限）
    const supabase = getSupabaseAdminClient();
    const fileBuffer = await file.arrayBuffer();
    
    const { data, error } = await supabase.storage
      .from('applications')
      .upload(fileName, fileBuffer, {
        cacheControl: '3600',
        contentType: file.type,
        upsert: false
      });

    if (error) {
      logger.error('Supabase upload error:', error);
      return NextResponse.json(
        { success: false, error: 'ファイルのアップロードに失敗しました' },
        { status: 500 }
      );
    }

    // 公開URLを取得
    const { data: urlData } = supabase.storage
      .from('applications')
      .getPublicUrl(fileName);

    logger.info(`File uploaded successfully: ${urlData.publicUrl}`);

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl
    });

  } catch (error) {
    logger.error('File upload error:', error);
    return NextResponse.json(
      { success: false, error: 'ファイルのアップロード中にエラーが発生しました' },
      { status: 500 }
    );
  }
}