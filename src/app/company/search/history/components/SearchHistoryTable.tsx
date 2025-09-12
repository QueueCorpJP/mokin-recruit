'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { SearchHistoryItem } from '@/hooks/useSearchHistory';
import { DeleteSearchConditionModal } from '../DeleteSearchConditionModal';
import { EditSearchConditionModal } from '../EditSearchConditionModal';
import { createClient } from '@/lib/supabase/client';

interface SearchHistoryTableProps {
  searchHistory: SearchHistoryItem[];
  onUpdateSavedStatus: (historyId: string, isSaved: boolean) => Promise<void>;
  onDeleteHistory: (historyId: string) => Promise<void>;
}

// 検索条件をURLパラメータに変換する関数
function buildSearchUrl(searchConditions: any, groupId: string): string {
  const params = new URLSearchParams();

  // グループIDを設定
  params.set('search_group', groupId);

  // 基本パラメータ
  if (searchConditions.keyword) {
    params.set('keyword', searchConditions.keyword);
  }

  // 年齢
  if (searchConditions.age_min !== undefined) {
    params.set('age_min', searchConditions.age_min.toString());
  }
  if (searchConditions.age_max !== undefined) {
    params.set('age_max', searchConditions.age_max.toString());
  }

  // 現在の年収
  if (searchConditions.current_salary_min !== undefined) {
    params.set(
      'current_salary_min',
      searchConditions.current_salary_min.toString()
    );
  }
  if (searchConditions.current_salary_max !== undefined) {
    params.set(
      'current_salary_max',
      searchConditions.current_salary_max.toString()
    );
  }

  // 希望年収
  if (searchConditions.desired_salary_min !== undefined) {
    params.set(
      'desired_salary_min',
      searchConditions.desired_salary_min.toString()
    );
  }
  if (searchConditions.desired_salary_max !== undefined) {
    params.set(
      'desired_salary_max',
      searchConditions.desired_salary_max.toString()
    );
  }

  // 経験職種・業界（配列形式で直接名前が格納される）
  if (searchConditions.experience_job_types?.length > 0) {
    const jobTypeNames = Array.isArray(searchConditions.experience_job_types[0])
      ? searchConditions.experience_job_types.flat()
      : searchConditions.experience_job_types;
    params.set('experience_job_types', jobTypeNames.join(','));
  }
  if (searchConditions.experience_industries?.length > 0) {
    const industryNames = Array.isArray(
      searchConditions.experience_industries[0]
    )
      ? searchConditions.experience_industries.flat()
      : searchConditions.experience_industries;
    params.set('experience_industries', industryNames.join(','));
  }

  // 希望職種・業界
  if (searchConditions.desired_job_types?.length > 0) {
    const jobTypeNames = Array.isArray(searchConditions.desired_job_types[0])
      ? searchConditions.desired_job_types.flat()
      : searchConditions.desired_job_types;
    params.set('desired_job_types', jobTypeNames.join(','));
  }
  if (searchConditions.desired_industries?.length > 0) {
    const industryNames = Array.isArray(searchConditions.desired_industries[0])
      ? searchConditions.desired_industries.flat()
      : searchConditions.desired_industries;
    params.set('desired_industries', industryNames.join(','));
  }

  // 希望勤務地
  if (searchConditions.desired_locations?.length > 0) {
    params.set(
      'desired_locations',
      searchConditions.desired_locations.join(',')
    );
  }

  // 働き方
  if (searchConditions.work_styles?.length > 0) {
    params.set('work_styles', searchConditions.work_styles.join(','));
  }

  // 学歴
  if (searchConditions.education) {
    params.set('education', searchConditions.education);
  }

  // 資格
  if (searchConditions.qualifications?.length > 0) {
    params.set('qualifications', searchConditions.qualifications.join(','));
  }

  // その他の条件
  if (searchConditions.current_company) {
    params.set('current_company', searchConditions.current_company);
  }
  if (searchConditions.english_level) {
    params.set('english_level', searchConditions.english_level);
  }
  if (searchConditions.other_language) {
    params.set('other_language', searchConditions.other_language);
  }
  if (searchConditions.other_language_level) {
    params.set('other_language_level', searchConditions.other_language_level);
  }
  if (searchConditions.transfer_time) {
    params.set('transfer_time', searchConditions.transfer_time);
  }
  if (searchConditions.selection_status) {
    params.set('selection_status', searchConditions.selection_status);
  }
  if (searchConditions.similar_company_industry) {
    params.set(
      'similar_company_industry',
      searchConditions.similar_company_industry
    );
  }
  if (searchConditions.similar_company_location) {
    params.set(
      'similar_company_location',
      searchConditions.similar_company_location
    );
  }
  if (searchConditions.last_login_min) {
    params.set('last_login_min', searchConditions.last_login_min);
  }
  if (searchConditions.job_type_and_search) {
    params.set('job_type_and_search', searchConditions.job_type_and_search);
  }
  if (searchConditions.industry_and_search) {
    params.set('industry_and_search', searchConditions.industry_and_search);
  }

  return `/company/search/result?${params.toString()}`;
}

