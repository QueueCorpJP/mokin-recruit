import { useState, useCallback } from 'react';
import { gbizApiClient, type CompanySuggestion } from '@/lib/api/gbiz';

interface UseCompanySuggestionsResult {
  suggestions: CompanySuggestion[];
  isLoading: boolean;
  searchCompanies: (query: string) => Promise<void>;
  clearSuggestions: () => void;
}

export function useCompanySuggestions(): UseCompanySuggestionsResult {
  const [suggestions, setSuggestions] = useState<CompanySuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchCompanies = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await gbizApiClient.searchCompanies(query, 10);
      setSuggestions(results);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('Failed to search companies:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  return {
    suggestions,
    isLoading,
    searchCompanies,
    clearSuggestions,
  };
}