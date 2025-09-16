'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export async function uploadContentImage(
  formData: FormData
): Promise<UploadResult> {
  // 非破壊の再認可チェック（現状はログのみ）
  try {
    const { softReauthorizeForCompany } = await import(
      '@/lib/server/utils/soft-auth-check'
    );
    await softReauthorizeForCompany('admin.uploadContentImage', {});
  } catch (error) {
    console.warn('Soft authorization check failed:', error);
  }

  try {
    const file = formData.get('file') as File;
    if (!file) {
      return { success: false, error: 'ファイルが選択されていません' };
    }

    // ファイルタイプチェック
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: 'サポートされていないファイル形式です' };
    }

    // ファイルサイズチェック (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        success: false,
        error: 'ファイルサイズが大きすぎます（最大5MB）',
      };
    }

    // ファイル名生成
    const fileExtension = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    // アップロードディレクトリ作成
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'content');
    await mkdir(uploadDir, { recursive: true });

    // ファイル保存
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const url = `/uploads/content/${fileName}`;
    return { success: true, url };
  } catch (error) {
    console.error('File upload error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'アップロードに失敗しました',
    };
  }
}
