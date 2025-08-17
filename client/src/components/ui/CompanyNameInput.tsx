'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useCompanySuggestions } from '@/hooks/useCompanySuggestions';
import type { CompanySuggestion } from '@/lib/api/gbiz';

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const { suggestions, isLoading, searchCompanies, clearSuggestions } = useCompanySuggestions();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Debounced search
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(() => {
      if (newValue.trim().length >= 2) {
        searchCompanies(newValue.trim());
        setShowSuggestions(true);
      } else {
        clearSuggestions();
        setShowSuggestions(false);
      }
    }, 300);
  }, [onChange, searchCompanies, clearSuggestions]);

  const handleSuggestionClick = useCallback((suggestion: CompanySuggestion) => {
    setInputValue(suggestion.name);
    onChange(suggestion.name);
    setShowSuggestions(false);
    clearSuggestions();
  }, [onChange, clearSuggestions]);

  const handleInputFocus = useCallback(() => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  }, [suggestions.length]);

  const handleInputBlur = useCallback(() => {
    // Delay hiding to allow click on suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  }, []);

  // Update internal state when external value changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
      />
      
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 z-50 bg-white border border-[#999999] rounded-[5px] shadow-lg max-h-[200px] overflow-y-auto"
        >
          {isLoading && (
            <div className="px-4 py-3 text-[#999999] text-[14px]">
              検索中...
            </div>
          )}
          
          {!isLoading && suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              type="button"
              className="w-full px-4 py-3 text-left hover:bg-[#f0f8f5] border-b border-[#f0f0f0] last:border-b-0 transition-colors"
              onClick={() => handleSuggestionClick(suggestion)}
            >
              <div className="text-[#323232] text-[14px] font-medium tracking-[1.4px]">
                {suggestion.name}
              </div>
              {suggestion.address && (
                <div className="text-[#999999] text-[12px] mt-1">
                  {suggestion.address}
                </div>
              )}
            </button>
          ))}
          
          {!isLoading && suggestions.length === 0 && inputValue.trim().length >= 2 && (
            <div className="px-4 py-3 text-[#999999] text-[14px]">
              該当する企業が見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
}