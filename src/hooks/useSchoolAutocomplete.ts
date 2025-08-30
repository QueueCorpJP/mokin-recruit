import { useState, useEffect, useMemo } from 'react';
import { schoolDataLoader, type SchoolSuggestion } from '@/lib/data/schools';

export function useSchoolAutocomplete(query: string, selectedEducation?: string) {
  const [suggestions, setSuggestions] = useState<SchoolSuggestion[]>([]);

  const searchResults = useMemo(() => {
    if (!query || query.trim().length < 1) {
      return [];
    }
    return schoolDataLoader.searchSchools(query, selectedEducation);
  }, [query, selectedEducation]);

  useEffect(() => {
    setSuggestions(searchResults);
  }, [searchResults]);

  return {
    suggestions,
    loading: false, // No async operation needed for local data
    error: null,
  };
}