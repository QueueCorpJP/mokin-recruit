import { getResumeDownloadUrlForServer } from '@/lib/storage/resume';

interface ResumeDownloadButtonProps {
  candidateId: string;
  fileType: 'resume' | 'career';
  label?: string;
  className?: string;
}

export default async function ResumeDownloadButton({
  candidateId,
  fileType,
  label,
  className = '',
}: ResumeDownloadButtonProps) {
  const { url, filename } = await getResumeDownloadUrlForServer(
    candidateId,
    fileType
  );

  if (!url) {
    return null; // ファイルが存在しない場合は何も表示しない
  }

  const defaultLabel =
    fileType === 'resume' ? '履歴書をダウンロード' : '職務経歴書をダウンロード';

  return (
    <a
      href={url}
      download={filename || undefined}
      className={`inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ${className}`}
    >
      {label || defaultLabel}
    </a>
  );
}
