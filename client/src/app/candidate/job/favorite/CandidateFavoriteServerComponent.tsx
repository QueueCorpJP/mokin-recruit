import { getFavoriteList } from './actions';
import CandidateFavoriteClient from './CandidateFavoriteClient';

interface CandidateFavoriteServerComponentProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function CandidateFavoriteServerComponent({ 
  searchParams 
}: CandidateFavoriteServerComponentProps) {
  // パラメータ解析
  const page = parseInt(searchParams.page || '1');
  const limit = parseInt(searchParams.limit || '12');

  // データ取得
  const response = await getFavoriteList({ page, limit });

  // エラーハンドリング
  if (!response.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
          <p className="text-red-600">{response.error}</p>
        </div>
      </div>
    );
  }

  // クライアントコンポーネントに渡す
  return (
    <CandidateFavoriteClient 
      initialData={response.data}
      initialParams={{ page, limit }}
    />
  );
}