export type CompanySuggestion = {
  id: string;
  name: string;
  address?: string;
};

const search = async (
  query: string,
  limit: number = 5
): Promise<CompanySuggestion[]> => {
  // Lightweight stub: return empty suggestions to avoid runtime calls in dev/typecheck
  if (!query || query.trim().length < 2) return [];
  return [];
};

export const gbizApiClient = {
  searchCompanies: search,
};
