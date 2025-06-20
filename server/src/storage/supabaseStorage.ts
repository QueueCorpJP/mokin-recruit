import { getSupabaseAdminClient } from '@/database/supabase';
import { logger } from '@/utils/logger';

// ファイルアップロード結果の型定義
export interface UploadResult {
  success: boolean;
  data?: {
    path: string;
    publicUrl: string;
    fullPath: string;
  };
  error?: string;
}

// ファイル削除結果の型定義
export interface DeleteResult {
  success: boolean;
  error?: string;
}

// サポートされるファイルタイプ
export const SUPPORTED_FILE_TYPES = {
  RESUME: ['application/pdf'],
  IMAGE: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENT: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const;

// ストレージバケット設定
export const STORAGE_BUCKETS = {
  RESUMES: 'resumes',
  COMPANY_LOGOS: 'company-logos',
  ATTACHMENTS: 'attachments',
} as const;

/**
 * ファイルをSupabase Storageにアップロード
 */
export async function uploadFile(
  file: Buffer,
  fileName: string,
  bucket: string,
  options?: {
    contentType?: string;
    cacheControl?: string;
    upsert?: boolean;
  }
): Promise<UploadResult> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const uploadOptions: any = {
      cacheControl: options?.cacheControl || '3600',
      upsert: options?.upsert || false,
    };
    
    if (options?.contentType) {
      uploadOptions.contentType = options.contentType;
    }

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, uploadOptions);

    if (error) {
      logger.error('File upload failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    // パブリックURLを取得
    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    logger.info(`File uploaded successfully: ${fileName} to ${bucket}`);

    return {
      success: true,
      data: {
        path: data.path,
        publicUrl: publicUrlData.publicUrl,
        fullPath: data.fullPath,
      },
    };
  } catch (error) {
    logger.error('File upload error:', error);
    return {
      success: false,
      error: 'File upload failed',
    };
  }
}

/**
 * 履歴書・職務経歴書をアップロード
 */
export async function uploadResume(
  file: Buffer,
  fileName: string,
  userId: string,
  contentType: string
): Promise<UploadResult> {
  // ファイルタイプ検証
  if (!SUPPORTED_FILE_TYPES.RESUME.includes(contentType as any)) {
    return {
      success: false,
      error: 'Unsupported file type. Only PDF files are allowed for resumes.',
    };
  }

  // ファイル名を安全な形式に変換
  const timestamp = Date.now();
  const safeFileName = `${userId}/${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  return uploadFile(file, safeFileName, STORAGE_BUCKETS.RESUMES, {
    contentType,
    cacheControl: '86400', // 24時間キャッシュ
  });
}

/**
 * 企業ロゴをアップロード
 */
export async function uploadCompanyLogo(
  file: Buffer,
  fileName: string,
  companyId: string,
  contentType: string
): Promise<UploadResult> {
  // ファイルタイプ検証
  if (!SUPPORTED_FILE_TYPES.IMAGE.includes(contentType as any)) {
    return {
      success: false,
      error: 'Unsupported file type. Only JPEG, PNG, and WebP images are allowed.',
    };
  }

  // ファイル名を安全な形式に変換
  const timestamp = Date.now();
  const safeFileName = `${companyId}/${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  return uploadFile(file, safeFileName, STORAGE_BUCKETS.COMPANY_LOGOS, {
    contentType,
    cacheControl: '86400', // 24時間キャッシュ
  });
}

/**
 * メッセージ添付ファイルをアップロード
 */
export async function uploadAttachment(
  file: Buffer,
  fileName: string,
  userId: string,
  contentType: string
): Promise<UploadResult> {
  // ファイルタイプ検証
  const allowedTypes = [
    ...SUPPORTED_FILE_TYPES.DOCUMENT,
    ...SUPPORTED_FILE_TYPES.IMAGE,
  ];

  if (!allowedTypes.includes(contentType as any)) {
    return {
      success: false,
      error: 'Unsupported file type.',
    };
  }

  // ファイル名を安全な形式に変換
  const timestamp = Date.now();
  const safeFileName = `${userId}/${timestamp}_${fileName.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

  return uploadFile(file, safeFileName, STORAGE_BUCKETS.ATTACHMENTS, {
    contentType,
    cacheControl: '3600', // 1時間キャッシュ
  });
}

/**
 * ファイルを削除
 */
export async function deleteFile(
  filePath: string,
  bucket: string
): Promise<DeleteResult> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      logger.error('File deletion failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    logger.info(`File deleted successfully: ${filePath} from ${bucket}`);

    return {
      success: true,
    };
  } catch (error) {
    logger.error('File deletion error:', error);
    return {
      success: false,
      error: 'File deletion failed',
    };
  }
}

/**
 * 古い履歴書を削除してから新しいものをアップロード
 */
export async function replaceResume(
  file: Buffer,
  fileName: string,
  userId: string,
  contentType: string,
  oldFilePath?: string
): Promise<UploadResult> {
  // 古いファイルを削除
  if (oldFilePath) {
    await deleteFile(oldFilePath, STORAGE_BUCKETS.RESUMES);
  }

  // 新しいファイルをアップロード
  return uploadResume(file, fileName, userId, contentType);
}

/**
 * ファイルのダウンロードURL取得（署名付きURL）
 */
export async function getSignedUrl(
  filePath: string,
  bucket: string,
  expiresIn: number = 3600 // 1時間
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const supabase = getSupabaseAdminClient();
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(filePath, expiresIn);

    if (error) {
      logger.error('Signed URL generation failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      url: data.signedUrl,
    };
  } catch (error) {
    logger.error('Signed URL generation error:', error);
    return {
      success: false,
      error: 'Signed URL generation failed',
    };
  }
}

/**
 * ストレージバケットの初期化
 */
export async function initializeStorageBuckets(): Promise<void> {
  try {
    const supabase = getSupabaseAdminClient();
    
    // 必要なバケットを作成
    const buckets = Object.values(STORAGE_BUCKETS);
    
    for (const bucket of buckets) {
      const { error } = await supabase.storage.createBucket(bucket, {
        public: false, // プライベートバケット
        allowedMimeTypes: [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'image/webp',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ],
        fileSizeLimit: parseInt(process.env.MAX_FILE_SIZE || '10485760'), // 10MB
      });

      if (error && error.message !== 'Bucket already exists') {
        logger.error(`Failed to create bucket ${bucket}:`, error);
      } else {
        logger.info(`Storage bucket ${bucket} is ready`);
      }
    }
  } catch (error) {
    logger.error('Storage bucket initialization error:', error);
  }
} 