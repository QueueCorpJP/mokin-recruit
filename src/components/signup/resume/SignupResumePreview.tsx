import { getSignupResumeUrlsForServer } from '@/lib/storage/resume';

interface SignupResumePreviewProps {
  candidateId: string;
  className?: string;
}

export default async function SignupResumePreview({
  candidateId,
  className,
}: SignupResumePreviewProps) {
  const { resumeUrl, careerUrl, resumeFilename, careerFilename } =
    await getSignupResumeUrlsForServer(candidateId);

  if (!resumeUrl && !careerUrl) {
    return (
      <div className={className}>
        <p className='text-gray-500'>アップロードされたファイルがありません</p>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className='space-y-4'>
        <h3 className='text-lg font-bold text-gray-900'>
          アップロードされたファイル
        </h3>

        {resumeUrl && (
          <div className='border rounded-lg p-4'>
            <h4 className='font-medium text-gray-700 mb-2'>
              履歴書 {resumeFilename && `(${resumeFilename})`}
            </h4>
            <div className='space-y-2'>
              <iframe
                src={resumeUrl}
                className='w-full h-64 border rounded'
                title='履歴書プレビュー'
              />
              <div className='flex gap-2'>
                <a
                  href={resumeUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'
                >
                  プレビュー
                </a>
                <a
                  href={resumeUrl}
                  download={resumeFilename || '履歴書.pdf'}
                  className='px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'
                >
                  ダウンロード
                </a>
              </div>
            </div>
          </div>
        )}

        {careerUrl && (
          <div className='border rounded-lg p-4'>
            <h4 className='font-medium text-gray-700 mb-2'>
              職務経歴書 {careerFilename && `(${careerFilename})`}
            </h4>
            <div className='space-y-2'>
              <iframe
                src={careerUrl}
                className='w-full h-64 border rounded'
                title='職務経歴書プレビュー'
              />
              <div className='flex gap-2'>
                <a
                  href={careerUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700'
                >
                  プレビュー
                </a>
                <a
                  href={careerUrl}
                  download={careerFilename || '職務経歴書.pdf'}
                  className='px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700'
                >
                  ダウンロード
                </a>
              </div>
            </div>
          </div>
        )}

        <div className='text-xs text-gray-500'>
          ※ プレビューとダウンロードリンクは30分間有効です
        </div>
      </div>
    </div>
  );
}
