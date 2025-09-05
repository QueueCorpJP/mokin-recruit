'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { SelectInput } from '@/components/ui/select-input';

interface FilterState {
  searchTitle: string;
  searcherName: string;
  savedOnly: boolean;
}

interface SearchHistoryFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  selectedGroup: string;
  onGroupChange: (groupId: string) => void;
}

export function SearchHistoryFilters({
  filters,
  onFiltersChange,
  selectedGroup,
  onGroupChange
}: SearchHistoryFiltersProps) {

  const handleFilterChange = (key: keyof FilterState, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  // TODO: グループ一覧の取得はuseGroupsフックで実装
  const groupOptions = [
    { value: '', label: 'すべてのグループ' }
    // グループ一覧が入る
  ];

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      <h3 className="text-lg font-medium text-gray-900">フィルター</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 検索タイトル */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索タイトル
          </label>
          <Input
            type="text"
            placeholder="検索タイトルを入力"
            value={filters.searchTitle}
            onChange={(e) => handleFilterChange('searchTitle', e.target.value)}
          />
        </div>

        {/* 検索者名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            検索者名
          </label>
          <Input
            type="text"
            placeholder="検索者名を入力"
            value={filters.searcherName}
            onChange={(e) => handleFilterChange('searcherName', e.target.value)}
          />
        </div>

        {/* グループ選択 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            グループ
          </label>
          <SelectInput
            options={groupOptions}
            value={selectedGroup}
            onChange={onGroupChange}
            placeholder="グループを選択"
          />
        </div>
      </div>

      {/* 保存済みのみチェックボックス */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="savedOnly"
          checked={filters.savedOnly}
          onCheckedChange={(checked) => handleFilterChange('savedOnly', !!checked)}
        />
        <label
          htmlFor="savedOnly"
          className="text-sm font-medium text-gray-700 cursor-pointer"
        >
          保存済みのみ表示
        </label>
      </div>
    </div>
  );
}