import { getJobDetails } from './actions';
import CandidateApplicationClient from './CandidateApplicationClient';

interface CandidateApplicationServerComponentProps {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function CandidateApplicationServerComponent({
  params,
  searchParams
}: CandidateApplicationServerComponentProps) {
  const jobId = params.id;

  // 求人情報を取得
  const jobResponse = await getJobDetails(jobId);

  if (!jobResponse.success || !jobResponse.data) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-red-600 mb-4">エラー</h1>
          <p className="text-gray-700">{jobResponse.error || '求人情報が見つかりませんでした'}</p>
        </div>
      </div>
    );
  }

  const jobData = jobResponse.data;

  // searchParamsから取得（フォールバック用）
  const jobTitle = (searchParams.title as string) || jobData.title;
  const companyName = (searchParams.companyName as string) || jobData.companyName;
  const requiredDocumentsParam = searchParams.requiredDocuments as string;
  
  let requiredDocuments: string[] = [];
  if (requiredDocumentsParam) {
    try {
      requiredDocuments = JSON.parse(decodeURIComponent(requiredDocumentsParam));
    } catch {
      // パース失敗時はサーバーから取得したデータを使用
      requiredDocuments = jobData.requiredDocuments;
    }
  } else {
    requiredDocuments = jobData.requiredDocuments;
  }

  // 求人が応募可能な状態かチェック
  if (jobData.status !== 'PUBLISHED') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-xl font-bold text-yellow-600 mb-4">お知らせ</h1>
          <p className="text-gray-700">この求人は現在応募できません。</p>
        </div>
      </div>
    );
  }

  return (
    <CandidateApplicationClient
      jobId={jobId}
      jobTitle={jobTitle}
      companyName={companyName}
      requiredDocuments={requiredDocuments}
    />
  );
}