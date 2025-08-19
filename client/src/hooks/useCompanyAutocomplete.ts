import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { gbizApiClient, type CompanySuggestion } from '@/lib/api/gbiz';

export function useCompanyAutocomplete(query: string, enabled = true) {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!enabled || !debouncedQuery || debouncedQuery.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }

    const searchCompanies = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await gbizApiClient.searchCompanies(debouncedQuery);
        setSuggestions(results);
      } catch (err) {
        setError('企業検索に失敗しました');
        setSuggestions([]);
        console.error('Company search error:', err);
      } finally {
        setLoading(false);
      }
    };

    searchCompanies();
  }, [debouncedQuery, enabled]);

  return {
    suggestions,
    loading,
    error,
  };
}