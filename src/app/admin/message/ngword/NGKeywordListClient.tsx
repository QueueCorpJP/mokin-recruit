"use client";
import React, { useState, useEffect } from 'react';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { deleteNGKeyword } from './actions';

interface NGKeywordItem {
  id: string;
  created_at: string;
  keyword: string;
}

interface Props {
  ngKeywords: NGKeywordItem[];
}

export default function NGKeywordListClient({ ngKeywords }: Props) {
  const [keywords, setKeywords] = useState(ngKeywords);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [completeOpen, setCompleteOpen] = useState(false);
  const [targetKeyword, setTargetKeyword] = useState<NGKeywordItem | null>(null);

  // NGキーワード追加後のリロード対応
  useEffect(() => {
    const reload = () => {
      // 完了モーダルを閉じた後にリロード
      setTimeout(() => {
        window.location.reload();
      }, 100);
    };
    window.addEventListener('reload-ngkeyword-list', reload);
    return () => window.removeEventListener('reload-ngkeyword-list', reload);
  }, []);

  // 消去ボタン押下時
  const handleDeleteClick = (item: NGKeywordItem) => {
    setTargetKeyword(item);
    setConfirmOpen(true);
  };

  // モーダルで「消去する」押下時
  const handleConfirmDelete = async () => {
    if (!targetKeyword) return;
    setDeletingId(targetKeyword.id);
    
    try {
      const result = await deleteNGKeyword(targetKeyword.id);
      if (result.success) {
        setConfirmOpen(false);
        setCompleteOpen(true);
        // 削除成功後にページ全体をリロード
        setTimeout(() => {
          window.location.reload();
        }, 2000); // 完了モーダル表示時間を考慮
      } else {
        if (process.env.NODE_ENV === 'development') console.error('削除エラー:', result.error);
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('削除エラー:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddClick = () => {
    window.dispatchEvent(new CustomEvent('add-ngkeyword-modal'));
  };

  return (
    <div className="min-w-[600px]">
      <MediaTableHeader
        columns={[
          { key: 'created_at', label: '登録日付', sortable: false, width: 'w-[180px]' },
          { key: 'keyword', label: 'NGキーワード', sortable: false, width: 'w-[300px]' },
          { key: 'actions', label: '', sortable: false, width: 'w-[120px]' },
        ]}
        rightSideButton={
          <AdminButton
            text="追加"
            variant="green-gradient"
            size="figma-small"
            onClick={handleAddClick}
          />
        }
      />
      <div className="mt-2 space-y-2">
        {keywords.map((item) => (
          <AdminTableRow
            key={item.id}
            columns={[
              {
                content: (
                  <div className="font-['Noto_Sans_JP'] text-[14px] text-[#323232]">
                    {new Date(item.created_at).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                  </div>
                ),
                width: 'w-[180px]',
              },
              {
                content: (
                  <div className="font-['Noto_Sans_JP'] text-[14px] text-[#323232]">
                    {item.keyword}
                  </div>
                ),
                width: 'w-[300px]',
              },
            ]}
            actions={[
              <AdminButton
                key="delete"
                text={deletingId === item.id ? '消去中...' : '消去'}
                variant="destructive"
                size="figma-small"
                disabled={deletingId === item.id}
                onClick={() => handleDeleteClick(item)}
              />
            ]}
          />
        ))}
        {keywords.length === 0 && (
          <div className="text-center text-gray-400 py-8">NGキーワードが登録されていません</div>
        )}
      </div>
      {/* 確認モーダル */}
      <AdminConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="NGキーワードを消去しますか？"
        description={targetKeyword ? targetKeyword.keyword : ''}
        confirmText="消去する"
        cancelText="閉じる"
        message="この操作は取り消せません。"
        variant="delete"
      />
      {/* 完了モーダル */}
      <AdminConfirmModal
        isOpen={completeOpen}
        onClose={() => setCompleteOpen(false)}
        onConfirm={() => setCompleteOpen(false)}
        title="消去完了"
        description=""
        confirmText="NGキーワード一覧に戻る"
        cancelText=""
        message="NGキーワードの消去が完了しました。"
        variant="delete"
        // ボタン幅を300pxに
        confirmClassName="w-[250px]"
      />
    </div>
  );
}
