import { uploadMessageFile } from '@/lib/actions/message-actions';
import { uploadCompanyMessageFile } from '@/lib/actions/messages';

export interface UploadFileResult {
  url: string;
  path: string;
  error?: string;
}

export async function uploadFile(file: File, userId: string, userType: 'candidate' | 'company' = 'candidate'): Promise<UploadFileResult> {
  try {
    console.log('🔍 [UPLOAD DEBUG] Starting server action upload...', { userType });
    console.log('🔍 [UPLOAD DEBUG] File info:', { 
      name: file.name, 
      size: file.size, 
      type: file.type 
    });
    
    // サーバーアクションを使用してアップロード（より安全）
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    
    // ユーザータイプに応じて適切なアップロード関数を使用
    const result = userType === 'company' 
      ? await uploadCompanyMessageFile(formData)
      : await uploadMessageFile(formData);
    
    console.log('🔍 [UPLOAD DEBUG] Server action result:', result);
    
    if (result.error) {
      return {
        url: '',
        path: '',
        error: result.error
      };
    }
    
    return {
      url: result.url || '',
      path: result.path || ''
    };

  } catch (error) {
    console.error('Upload file error:', error);
    return { 
      url: '', 
      path: '', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function uploadMultipleFiles(files: File[], userId: string, userType: 'candidate' | 'company' = 'candidate'): Promise<UploadFileResult[]> {
  console.log('🔍 [MULTIPLE UPLOAD DEBUG] Starting multiple file upload:', {
    userId,
    userType,
    fileCount: files.length,
    files: files.map(f => ({ name: f.name, size: f.size }))
  });
  
  const uploadPromises = files.map(file => uploadFile(file, userId, userType));
  const results = await Promise.all(uploadPromises);
  
  console.log('🔍 [MULTIPLE UPLOAD DEBUG] Upload results:', {
    totalFiles: results.length,
    successful: results.filter(r => !r.error).length,
    failed: results.filter(r => r.error).length,
    errors: results.filter(r => r.error).map(r => r.error)
  });
  
  return results;
}