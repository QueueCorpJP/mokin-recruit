'use client';

import React from 'react';
import { useServerCompanyAutocomplete } from '@/hooks/useServerCompanyAutocomplete';
import AutocompleteInput from '@/components/ui/AutocompleteInput';

interface CompanyNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CompanyNameInput({
  value,
  onChange,
  placeholder = "企業名を入力",
  className = "",
  disabled = false,
}: CompanyNameInputProps) {
  const { suggestions: companySuggestions, loading: companyLoading } = useServerCompanyAutocomplete(value);

  return (
    <AutocompleteInput
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      suggestions={companySuggestions.map(c => ({ 
        id: c.id, 
        name: c.name, 
        category: c.address || ''
      }))}
      loading={companyLoading}
      disabled={disabled}
      className={className}
      onSuggestionSelect={(suggestion) => {
        onChange(suggestion.name);
      }}
    />
  );
}