'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/providers/AuthProvider';

export interface SearchHistoryItem {
  id: string;
  searcher_id: string;
  searcher_name: string;
  group_id: string;
  group_name: string;
  search_conditions: any;
  search_title: string;
  is_saved: boolean;
  searched_at: string;
  created_at: string;
  updated_at: string;
}

export function useSearchHistory(groupId?: string) {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  const fetchSearchHistory = async () => {
    if (!user) {
      setSearchHistory([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from('search_history')
        .select('*')
        .order('searched_at', { ascending: false });

      if (groupId) {
        query = query.eq('group_id', groupId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Search history fetch error:', error);
        setError('検索履歴の取得に失敗しました');
        return;
      }

      setSearchHistory(data || []);
      setError(null);
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('予期しないエラーが発生しました');
    } finally {
      setLoading(false);
    }
  };

  const updateSavedStatus = async (historyId: string, isSaved: boolean) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .update({ 
          is_saved: isSaved,
          updated_at: new Date().toISOString()
        })
        .eq('id', historyId);

      if (error) {
        console.error('Update saved status error:', error);
        throw new Error('保存状態の更新に失敗しました');
      }

      // ローカル状態を更新
      setSearchHistory(prev => 
        prev.map(item => 
          item.id === historyId ? { ...item, is_saved: isSaved } : item
        )
      );
    } catch (err) {
      throw err;
    }
  };

  const deleteSearchHistory = async (historyId: string) => {
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', historyId);

      if (error) {
        console.error('Delete search history error:', error);
        throw new Error('検索履歴の削除に失敗しました');
      }

      // ローカル状態を更新
      setSearchHistory(prev => prev.filter(item => item.id !== historyId));
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchSearchHistory();
  }, [user, groupId]);

  return {
    searchHistory,
    loading,
    error,
    refetch: fetchSearchHistory,
    updateSavedStatus,
    deleteSearchHistory
  };
}