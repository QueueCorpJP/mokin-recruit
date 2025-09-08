'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useClientAuth';
import { AccessRestricted } from '@/components/AccessRestricted';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';
import { getTags, createTag, updateTag, deleteTag, getTagArticleCount, ArticleTag } from '@/app/admin/media/actions';

interface Tag extends ArticleTag {
  articleCount: number;
}

export default function TagPage() {
  const { isAdmin, loading } = useAdminAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tags, setTags] = useState<Tag[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [newTagName, setNewTagName] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [deletedTagName, setDeletedTagName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editingTagName, setEditingTagName] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    if (isAdmin) {
      fetchTags();
      
      // URLパラメーターでモーダル開閉を制御
      const modalParam = searchParams.get('modal');
      if (modalParam === 'add') {
        setShowModal(true);
      }
    }
  }, [searchParams, isAdmin]);

  useEffect(() => {
    const handleAddTagEvent = () => {
      handleAddTag();
    };

    window.addEventListener('add-tag-modal', handleAddTagEvent);

    return () => {
      window.removeEventListener('add-tag-modal', handleAddTagEvent);
    };
  }, []);

  const fetchTags = async () => {
    try {
      setDataLoading(true);
      const tagData = await getTags();
      
      const tagsWithCount = await Promise.all(
        tagData.map(async (tag) => {
          const articleCount = await getTagArticleCount(tag.id!);
          return {
            ...tag,
            articleCount
          };
        })
      );

      setTags(tagsWithCount);
    } catch (err) {
      console.error('タグの取得に失敗:', err);
      setError(err instanceof Error ? err.message : 'タグの取得に失敗しました');
    } finally {
      setDataLoading(false);
    }
  };
  
  const handleEdit = (tagId: string) => {
    const tag = tags.find(t => t.id === tagId);
    if (tag) {
      setEditingTagId(tagId);
      setEditingTagName(tag.name);
    }
  };

  const handleSaveEdit = async () => {
    if (editingTagId && editingTagName.trim()) {
      try {
        await updateTag(editingTagId, editingTagName.trim());
        setEditingTagId(null);
        setEditingTagName('');
        // リストを再取得
        fetchTags();
      } catch (err) {
        console.error('タグの更新に失敗:', err);
        setError(err instanceof Error ? err.message : 'タグの更新に失敗しました');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingTagId(null);
    setEditingTagName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDelete = (tagId: string) => {
    const tag = tags.find(tag => tag.id === tagId);
    if (tag) {
      setTagToDelete(tag);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (tagToDelete) {
      try {
        await deleteTag(tagToDelete.id!);
        setDeletedTagName(tagToDelete.name);
        setShowDeleteModal(false);
        setTagToDelete(null);
        setShowDeletedModal(true);
        // リストを再取得
        fetchTags();
      } catch (err) {
        console.error('タグの削除に失敗:', err);
        setError(err instanceof Error ? err.message : 'タグの削除に失敗しました');
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTagToDelete(null);
  };

  const handleCloseDeletedModal = () => {
    setShowDeletedModal(false);
    setDeletedTagName('');
  };

  const handleAddTag = () => {
    setShowModal(true);
    setNewTagName('');
  };

  const handleConfirmAdd = async (tagName: string) => {
    if (tagName.trim()) {
      try {
        await createTag(tagName.trim());
        setShowModal(false);
        setNewTagName('');
        // リストを再取得
        fetchTags();
      } catch (err) {
        console.error('タグの作成に失敗:', err);
        setError(err instanceof Error ? err.message : 'タグの作成に失敗しました');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTagName('');
    // URLパラメーターを削除
    router.replace('/admin/media/tag');
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn('');
      }
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
    setCurrentPage(1); // ソート時はページを1に戻す
  };


  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(tags.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const columns = [
    { key: 'tagName', label: 'タグ名', sortable: true, width: 'flex-1' },
    { key: 'actions', label: '', sortable: false, width: 'w-[200px]' }
  ];

  // ソート処理
  const sortedTags = [...tags].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aValue: string;
    let bValue: string;
    
    switch (sortColumn) {
      case 'tagName':
        aValue = a.name;
        bValue = b.name;
        break;
      default:
        return 0;
    }
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue, 'ja', {
        numeric: true,
        sensitivity: 'base',
        ignorePunctuation: true
      });
    } else {
      return bValue.localeCompare(aValue, 'ja', {
        numeric: true,
        sensitivity: 'base',
        ignorePunctuation: true
      });
    }
  });

  // ページネーション
  const paginatedTags = sortedTags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedTags.length / itemsPerPage);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">認証状態を確認中...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessRestricted userType="admin" />;
  }

  if (dataLoading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">エラー: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`${column.width || 'flex-1'} px-3 ${column.sortable ? 'cursor-pointer select-none' : ''}`}
              onClick={() => column.sortable && handleSort(column.key)}
            >
              <div className="flex items-center gap-2">
                <span className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] leading-[1.6] tracking-[1.4px]">
                  {column.label}
                </span>
                {column.sortable && (
                  <div className="flex flex-col gap-0.5">
                    <ArrowIcon
                      direction="up"
                      size={8}
                      color="#0F9058"
                    />
                    <ArrowIcon
                      direction="down"
                      size={8}
                      color="#0F9058"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* タグ一覧 */}
        <div className="mt-2 space-y-2">
          {paginatedTags.map((tag) => (
            <AdminTableRow
              key={tag.id}
              columns={[
                {
                  content: editingTagId === tag.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingTagName}
                        onChange={(e) => setEditingTagName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] font-['Noto_Sans_JP']"
                        autoFocus
                      />
                      <span className="text-[14px] font-medium text-[#666] leading-[1.6] tracking-[1.4px] font-['Noto_Sans_JP']">
                        （該当記事{tag.articleCount}件）
                      </span>
                    </div>
                  ) : (
                    <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                      {tag.name}（該当記事{tag.articleCount}件）
                    </span>
                  ),
                  width: 'flex-1'
                }
              ]}
              actions={
                editingTagId === tag.id ? [
                  <ActionButton key="save" text="保存" variant="edit" onClick={handleSaveEdit} />,
                  <ActionButton key="cancel" text="キャンセル" variant="delete" onClick={handleCancelEdit} />
                ] : [
                  <ActionButton key="edit" text="編集" variant="edit" onClick={() => handleEdit(tag.id!)} />,
                  <ActionButton key="delete" text="削除" variant="delete" onClick={() => handleDelete(tag.id!)} />
                ]
              }
            />
          ))}
        </div>
      </div>

      {/* ページネーション */}
      <div className="flex justify-center gap-[74px] mt-8">
        <AdminButton
          onClick={handlePrevious}
          text="前へ"
          variant="green-gradient"
          disabled={currentPage === 1}
        />
        <AdminButton
          onClick={handleNext}
          text="次へ"
          variant="green-gradient"
          disabled={currentPage === totalPages || totalPages === 0}
        />
      </div>

      {/* 追加モーダル */}
      <AdminModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        title="タグ追加"
        description="追加したいタグ名を入力してください。"
        inputValue={newTagName}
        onInputChange={setNewTagName}
        placeholder="タグ名を入力してください"
      />

      {/* 削除確認モーダル */}
      <AdminConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="タグ削除"
        description={"このタグを削除してよいですか？"}
        confirmText="削除する"
        cancelText="閉じる"
      />

      {/* 削除完了通知モーダル */}
      <AdminNotificationModal
        isOpen={showDeletedModal}
        onConfirm={handleCloseDeletedModal}
        title="タグ削除完了"
        description={"タグの削除が完了しました。"}
        confirmText="タグ一覧に戻る"
      />
    </div>
  );
}