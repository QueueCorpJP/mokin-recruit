import { getResumeUrlForServer } from '@/lib/storage/resume';

interface ResumePreviewProps {
  candidateId: string;
  className?: string;
}

export default async function ResumePreview({
  candidateId,
  className,
}: ResumePreviewProps) {
  const { resumeUrl, careerUrl, candidate } =
    await getResumeUrlForServer(candidateId);

  if (!candidate) {
    return (
      <div className={className}>
        <p className='text-gray-500'>候補者情報が見つかりません</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-gray-900'>
          {candidate.last_name} {candidate.first_name} さんの履歴書
        </h3>

        {resumeUrl && (
          <div className='border rounded-lg p-4'>
            <h4 className='font-medium text-gray-700 mb-2'>履歴書</h4>
            <div className='space-y-2'>
              <iframe
                src={resumeUrl}
                className='w-full h-96 border rounded'
                title='履歴書プレビュー'
              />
              <a
                href={resumeUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
              >
                履歴書を新しいタブで開く
              </a>
            </div>
          </div>
        )}

        {careerUrl && (
          <div className='border rounded-lg p-4'>
            <h4 className='font-medium text-gray-700 mb-2'>職務経歴書</h4>
            <div className='space-y-2'>
              <iframe
                src={careerUrl}
                className='w-full h-96 border rounded'
                title='職務経歴書プレビュー'
              />
              <a
                href={careerUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
              >
                職務経歴書を新しいタブで開く
              </a>
            </div>
          </div>
        )}

        {!resumeUrl && !careerUrl && (
          <div className='text-center py-8'>
            <p className='text-gray-500'>
              アップロードされた履歴書・職務経歴書がありません
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
