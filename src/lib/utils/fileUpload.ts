import { createClient } from '@supabase/supabase-js';

// クライアントサイド用のSupabaseクライアント
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * ファイルタイプとファイル名から適切な拡張子を取得
 */
function getFileExtension(mimeType: string, fileName: string): string {
  // MIMEタイプから拡張子を判定
  const mimeToExtension: { [key: string]: string } = {
    'application/pdf': '.pdf',
    'application/msword': '.doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'text/plain': '.txt'
  };

  // MIMEタイプから拡張子を取得
  if (mimeToExtension[mimeType]) {
    return mimeToExtension[mimeType];
  }

  // ファイル名から拡張子を抽出（フォールバック）
  const lastDotIndex = fileName.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return fileName.substring(lastDotIndex);
  }

  // デフォルト
  return '.bin';
}

/**
 * ファイルのバリデーション
 */
export function validateFile(file: File): { valid: boolean; error?: string } {
  // ファイルサイズチェック（5MB）
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'ファイルサイズは5MB以下にしてください'
    };
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
    return {
      valid: false,
      error: 'PDF、Word、画像ファイル（JPEG/PNG/GIF）、テキストファイルのみアップロード可能です'
    };
  }

  return { valid: true };
}

/**
 * 履歴書・職務経歴書をSupabase Storageにアップロード
 * @param file アップロードするファイル
 * @param type ファイルタイプ ('resume' | 'career')
 * @param candidateId 候補者ID
 * @returns アップロード結果とURL
 */
export async function uploadApplicationDocument(
  file: File,
  type: 'resume' | 'career',
  candidateId: string
): Promise<UploadResult> {
  try {
    // ファイルバリデーション
    const validation = validateFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error || 'ファイルが無効です'
      };
    }

    // APIエンドポイントを通してアップロード（サーバーサイドで認証済み処理）
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    formData.append('candidateId', candidateId);

    const response = await fetch('/api/candidate/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || 'ファイルのアップロードに失敗しました'
      };
    }

    const result = await response.json();
    return {
      success: true,
      url: result.url
    };

  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error: 'ファイルのアップロードに失敗しました'
    };
  }
}

