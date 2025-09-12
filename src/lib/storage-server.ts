import { getSupabaseServerClient } from '@/lib/supabase/server-client';

export type UploadedFile = {
  path: string;
  publicUrl: string;
};

const BUCKET_ID = 'company-account';

function generateObjectPath(prefix: string, companyAccountId: string, fileName: string) {
  const timestamp = Date.now();
  const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '_');
  return `${prefix}/${companyAccountId}/${timestamp}-${safeName}`;
}

export async function uploadCompanyIcon(companyAccountId: string, file: File): Promise<UploadedFile> {
  const supabase = await getSupabaseServerClient();
  const arrayBuffer = await file.arrayBuffer();
  const objectPath = generateObjectPath('icons', companyAccountId, file.name || 'icon');

  const { data, error } = await supabase.storage
    .from(BUCKET_ID)
    .upload(objectPath, arrayBuffer, {
      cacheControl: '3600',
      contentType: file.type || 'image/*',
      upsert: false,
    });

  if (error) {
    throw error;
  }

  const { data: urlData } = supabase.storage.from(BUCKET_ID).getPublicUrl(data.path);
  return { path: data.path, publicUrl: urlData.publicUrl };
}

export async function uploadCompanyImages(companyAccountId: string, files: File[]): Promise<UploadedFile[]> {
  const results: UploadedFile[] = [];
  for (const file of files) {
    const supabase = await getSupabaseServerClient();
    const arrayBuffer = await file.arrayBuffer();
    const objectPath = generateObjectPath('images', companyAccountId, file.name || 'image');

    const { data, error } = await supabase.storage
      .from(BUCKET_ID)
      .upload(objectPath, arrayBuffer, {
        cacheControl: '3600',
        contentType: file.type || 'image/*',
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data: urlData } = supabase.storage.from(BUCKET_ID).getPublicUrl(data.path);
    results.push({ path: data.path, publicUrl: urlData.publicUrl });
  }
  return results;
}