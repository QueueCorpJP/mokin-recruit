'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';

import { articleService, ArticleCategory } from '@/lib/services/articleService';

interface Category extends ArticleCategory {
  articleCount: number;
}

export default function CategoryPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [deletedCategoryName, setDeletedCategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchCategories();
    
    // URLパラメーターでモーダル開閉を制御
    const modalParam = searchParams.get('modal');
    if (modalParam === 'add') {
      setShowModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleAddCategoryEvent = () => {
      handleAddCategory();
    };

    window.addEventListener('add-category-modal', handleAddCategoryEvent);

    return () => {
      window.removeEventListener('add-category-modal', handleAddCategoryEvent);
    };
  }, []);


  const fetchCategories = async () => {
    try {
      setLoading(true);
      const categoryData = await articleService.getCategories();
      
      const categoriesWithCount = await Promise.all(
        categoryData.map(async (category) => {
          const articleCount = await articleService.getCategoryArticleCount(category.id!);
          return {
            ...category,
            articleCount
          };
        })
      );

      setCategories(categoriesWithCount);
    } catch (err) {
      console.error('カテゴリの取得に失敗:', err);
      setError(err instanceof Error ? err.message : 'カテゴリの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };
  
  const handleEdit = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category) {
      setEditingCategoryId(categoryId);
      setEditingCategoryName(category.name);
    }
  };

  const handleSaveEdit = async () => {
    if (editingCategoryId && editingCategoryName.trim()) {
      try {
        await articleService.updateCategory(editingCategoryId, editingCategoryName.trim());
        setEditingCategoryId(null);
        setEditingCategoryName('');
        // リストを再取得
        fetchCategories();
      } catch (err) {
        console.error('カテゴリの更新に失敗:', err);
        setError(err instanceof Error ? err.message : 'カテゴリの更新に失敗しました');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  const handleDelete = (categoryId: string) => {
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
      setCategoryToDelete(category);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (categoryToDelete) {
      try {
        await articleService.deleteCategory(categoryToDelete.id!);
        setDeletedCategoryName(categoryToDelete.name);
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        setShowDeletedModal(true);
        // リストを再取得
        fetchCategories();
      } catch (err) {
        console.error('カテゴリの削除に失敗:', err);
        setError(err instanceof Error ? err.message : 'カテゴリの削除に失敗しました');
      }
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleCloseDeletedModal = () => {
    setShowDeletedModal(false);
    setDeletedCategoryName('');
  };

  const handleAddCategory = () => {
    setShowModal(true);
    setNewCategoryName('');
  };

  const handleConfirmAdd = async (categoryName: string) => {
    if (categoryName.trim()) {
      try {
        await articleService.createCategory(categoryName.trim());
        setShowModal(false);
        setNewCategoryName('');
        // リストを再取得
        fetchCategories();
      } catch (err) {
        console.error('カテゴリの作成に失敗:', err);
        setError(err instanceof Error ? err.message : 'カテゴリの作成に失敗しました');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewCategoryName('');
    // URLパラメーターを削除
    router.replace('/admin/media/category');
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
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

  const columns = [
    { key: 'categoryName', label: 'カテゴリ名', sortable: true, width: 'flex-1' },
    { key: 'actions', label: '', sortable: false, width: 'w-[200px]' }
  ];

  // ソート処理
  const sortedCategories = [...categories].sort((a, b) => {
    if (!sortColumn || !sortDirection) return 0;
    
    let aValue: string;
    let bValue: string;
    
    switch (sortColumn) {
      case 'categoryName':
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
  const paginatedCategories = sortedCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(sortedCategories.length / itemsPerPage);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">読み込み中...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600">エラー: {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">

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

        {/* カテゴリ一覧 */}
        <div className="mt-2 space-y-2">
          {paginatedCategories.map((category) => (
            <AdminTableRow
              key={category.id}
              columns={[
                {
                  content: editingCategoryId === category.id ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px] font-['Noto_Sans_JP']"
                        autoFocus
                      />
                      <span className="text-[14px] font-medium text-[#666] leading-[1.6] tracking-[1.4px] font-['Noto_Sans_JP']">
                        （該当記事{category.articleCount}件）
                      </span>
                    </div>
                  ) : (
                    <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                      {category.name}（該当記事{category.articleCount}件）
                    </span>
                  ),
                  width: 'flex-1'
                }
              ]}
              actions={
                editingCategoryId === category.id ? [
                  <ActionButton key="save" text="保存" variant="edit" onClick={handleSaveEdit} />,
                  <ActionButton key="cancel" text="キャンセル" variant="delete" onClick={handleCancelEdit} />
                ] : [
                  <ActionButton key="edit" text="編集" variant="edit" onClick={() => handleEdit(category.id!)} />,
                  <ActionButton key="delete" text="削除" variant="delete" onClick={() => handleDelete(category.id!)} />
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
          variant="primary"
          disabled={currentPage === 1}
        />
        <AdminButton
          onClick={handleNext}
          text="次へ"
          variant="primary"
          disabled={currentPage === totalPages || totalPages === 0}
        />
      </div>

      {/* 追加モーダル */}
      <AdminModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmAdd}
        title="カテゴリ追加"
        description="追加したいカテゴリ名を入力してください。"
        inputValue={newCategoryName}
        onInputChange={setNewCategoryName}
        placeholder="カテゴリ名を入力してください"
      />

      {/* 削除確認モーダル */}
      <AdminConfirmModal
        isOpen={showDeleteModal}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        title="カテゴリ削除"
        description={"このカテゴリを削除してよいですか？"}
        confirmText="削除する"
        cancelText="閉じる"
      />

      {/* 削除完了通知モーダル */}
      <AdminNotificationModal
        isOpen={showDeletedModal}
        onConfirm={handleCloseDeletedModal}
        title="カテゴリ削除完了"
        description={"カテゴリの削除が完了しました。"}
        confirmText="カテゴリ一覧に戻る"
      />
    </div>
  );
}