import { getCachedCandidateUser } from '@/lib/auth/server';
import CandidateFavoriteClient from './CandidateFavoriteClient';
import { getFavoriteList } from './actions';

interface CandidateFavoriteServerComponentProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function CandidateFavoriteServerComponent({ 
  searchParams 
}: CandidateFavoriteServerComponentProps) {
  // searchParamsを待機
  const awaitedSearchParams = await searchParams;
  
  // パラメータ解析
  const page = parseInt(awaitedSearchParams.page || '1');
  const limit = parseInt(awaitedSearchParams.limit || '12');

  // レイアウトで認証済みのため、キャッシュされた結果を使用
  const user = await getCachedCandidateUser();
  if (!user) {
    throw new Error('Authentication required');
  }

  // Server Actionを使用してお気に入りデータを取得
  const favoriteData = await getFavoriteList({ page, limit });

  if (!favoriteData.success) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full mx-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">エラーが発生しました</h2>
          <p className="text-red-600">{favoriteData.error || 'お気に入りデータの取得に失敗しました'}</p>
        </div>
      </div>
    );
  }

  return (
    <CandidateFavoriteClient 
      initialData={favoriteData.data}
      initialParams={{ page, limit }}
    />
  );
}