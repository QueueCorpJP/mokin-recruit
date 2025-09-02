import CandidateFavoriteServerComponent from './CandidateFavoriteServerComponent';

interface CandidateFavoritePageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default async function CandidateFavoritePage({ searchParams }: CandidateFavoritePageProps) {
  return <CandidateFavoriteServerComponent searchParams={searchParams} />;
}
