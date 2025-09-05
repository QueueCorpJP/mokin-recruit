'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { useSearchHistory } from '@/hooks/useSearchHistory';
import { useAuth } from '@/providers/AuthProvider';
import { SearchHistoryTable } from './components/SearchHistoryTable';
import { SearchHistoryFilters } from './components/SearchHistoryFilters';

export interface SearchHistoryClientProps {
  initialSearchHistory: any[];
}

export default function SearchHistoryClientNew({ initialSearchHistory }: SearchHistoryClientProps) {
  const { user } = useAuth();
  const [selectedGroup, setSelectedGroup] = useState<string>('');
  const [filters, setFilters] = useState({
    searchTitle: '',
    searcherName: '',
    savedOnly: false
  });

  // クライアントサイドでデータを取得（RLS自動適用）
  const { 
    searchHistory, 
    loading, 
    error,
    updateSavedStatus,
    deleteSearchHistory 
  } = useSearchHistory(selectedGroup || undefined);

  // フィルタリング処理
  const filteredHistory = searchHistory.filter(item => {
    if (filters.searchTitle && !item.search_title.toLowerCase().includes(filters.searchTitle.toLowerCase())) {
      return false;
    }
    if (filters.searcherName && !item.searcher_name.toLowerCase().includes(filters.searcherName.toLowerCase())) {
      return false;
    }
    if (filters.savedOnly && !item.is_saved) {
      return false;
    }
    return true;
  });

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">ログインが必要です</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-500">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* フィルター */}
      <SearchHistoryFilters
        filters={filters}
        onFiltersChange={setFilters}
        selectedGroup={selectedGroup}
        onGroupChange={setSelectedGroup}
      />

      {/* テーブル */}
      <SearchHistoryTable
        searchHistory={filteredHistory}
        onUpdateSavedStatus={updateSavedStatus}
        onDeleteHistory={deleteSearchHistory}
      />

      {/* 結果表示 */}
      <div className="text-sm text-gray-600">
        {filteredHistory.length > 0 ? (
          `${filteredHistory.length}件の検索履歴が見つかりました`
        ) : (
          '検索履歴が見つかりません'
        )}
      </div>
    </div>
  );
}