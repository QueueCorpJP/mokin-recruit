'use client';

import React, { useState, useTransition, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminTableRow } from '@/components/admin/ui/AdminTableRow';
import { MediaTableHeader } from '@/components/admin/ui/MediaTableHeader';
import { ActionButton } from '@/components/admin/ui/ActionButton';
import { IndustryAddModal } from '@/components/admin/IndustryAddModal';
import { IndustryDeleteModal } from '@/components/admin/IndustryDeleteModal';
import { addIndustry, updateIndustry, deleteIndustry } from './actions';
import type { IndustryListItem } from './page';

interface Props {
  industries: IndustryListItem[];
}

export default function IndustryClient({ industries }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIndustry, setSelectedIndustry] =
    useState<IndustryListItem | null>(null);
  const [newIndustryName, setNewIndustryName] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const handleAddIndustryModal = () => {
      setShowAddModal(true);
    };

    window.addEventListener('add-industry-modal', handleAddIndustryModal);

    return () => {
      window.removeEventListener('add-industry-modal', handleAddIndustryModal);
    };
  }, []);

  const handleEdit = (industry: IndustryListItem) => {
    setEditingId(industry.id);
    setEditingValue(industry.name);
  };

  const handleSave = async (id: string) => {
    if (!editingValue.trim()) return;

    startTransition(async () => {
      try {
        await updateIndustry(id, editingValue.trim());
        setEditingId(null);
        setEditingValue('');
      } catch (error) {
        console.error('Failed to update industry:', error);
      }
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingValue('');
  };

  const handleAddIndustry = () => {
    setShowAddModal(true);
  };

  const handleConfirmAdd = async (industryName: string) => {
    if (!industryName.trim()) return;

    startTransition(async () => {
      try {
        await addIndustry(industryName.trim());
        setShowAddModal(false);
        setNewIndustryName('');
      } catch (error) {
        console.error('Failed to add industry:', error);
      }
    });
  };

  const handleDeleteIndustry = (industry: IndustryListItem) => {
    setSelectedIndustry(industry);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedIndustry) return;

    startTransition(async () => {
      try {
        await deleteIndustry(selectedIndustry.id);
        setShowDeleteModal(false);
        router.push(
          `/admin/industry/delete-complete?name=${encodeURIComponent(selectedIndustry.name)}`
        );
      } catch (error) {
        console.error('Failed to delete industry:', error);
      }
    });
  };

  const columns = [
    {
      key: 'name',
      label: '業種（候補者数/企業数）',
      sortable: false,
      width: 'w-[400px]',
    },
    {
      key: 'actions',
      label: 'アクション',
      sortable: false,
      width: 'w-[200px]',
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50 p-6'>
      <div className='bg-white rounded-lg overflow-x-auto'>
        <div className='min-w-max'>
          <MediaTableHeader
            columns={columns}
            sortColumn=''
            sortDirection='desc'
            onSort={() => {}}
          />
          <div className='mt-2 space-y-2'>
            {industries.map(industry => (
              <AdminTableRow
                key={industry.id}
                columns={[
                  {
                    content:
                      editingId === industry.id ? (
                        <div className='flex items-center gap-2'>
                          <input
                            type='text'
                            value={editingValue}
                            onChange={e => setEditingValue(e.target.value)}
                            className='px-2 py-1 border border-gray-300 rounded text-black'
                            autoFocus
                          />
                          <span className="font-['Inter'] text-[14px] font-medium text-black">
                            ({industry.candidate_count}/{industry.company_count}
                            )
                          </span>
                        </div>
                      ) : (
                        <div className="font-['Inter'] text-[16px] font-bold text-black">
                          {industry.name} ({industry.candidate_count}/
                          {industry.company_count})
                        </div>
                      ),
                    width: 'w-[400px]',
                  },
                ]}
                actions={
                  editingId === industry.id
                    ? [
                        <ActionButton
                          key='save'
                          text={isPending ? '保存中...' : '保存'}
                          variant='primary'
                          onClick={() => handleSave(industry.id)}
                          size='small'
                          disabled={isPending}
                        />,
                        <ActionButton
                          key='cancel'
                          text='キャンセル'
                          variant='secondary'
                          onClick={handleCancel}
                          size='small'
                        />,
                      ]
                    : [
                        <ActionButton
                          key='edit'
                          text='編集'
                          variant='primary'
                          onClick={() => handleEdit(industry)}
                          size='small'
                        />,
                        <ActionButton
                          key='delete'
                          text='削除'
                          variant='destructive'
                          onClick={() => handleDeleteIndustry(industry)}
                          size='small'
                        />,
                      ]
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* モーダル群 */}
      <IndustryAddModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onConfirm={handleConfirmAdd}
        inputValue={newIndustryName}
        onInputChange={setNewIndustryName}
      />

      {selectedIndustry && (
        <IndustryDeleteModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
          industryName={selectedIndustry.name}
        />
      )}
    </div>
  );
}
