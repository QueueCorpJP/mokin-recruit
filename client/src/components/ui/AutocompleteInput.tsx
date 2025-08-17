'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

export interface AutocompleteSuggestion {
  id: string;
  name: string;
  category?: string;
}

interface AutocompleteInputProps {
  value: string;
  onChange: (value: string) => void;
  onSuggestionSelect?: (suggestion: AutocompleteSuggestion) => void;
  placeholder?: string;
  className?: string;
  suggestions: AutocompleteSuggestion[];
  loading?: boolean;
  disabled?: boolean;
  maxSuggestions?: number;
}

export default function AutocompleteInput({
  value,
  onChange,
  onSuggestionSelect,
  placeholder,
  className = '',
  suggestions,
  loading = false,
  disabled = false,
  maxSuggestions = 10,
}: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const displayedSuggestions = useMemo(() => 
    suggestions.slice(0, maxSuggestions), 
    [suggestions, maxSuggestions]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (displayedSuggestions.length > 0 && value.trim()) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
    setSelectedIndex(-1);
  }, [displayedSuggestions, value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || displayedSuggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < displayedSuggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : displayedSuggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(displayedSuggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionClick = (suggestion: AutocompleteSuggestion) => {
    onChange(suggestion.name);
    onSuggestionSelect?.(suggestion);
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] focus:outline-none focus:border-[#0f9058] ${className}`}
      />
      
      {isOpen && (
        <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[#999999] rounded-[5px] mt-1 shadow-lg max-h-60 overflow-auto">
          {loading ? (
            <div className="p-3 text-[#999999] text-center">
              検索中...
            </div>
          ) : displayedSuggestions.length > 0 ? (
            <ul ref={listRef}>
              {displayedSuggestions.map((suggestion, index) => (
                <li
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className={`px-3 py-2 cursor-pointer text-[14px] hover:bg-[#f5f5f5] ${
                    index === selectedIndex ? 'bg-[#e8f5e8]' : ''
                  }`}
                >
                  <div className="font-medium text-[#323232]">
                    {suggestion.name}
                  </div>
                  {suggestion.category && (
                    <div className="text-[12px] text-[#999999] mt-1">
                      {suggestion.category}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : value.trim() && (
            <div className="p-3 text-[#999999] text-center">
              該当する項目が見つかりませんでした
            </div>
          )}
        </div>
      )}
    </div>
  );
}