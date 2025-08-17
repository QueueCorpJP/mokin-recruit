'use client';

import { useState } from 'react';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { ArrowIcon } from '@/components/admin/ui/ArrowIcon';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { PaginationButtons } from '@/components/admin/ui/PaginationButtons';

interface Tag {
  id: string;
  name: string;
  articleCount: number;
}

export default function TagPage() {
  const [tags, setTags] = useState<Tag[]>([
    { id: '1', name: 'タグ', articleCount: 5 },
    { id: '2', name: 'タグB', articleCount: 3 },
    { id: '3', name: 'タグC', articleCount: 8 },
    { id: '4', name: 'タグD', articleCount: 2 },
    { id: '5', name: 'タグE', articleCount: 12 },
    { id: '6', name: 'タグF', articleCount: 1 },
    { id: '7', name: 'タグG', articleCount: 7 },
    { id: '8', name: 'タグH', articleCount: 4 },
    { id: '9', name: 'タグI', articleCount: 6 },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
  const [deletedTagName, setDeletedTagName] = useState('');
  const [newTagName, setNewTagName] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  const handleEdit = (tagId: string) => {
    console.log('Edit tag:', tagId);
  };

  const handleDelete = (tagId: string) => {
    const tag = tags.find(tag => tag.id === tagId);
    if (tag) {
      setTagToDelete(tag);
      setShowDeleteModal(true);
    }
  };

  const handleConfirmDelete = () => {
    if (tagToDelete) {
      setTags(tags.filter(tag => tag.id !== tagToDelete.id));
      setDeletedTagName(tagToDelete.name);
      setShowDeleteModal(false);
      setTagToDelete(null);
      setShowDeletedModal(true);
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

  const handleConfirmAdd = (tagName: string) => {
    if (tagName.trim()) {
      const newTag: Tag = {
        id: (tags.length + 1).toString(),
        name: tagName.trim(),
        articleCount: 0
      };
      setTags([...tags, newTag]);
      setShowModal(false);
      setNewTagName('');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewTagName('');
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

  // ページネーション
  const paginatedTags = tags.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.ceil(tags.length / itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* 上部の機能エリア */}
      <div className="mb-6 flex justify-end">
        <AdminButton
          onClick={handleAddTag}
          text="新規タグ追加"
          variant="primary"
        />
      </div>

      {/* テーブルコンテナ */}
      <div className="bg-white rounded-lg overflow-x-auto">
        {/* テーブルヘッダー */}
        <div className="flex items-center px-5 py-3 bg-[#F8F8F8] border-b border-[#E5E5E5]">
          {columns.map((column) => (
            <div
              key={column.key}
              className={`${column.width || 'flex-1'} px-3`}
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
                  content: (
                    <span className="font-['Noto_Sans_JP'] text-[14px] font-medium text-[#323232] leading-[1.6] tracking-[1.4px]">
                      {tag.name}（該当記事{tag.articleCount}件）
                    </span>
                  ),
                  width: 'flex-1'
                }
              ]}
              actions={[
                <ActionButton key="edit" text="編集" variant="edit" onClick={() => handleEdit(tag.id)} />,
                <ActionButton key="delete" text="削除" variant="delete" onClick={() => handleDelete(tag.id)} />
              ]}
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
        title="タグ追加"
        description="追加したいタグ名を入力してください。"
        inputValue={newTagName}
        onInputChange={setNewTagName}
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