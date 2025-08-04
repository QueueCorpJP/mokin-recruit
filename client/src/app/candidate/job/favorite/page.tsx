import CandidateFavoriteServerComponent from './CandidateFavoriteServerComponent';

interface CandidateFavoritePageProps {
  searchParams: {
    page?: string;
    limit?: string;
  };
}

export default function CandidateFavoritePage({ searchParams }: CandidateFavoritePageProps) {
  return <CandidateFavoriteServerComponent searchParams={searchParams} />;
}
