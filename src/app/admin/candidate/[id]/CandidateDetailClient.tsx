'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { CandidateDetailData } from './page';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminModal } from '@/components/admin/ui/AdminModal';
import { deleteCandidate, updateCandidateMemo } from './actions';

interface Props {
  candidate: CandidateDetailData;
}

export default function CandidateDetailClient({ candidate }: Props) {
  const router = useRouter();
  const [memo, setMemo] = useState(candidate.admin_memo || '');
  const [isSavingMemo, setIsSavingMemo] = useState(false);
  const [_deleteInputValue, setDeleteInputValue] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Deduplicate arrays to avoid key conflicts
  const uniqueEducation =
    candidate.education?.filter(
      (edu, index, arr) =>
        arr.findIndex(e => JSON.stringify(e) === JSON.stringify(edu)) === index
    ) || [];

  const uniqueSkills =
    candidate.skills?.filter(
      (skill, index, arr) =>
        arr.findIndex(s => JSON.stringify(s) === JSON.stringify(skill)) ===
        index
    ) || [];

  const _age = candidate.birth_date
    ? new Date().getFullYear() - new Date(candidate.birth_date).getFullYear()
    : null;

  const _formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleDelete = useCallback(() => {
    setShowDeleteModal(true);
    setDeleteInputValue('');
  }, []);

  const handleConfirmDelete = useCallback(
    async (_inputValue: string) => {
      setIsDeleting(true);
      try {
        const result = await deleteCandidate(candidate.id);
        if (result.success) {
          router.push(`/admin/candidate/${candidate.id}/deleted`);
        } else {
          alert(result.error || '削除に失敗しました');
          setIsDeleting(false);
          setShowDeleteModal(false);
        }
      } catch (error) {
        console.error('Error deleting candidate:', error);
        alert('削除に失敗しました');
        setIsDeleting(false);
        setShowDeleteModal(false);
      }
    },
    [candidate.id, router]
  );

  const handleCancelDelete = useCallback(() => {
    setShowDeleteModal(false);
    setDeleteInputValue('');
  }, []);

  const handleSaveMemo = useCallback(async () => {
    setIsSavingMemo(true);
    try {
      const result = await updateCandidateMemo(candidate.id, memo);
      if (result.success) {
        alert('メモを保存しました');
      } else {
        alert(result.error || 'メモの保存に失敗しました');
      }
    } catch (error) {
      console.error('Error saving memo:', error);
      alert('メモの保存に失敗しました');
    } finally {
      setIsSavingMemo(false);
    }
  }, [candidate.id, memo]);

  // CustomEventリスナーの設定
  useEffect(() => {
    const handleDeleteModal = () => {
      handleDelete();
    };

    window.addEventListener('candidate-delete-modal', handleDeleteModal);

    return () => {
      window.removeEventListener('candidate-delete-modal', handleDeleteModal);
    };
  }, [handleDelete]);

  return (
    <div className='min-h-screen'>
      {/* 削除確認モーダル */}
      <AdminModal
        isOpen={showDeleteModal}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title='候補者アカウント消去'
        description={`候補者氏名: ${candidate.last_name && candidate.first_name ? `${candidate.last_name} ${candidate.first_name}` : `ID: ${candidate.id}`}\n\n候補者アカウントを消去しますか？`}
        inputValue=''
        onInputChange={() => {}}
        confirmText={isDeleting ? '消去中...' : '消去する'}
        cancelText='キャンセル'
        placeholder=''
        showInput={false}
      />

      {/* ユーザーID表示 */}
      <div className='p-6 mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>
          ユーザーID: {candidate.id}
        </h1>
      </div>

      <div className='p-8'>
        {/* 候補者分析 */}
        <section className='mb-12'>
          <h2 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            候補者分析
          </h2>
          <div className='bg-white relative rounded-[4px] w-full'>
            <div className='content-stretch flex flex-col items-start justify-start overflow-clip relative w-full'>
              {/* ヘッダー行 */}
              <div className='bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full'>
                <div className='basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>&nbsp;</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>スカウト受信数</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>開封数（開封率）</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>返信数（返信率）</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>応募数（応募率）</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 過去7日合計行 */}
              <div className='bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full'>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>過去7日合計</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_received_7days}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_opened_7days}
                        {candidate.scout_stats.scout_received_7days > 0
                          ? ` (${Math.round((candidate.scout_stats.scout_opened_7days / candidate.scout_stats.scout_received_7days) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_replied_7days}
                        {candidate.scout_stats.scout_received_7days > 0
                          ? ` (${Math.round((candidate.scout_stats.scout_replied_7days / candidate.scout_stats.scout_received_7days) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap'>
                      <p className='leading-[1.3] whitespace-pre'>
                        {candidate.scout_stats.applications_7days}
                        {candidate.scout_stats.scout_received_7days > 0
                          ? ` (${Math.round((candidate.scout_stats.applications_7days / candidate.scout_stats.scout_received_7days) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 過去30日間合計行 */}
              <div className='bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full'>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>過去30日間合計</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_received_30days}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_opened_30days}
                        {candidate.scout_stats.scout_received_30days > 0
                          ? ` (${Math.round((candidate.scout_stats.scout_opened_30days / candidate.scout_stats.scout_received_30days) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_replied_30days}
                        {candidate.scout_stats.scout_received_30days > 0
                          ? ` (${Math.round((candidate.scout_stats.scout_replied_30days / candidate.scout_stats.scout_received_30days) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap'>
                      <p className='leading-[1.3] whitespace-pre'>
                        {candidate.scout_stats.applications_30days}
                        {candidate.scout_stats.scout_received_30days > 0
                          ? ` (${Math.round((candidate.scout_stats.applications_30days / candidate.scout_stats.scout_received_30days) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 累計行 */}
              <div className='bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full'>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>累計</p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_received_total}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_opened_total}
                        {candidate.scout_stats.scout_received_total > 0
                          ? ` (${Math.round((candidate.scout_stats.scout_opened_total / candidate.scout_stats.scout_received_total) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black'>
                      <p className='leading-[1.3]'>
                        {candidate.scout_stats.scout_replied_total}
                        {candidate.scout_stats.scout_received_total > 0
                          ? ` (${Math.round((candidate.scout_stats.scout_replied_total / candidate.scout_stats.scout_received_total) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0'>
                  <div
                    aria-hidden='true'
                    className='absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none'
                  />
                  <div className='box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full'>
                    <div className='font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap'>
                      <p className='leading-[1.3] whitespace-pre'>
                        {candidate.scout_stats.applications_total}
                        {candidate.scout_stats.scout_received_total > 0
                          ? ` (${Math.round((candidate.scout_stats.applications_total / candidate.scout_stats.scout_received_total) * 100)}%)`
                          : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              aria-hidden='true'
              className='absolute border border-[#b9b9b9] border-solid inset-0 pointer-events-none rounded-[4px]'
            />
          </div>
        </section>

        {/* 運営メモ */}
        <section className='mb-12'>
          <h3 className='text-lg font-semibold text-gray-800 mb-4'>運営メモ</h3>
          <div className='border p-1'>
            <textarea
              value={memo}
              onChange={e => setMemo(e.target.value)}
              className='w-full h-32 p-4 border border-gray-300 rounded-lg resize-none mb-4'
              placeholder='自由にメモを記入できます。同一グループ内の方が閲覧可能です。'
            />
          </div>
          <div className='flex justify-end'>
            <AdminButton
              onClick={handleSaveMemo}
              text={isSavingMemo ? '保存中...' : 'メモを保存'}
              variant='primary'
              size='sm'
              disabled={isSavingMemo}
            />
          </div>
        </section>

        {/* メールアドレス */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            メールアドレス
          </h3>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                メールアドレス
              </label>
              <div className='text-gray-900'>{candidate.email || '未入力'}</div>
            </div>
          </div>
        </section>

        {/* パスワード */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            パスワード
          </h3>
          <div className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                パスワード
              </label>
              <div className='text-gray-900'>
                {candidate.password_hash ? '設定済み' : '未設定'}
              </div>
            </div>
          </div>
        </section>

        {/* 基本情報 */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            基本情報
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                お名前
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.last_name && candidate.first_name
                  ? `${candidate.last_name} ${candidate.first_name}`
                  : '入力された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                フリガナ
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.last_name_kana && candidate.first_name_kana
                  ? `${candidate.last_name_kana} ${candidate.first_name_kana}`
                  : '入力された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                性別
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.gender === 'male'
                  ? '男性'
                  : candidate.gender === 'female'
                    ? '女性'
                    : '選択された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                現在の住まい
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.prefecture || '選択された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                生年月日
              </span>
              <div className='flex gap-2 items-center text-gray-900 flex-1'>
                {candidate.birth_date ? (
                  <>
                    <span>{new Date(candidate.birth_date).getFullYear()}</span>
                    <span className='text-gray-600'>年</span>
                    <span>{new Date(candidate.birth_date).getMonth() + 1}</span>
                    <span className='text-gray-600'>月</span>
                    <span>{new Date(candidate.birth_date).getDate()}</span>
                    <span className='text-gray-600'>日</span>
                  </>
                ) : (
                  <>
                    <span>選択された内容を表示</span>
                    <span className='text-gray-600'>年</span>
                    <span>選択された内容を表示</span>
                    <span className='text-gray-600'>月</span>
                    <span>選択された内容を表示</span>
                    <span className='text-gray-600'>日</span>
                  </>
                )}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                連絡先電話番号
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.phone_number || '入力された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                現在の年収
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.current_income || '選択された内容を表示'}
              </span>
            </div>
          </div>
        </section>

        {/* 転職活動状況 */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            転職活動状況
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                転職経験
              </h4>
              <div className='space-y-6'>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    転職経験
                  </span>
                  <span className='text-gray-900 flex-1'>
                    {candidate.has_career_change || '選択された内容を表示'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                転職活動状況
              </h4>
              <div className='space-y-6'>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    転職希望時期
                  </span>
                  <span className='text-gray-900 flex-1'>
                    {candidate.job_change_timing || '選択された内容を表示'}
                  </span>
                </div>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    現在の活動状況
                  </span>
                  <span className='text-gray-900 flex-1'>
                    {candidate.current_activity_status ||
                      '選択された内容を表示'}
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                選考状況
              </h4>
              <div className='bg-gray-50 p-6 rounded-lg min-h-[200px]'>
                <div className='space-y-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      公開範囲
                    </label>
                    <div className='text-gray-900'>指定された公開範囲</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      業種
                    </label>
                    <div className='text-gray-900'>入力された内容を表示</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      企業名
                    </label>
                    <div className='text-gray-900'>入力された内容を表示</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      部署名・役職名
                    </label>
                    <div className='text-gray-900'>入力された内容を表示</div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      進捗状況
                    </label>
                    <div className='text-gray-900'>入力された内容を表示</div>
                  </div>
                </div>
              </div>
              <div className='mt-4 text-center'>
                <AdminButton
                  text='メッセージを見る'
                  variant='green-outline'
                  size='figma-small'
                />
              </div>
            </div>
          </div>
        </section>

        {/* 職務経歴 */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            職務経歴
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                企業名
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.recent_job_company_name || '入力された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                部署名・役職名
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.recent_job_department_position ||
                  '入力された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                開始年月
              </span>
              <div className='flex gap-2 items-center text-gray-900 flex-1'>
                <span>
                  {candidate.recent_job_start_year || '選択された内容を表示'}
                </span>
                <span className='text-gray-600'>年</span>
                <span>
                  {candidate.recent_job_start_month || '選択された内容を表示'}
                </span>
                <span className='text-gray-600'>月</span>
              </div>
            </div>
            {candidate.recent_job_is_currently_working ? (
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'></span>
                <div className='flex gap-2 items-center text-gray-900 flex-1'>
                  <span>在籍中</span>
                </div>
              </div>
            ) : (
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  終了年月
                </span>
                <div className='flex gap-2 items-center text-gray-900 flex-1'>
                  <span>{candidate.recent_job_end_year || ''}</span>
                  {candidate.recent_job_end_year && (
                    <span className='text-gray-600'>年</span>
                  )}
                  <span>{candidate.recent_job_end_month || ''}</span>
                  {candidate.recent_job_end_month && (
                    <span className='text-gray-600'>月</span>
                  )}
                </div>
              </div>
            )}
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                直近の在籍企業の業種
              </span>
              <div className='flex flex-wrap gap-2 flex-1'>
                {(() => {
                  // recent_job_industriesは配列で、各要素がindustries配列を持つ
                  const allIndustries: any[] = [];
                  if (
                    candidate.recent_job_industries &&
                    Array.isArray(candidate.recent_job_industries)
                  ) {
                    candidate.recent_job_industries.forEach((entry: any) => {
                      if (entry.industries && Array.isArray(entry.industries)) {
                        allIndustries.push(...entry.industries);
                      }
                    });
                  }

                  return allIndustries.length > 0 ? (
                    allIndustries.map((industry: any, index: number) => (
                      <span
                        key={`industry-${index}`}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                      >
                        {industry?.name || industry?.id || '未設定'}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-500'>未入力</span>
                  );
                })()}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                直近の在籍企業の業種での職種
              </span>
              <div className='flex flex-wrap gap-2 flex-1'>
                {(() => {
                  // recent_job_typesを使用する（recent_job_industriesではなく）
                  const allJobTypes: any[] = [];
                  if (
                    candidate.recent_job_types &&
                    Array.isArray(candidate.recent_job_types)
                  ) {
                    candidate.recent_job_types.forEach((entry: any) => {
                      if (entry.jobTypes && Array.isArray(entry.jobTypes)) {
                        allJobTypes.push(...entry.jobTypes);
                      } else if (Array.isArray(entry)) {
                        allJobTypes.push(...entry);
                      } else {
                        allJobTypes.push(entry);
                      }
                    });
                  }

                  return allJobTypes.length > 0 ? (
                    allJobTypes.map((jobType: any, index: number) => (
                      <span
                        key={`job-type-${index}`}
                        className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                      >
                        {jobType?.name || jobType?.id || '未設定'}
                      </span>
                    ))
                  ) : (
                    <span className='text-gray-500'>未入力</span>
                  );
                })()}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                直近の在籍企業での業務内容
              </span>
              <div className='text-gray-900 whitespace-pre-wrap flex-1'>
                {candidate.recent_job_description ||
                  '入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示入力された業務内容を表示'}
              </div>
            </div>
          </div>
        </section>

        {/* 学歴・経験業種/職種 */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            学歴・経験業種/職種
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                最終学歴
              </h4>
              <div className='space-y-6'>
                {uniqueEducation.length > 0 ? (
                  uniqueEducation.map((edu, index) => (
                    <div
                      key={`education-${index}-${edu.school_name || ''}-${edu.graduation_year || ''}`}
                      className='space-y-6'
                    >
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          最終学歴
                        </span>
                        <span className='text-gray-900 flex-1'>
                          {edu.final_education || '未設定'}
                        </span>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          学校名
                        </span>
                        <span className='text-gray-900 flex-1'>
                          {edu.school_name || '未設定'}
                        </span>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          学部学科専攻
                        </span>
                        <span className='text-gray-900 flex-1'>
                          {edu.department || '未設定'}
                        </span>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          卒業年月
                        </span>
                        <div className='flex gap-2 items-center text-gray-900 flex-1'>
                          <span>{edu.graduation_year || '未設定'}</span>
                          <span className='text-gray-600'>年</span>
                          <span>{edu.graduation_month || '未設定'}</span>
                          <span className='text-gray-600'>月</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className='space-y-6'>
                    <div className='flex gap-8'>
                      <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                        最終学歴
                      </span>
                      <span className='text-gray-500 flex-1'>未設定</span>
                    </div>
                    <div className='flex gap-8'>
                      <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                        学校名
                      </span>
                      <span className='text-gray-500 flex-1'>未設定</span>
                    </div>
                    <div className='flex gap-8'>
                      <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                        学部学科専攻
                      </span>
                      <span className='text-gray-500 flex-1'>未設定</span>
                    </div>
                    <div className='flex gap-8'>
                      <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                        卒業年月
                      </span>
                      <div className='flex gap-2 items-center text-gray-500 flex-1'>
                        <span>未設定</span>
                        <span>年</span>
                        <span>未設定</span>
                        <span>月</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                今までに経験した業種・職種
              </h4>
              <div className='space-y-6'>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    業種
                  </span>
                  <div className='flex flex-col gap-2 flex-1'>
                    {candidate.work_experience &&
                    candidate.work_experience.length > 0 ? (
                      candidate.work_experience.map((exp, index) => (
                        <span
                          key={`work-exp-${index}`}
                          className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                        >
                          {typeof exp.industry_name === 'object'
                            ? exp.industry_name.name ||
                              exp.industry_name.id ||
                              JSON.stringify(exp.industry_name)
                            : exp.industry_name}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-500'>未入力</span>
                    )}
                  </div>
                </div>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    職種
                  </span>
                  <div className='flex flex-col gap-2 flex-1'>
                    {candidate.job_type_experience &&
                    candidate.job_type_experience.length > 0 ? (
                      candidate.job_type_experience.map((exp, index) => (
                        <span
                          key={`job-type-exp-${index}`}
                          className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                        >
                          {typeof exp.job_type_name === 'object'
                            ? exp.job_type_name.name ||
                              exp.job_type_name.id ||
                              JSON.stringify(exp.job_type_name)
                            : exp.job_type_name}
                        </span>
                      ))
                    ) : (
                      <span className='text-gray-500'>未入力</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 資格・語学・スキル */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            資格・語学・スキル
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                語学
              </h4>
              <div className='space-y-4'>
                {/* 英語レベルは必ず表示 */}
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    英語レベル
                  </span>
                  <span className='text-gray-900 flex-1'>
                    {(() => {
                      const skill =
                        uniqueSkills.length > 0 ? uniqueSkills[0] : null;
                      const englishLevel = skill?.english_level;

                      if (englishLevel === 'none') return 'なし';
                      if (englishLevel === 'basic') return '日常会話レベル';
                      if (englishLevel === 'business') return 'ビジネスレベル';
                      if (englishLevel === 'native') return 'ネイティブレベル';
                      return '未設定';
                    })()}
                  </span>
                </div>

                {/* その他の言語はデータがある場合のみ表示 */}
                {(() => {
                  const allOtherLanguages: any[] = [];
                  uniqueSkills.forEach(skill => {
                    if (
                      skill.other_languages &&
                      Array.isArray(skill.other_languages)
                    ) {
                      allOtherLanguages.push(...skill.other_languages);
                    }
                  });

                  return allOtherLanguages.length > 0 ? (
                    <div className='flex gap-8'>
                      <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                        その他の言語
                      </span>
                      <div className='flex flex-col gap-2 flex-1'>
                        {allOtherLanguages.map((lang, langIndex) => (
                          <span
                            key={`lang-${langIndex}`}
                            className='text-gray-900'
                          >
                            {typeof lang === 'object'
                              ? `${lang.language || ''} ${lang.level || ''}`
                              : lang}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}
              </div>
            </div>
            <div>
              <h4 className='text-lg font-semibold text-gray-800 mb-4 pb-1 border-b-2 border-gray-200'>
                スキル
              </h4>
              <div className='space-y-6'>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    スキル
                  </span>
                  <div className='flex flex-col gap-2 flex-1'>
                    {uniqueSkills.length > 0 &&
                    uniqueSkills.some(
                      skill => skill.skills_list && skill.skills_list.length > 0
                    ) ? (
                      uniqueSkills.map((skill, skillIndex) =>
                        skill.skills_list && skill.skills_list.length > 0
                          ? skill.skills_list.map((skillName, index) => (
                              <span
                                key={`skill-${skillIndex}-${index}`}
                                className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                              >
                                {typeof skillName === 'object'
                                  ? skillName.name ||
                                    skillName.id ||
                                    JSON.stringify(skillName)
                                  : skillName}
                              </span>
                            ))
                          : null
                      )
                    ) : (
                      <span className='text-gray-500'>未入力</span>
                    )}
                  </div>
                </div>
                <div className='flex gap-8'>
                  <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                    保有資格
                  </span>
                  <div className='text-gray-900 flex-1'>
                    {uniqueSkills && uniqueSkills.length > 0
                      ? '入力された内容を表示入力された内容を表示入力された内容を表示入力された内容を表示入力された内容を表示入力された内容を表示入力された内容を表示入力された内容を表示'
                      : '未入力'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 希望条件 */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-gray-300'>
            希望条件
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                希望年収
              </span>
              <span className='text-gray-900 flex-1'>
                {candidate.desired_salary ||
                  (candidate.expectations && candidate.expectations.length > 0
                    ? candidate.expectations[0]?.desired_income
                    : '') ||
                  '選択された内容を表示'}
              </span>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                希望業種
              </span>
              <div className='flex flex-wrap gap-2 flex-1'>
                {candidate.desired_industries &&
                Array.isArray(candidate.desired_industries) &&
                candidate.desired_industries.length > 0 ? (
                  candidate.desired_industries.map((industry, index) => (
                    <span
                      key={`desired-industry-${index}`}
                      className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]"
                    >
                      {typeof industry === 'object'
                        ? industry.name ||
                          industry.id ||
                          JSON.stringify(industry)
                        : industry}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>未入力</span>
                )}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                希望職種
              </span>
              <div className='flex flex-wrap gap-2 flex-1'>
                {candidate.desired_job_types &&
                Array.isArray(candidate.desired_job_types) &&
                candidate.desired_job_types.length > 0 ? (
                  candidate.desired_job_types.map((jobType, index) => (
                    <span
                      key={`desired-job-type-${index}`}
                      className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]"
                    >
                      {typeof jobType === 'object'
                        ? jobType.name || jobType.id || JSON.stringify(jobType)
                        : jobType}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>未入力</span>
                )}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                希望勤務地
              </span>
              <div className='flex flex-wrap gap-2 flex-1'>
                {candidate.desired_locations &&
                Array.isArray(candidate.desired_locations) &&
                candidate.desired_locations.length > 0 ? (
                  candidate.desired_locations.map((location, index) => (
                    <span
                      key={`desired-location-${index}`}
                      className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px]"
                    >
                      {typeof location === 'object'
                        ? location.name ||
                          location.id ||
                          JSON.stringify(location)
                        : location}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>未入力</span>
                )}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                興味のある働き方
              </span>
              <div className='flex flex-col gap-2 flex-1'>
                {candidate.interested_work_styles &&
                Array.isArray(candidate.interested_work_styles) &&
                candidate.interested_work_styles.length > 0 ? (
                  candidate.interested_work_styles.map((workStyle, index) => (
                    <span
                      key={`work-style-${index}`}
                      className="inline-block px-3 py-1 rounded-[5px] bg-[#D2F1DA] text-[#0F9058] font-['Noto_Sans_JP'] text-[14px] font-bold leading-[1.6] tracking-[1.4px] w-fit"
                    >
                      {typeof workStyle === 'object'
                        ? workStyle.name ||
                          workStyle.id ||
                          JSON.stringify(workStyle)
                        : workStyle}
                    </span>
                  ))
                ) : (
                  <span className='text-gray-500'>未入力</span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 職務要約 */}
        <section className='mb-8'>
          <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
            職務要約
          </h3>
          <div className='px-4 py-4 space-y-6'>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                職務要約
              </span>
              <div className='text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg min-h-[100px] flex-1'>
                {candidate.job_summary || '職務要約が入力されていません。'}
              </div>
            </div>
            <div className='flex gap-8'>
              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                自己PR・その他
              </span>
              <div className='text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg min-h-[120px] flex-1'>
                {candidate.self_pr || '自己PR・その他が入力されていません。'}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