export function SearchHistoryTable({
  searchHistory,
  onUpdateSavedStatus,
  onDeleteHistory,
}: SearchHistoryTableProps) {
  const router = useRouter();
  const [loadingItems, setLoadingItems] = useState<Set<string>>(new Set());
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: SearchHistoryItem | null;
  }>({
    isOpen: false,
    item: null,
  });
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    item: SearchHistoryItem | null;
  }>({
    isOpen: false,
    item: null,
  });
  const supabase = createClient();

  const handleSaveToggle = async (item: SearchHistoryItem) => {
    console.log('[SearchHistoryTable] handleSaveToggle開始:', {
      itemId: item.id,
      currentIsSaved: item.is_saved,
      newIsSaved: !item.is_saved,
      item: item,
    });

    setLoadingItems(prev => new Set([...prev, item.id]));
    try {
      console.log('[SearchHistoryTable] onUpdateSavedStatus実行前');
      await onUpdateSavedStatus(item.id, !item.is_saved);
      console.log('[SearchHistoryTable] onUpdateSavedStatus実行後 - 成功');
    } catch (error) {
      console.error(
        '[SearchHistoryTable] Failed to update saved status:',
        error
      );
    } finally {
      setLoadingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(item.id);
        return newSet;
      });
      console.log('[SearchHistoryTable] handleSaveToggle完了');
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

  const handleEditSave = async (newTitle: string) => {
    try {
      if (!editModal.item) return;
      const id = editModal.item.id;
      const supa = supabase as any;
      const { error } = await supa
        .from('search_history')
        .update({
          search_title: newTitle,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
      if (error) {
        console.error('Update search title error:', error);
        return;
      }
      setEditModal({ isOpen: false, item: null });
      router.refresh();
    } catch (e) {
      console.error('Failed to update search title:', e);
    }
  };

  const handleHistoryClick = (item: SearchHistoryItem) => {
    console.log('History clicked:', item);
    console.log('Search conditions:', item.search_conditions);
    console.log('Group ID:', item.group_id);

    const searchUrl = buildSearchUrl(item.search_conditions, item.group_id);
    console.log('Generated URL:', searchUrl);

    router.push(searchUrl);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ja-JP');
  };

  if (searchHistory.length === 0) {
    return (
      <div className='text-center py-12'>
        <p className='text-gray-500'>検索履歴がありません</p>
      </div>
    );
  }

  return (
    <>
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  保存
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  検索タイトル
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  検索者
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  グループ
                </th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  検索日時
                </th>
                <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  操作
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {searchHistory.map(item => (
                <tr
                  key={item.id}
                  className='hover:bg-gray-50 cursor-pointer'
                  onClick={() => handleHistoryClick(item)}
                >
                  <td
                    className='px-6 py-4 whitespace-nowrap'
                    onClick={e => e.stopPropagation()}
                  >
                    <Checkbox
                      checked={item.is_saved}
                      onCheckedChange={checked => handleSaveToggle(item)}
                      disabled={loadingItems.has(item.id)}
                    />
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <span className='text-sm font-medium text-blue-600 hover:text-blue-800 underline'>
                      {item.search_title}
                    </span>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {item.searcher_name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {item.group_name}
                    </div>
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    <div className='text-sm text-gray-900'>
                      {formatDate(item.searched_at)}
                    </div>
                  </td>
                  <td
                    className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'
                    onClick={e => e.stopPropagation()}
                  >
                    <div className='flex items-center justify-end space-x-2'>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setEditModal({ isOpen: true, item })}
                      >
                        編集
                      </Button>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setDeleteModal({ isOpen: true, item })}
                        className='text-red-600 hover:text-red-900'
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
          onDelete={() => handleDelete(deleteModal.item!)}
          searchConditionName={deleteModal.item.search_title}
        />
      )}

      {/* 編集モーダル */}
      {editModal.item && (
        <EditSearchConditionModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, item: null })}
          onSave={handleEditSave}
          groupName={editModal.item.group_name}
          initialValue={editModal.item.search_title}
        />
      )}
    </>
  );
}
