import CandidateFavoriteServerComponent from './CandidateFavoriteServerComponent';

interface CandidateFavoritePageProps {
  searchParams: Promise<{
    page?: string;
    limit?: string;
  }>;
}

export default async function CandidateFavoritePage({ searchParams }: CandidateFavoritePageProps) {
  const params = await searchParams;
  return <CandidateFavoriteServerComponent searchParams={params} />;
}
