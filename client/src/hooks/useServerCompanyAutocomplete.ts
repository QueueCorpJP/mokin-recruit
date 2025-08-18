import { useState, useEffect } from 'react';
import { useDebounce } from './useDebounce';
import { searchCompaniesAction, type CompanySuggestion } from '@/app/candidate/setting/ng-company/company-actions';

export function useServerCompanyAutocomplete(query: string, enabled = true) {
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
        console.log('Calling server action with query:', debouncedQuery);
        const results = await searchCompaniesAction(debouncedQuery);
        console.log('Search results:', results);
        setSuggestions(results || []);
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