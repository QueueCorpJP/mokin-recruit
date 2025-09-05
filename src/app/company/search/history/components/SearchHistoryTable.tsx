'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchHistoryItem } from '@/hooks/useSearchHistory';
import { DeleteSearchConditionModal } from '../DeleteSearchConditionModal';
import { EditSearchConditionModal } from '../EditSearchConditionModal';

interface SearchHistoryTableProps {
  searchHistory: SearchHistoryItem[];
  onUpdateSavedStatus: (historyId: string, isSaved: boolean) => Promise<void>;
  onDeleteHistory: (historyId: string) => Promise<void>;
}

export function SearchHistoryTable({
  searchHistory,
  onUpdateSavedStatus,
  onDeleteHistory
}: SearchHistoryTableProps) {
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: SearchHistoryItem | null }>({
    isOpen: false,
    item: null
  });
  const [editModal, setEditModal] = useState<{ isOpen: boolean; item: SearchHistoryItem | null }>({
    isOpen: false,
    item: null
  });

  const handleSaveToggle = async (item: SearchHistoryItem) => {
    setLoadingItems(prev => new Set([...prev, item.id]));
    try {
      await onUpdateSavedStatus(item.id, !item.is_saved);
    } catch (error) {
      console.error('Failed to update saved status:', error);
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
    }
  };

  const handleDelete = async (item: SearchHistoryItem) => {
    try {
      await onDeleteHistory(item.id);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error('Failed to delete search history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  if (searchHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">検索履歴がありません</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  保存
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検索タイトル
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検索者
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  グループ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  検索日時
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {searchHistory.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Checkbox
                      checked={item.is_saved}
                      onCheckedChange={() => handleSaveToggle(item)}
                      disabled={loadingItems.has(item.id)}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {item.search_title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.searcher_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {item.group_name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {formatDate(item.searched_at)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditModal({ isOpen: true, item })}
                      >
                        編集
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ isOpen: true, item })}
                        className="text-red-600 hover:text-red-900"
                      >
                        削除
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 削除モーダル */}
      {deleteModal.item && (
        <DeleteSearchConditionModal
          isOpen={deleteModal.isOpen}
          onClose={() => setDeleteModal({ isOpen: false, item: null })}
          onConfirm={() => handleDelete(deleteModal.item!)}
          searchTitle={deleteModal.item.search_title}
        />
      )}

      {/* 編集モーダル */}
      {editModal.item && (
        <EditSearchConditionModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, item: null })}
          searchHistory={editModal.item}
        />
      )}
    </>
  );
}