'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import { SelectionResultModal } from '@/components/ui/selection-result-modal';
import { getCandidateDetailAction } from '@/lib/actions/candidate-detail';
import { getRoomIdAction } from '@/lib/actions/get-room-id';
import { updateSelectionProgressAction, getSelectionProgressAction } from '@/lib/actions/selection-progress';
import type { CandidateDetailData } from '@/lib/server/candidate/recruitment-queries';
import {
  saveCandidateAction,
  unsaveCandidateAction,
  getSavedCandidatesAction,
  toggleCandidateHiddenAction,
  getHiddenCandidatesAction,
} from '../../search/result/candidate-actions';

interface CandidateSlideMenuProps {
  isOpen: boolean;
  onClose: () => void;
  candidateId?: string;
  candidateData?: CandidateDetailData;
  companyGroupId?: string;
  jobOptions?: Array<{ value: string; label: string; groupId?: string }>;
  onJobChange?: (candidateId: string, jobId: string) => void;
}

// Icons
const CloseIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
  >
    <path
      d='M0.275556 0.27505C0.643031 -0.0924261 1.23902 -0.0922424 1.60661 0.27505L8.00016 6.6686L14.3927 0.276026C14.7603 -0.0915426 15.3562 -0.0915459 15.7238 0.276026C16.0913 0.643599 16.0913 1.23954 15.7238 1.60708L9.33122 7.99966L15.7248 14.3932L15.758 14.4284C16.0916 14.7979 16.0808 15.3683 15.7248 15.7243C15.3688 16.0802 14.7984 16.0911 14.4289 15.7575L14.3937 15.7243L8.00016 9.33071L1.60661 15.7252L1.57145 15.7584C1.2021 16.0922 0.631655 16.081 0.275556 15.7252C-0.0805049 15.3692 -0.0914255 14.7988 0.242352 14.4293L0.275556 14.3932L6.66911 7.99966L0.275556 1.6061C-0.0917292 1.23852 -0.091898 0.642527 0.275556 0.27505Z'
      fill='#999999'
    />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M8.87047 0.739544C8.70986 0.404924 8.37047 0.191406 7.99781 0.191406C7.62516 0.191406 7.28805 0.404924 7.12516 0.739544L5.17691 4.7764L0.825862 5.4226C0.462267 5.47751 0.159269 5.7337 0.0471598 6.0845C-0.0649493 6.43531 0.0259538 6.82265 0.286528 7.08197L3.44377 10.2268L2.69839 14.6709C2.63779 15.037 2.7893 15.4091 3.08926 15.6257C3.38922 15.8423 3.78615 15.8697 4.11339 15.6959L8.00085 13.6064L11.8883 15.6959C12.2156 15.8697 12.6125 15.8423 12.9125 15.6257C13.2124 15.4091 13.3539 15.037 13.2933 14.6709L12.5479 10.2268L15.7052 7.08197C15.9657 6.82265 16.0566 6.43531 15.9445 6.0845C15.8324 5.7337 15.5294 5.47751 15.1658 5.4226L10.8148 4.7764L8.87047 0.739544Z'
      fill={filled ? '#FFDA5F' : '#FFFFFF'}
    />
  </svg>
);

const EyeOffIcon = ({ hidden = false }: { hidden?: boolean }) => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M0.970123 1.71959C0.710129 1.51434 0.332634 1.5619 0.127386 1.82221C-0.0778628 2.08252 -0.0298589 2.46047 0.230136 2.66571L15.0299 14.2796C15.2898 14.4848 15.6673 14.4372 15.8724 14.1769C16.0776 13.9166 16.0298 13.5387 15.7698 13.3334L13.1399 11.2709C14.1299 10.2548 14.7999 9.11597 15.1373 8.30747C15.2199 8.10971 15.2199 7.88947 15.1373 7.69171C14.7649 6.79814 13.9824 5.49664 12.8124 4.41029C11.6374 3.31398 10.0199 2.39289 8 2.39289C6.29505 2.39289 4.8751 3.05117 3.76758 3.91491L0.970123 1.71959ZM5.57756 5.33389C6.21505 4.75069 7.0675 4.39527 8 4.39527C9.9875 4.39527 11.5999 6.00971 11.5999 7.99955C11.5999 8.62279 11.4425 9.20853 11.1649 9.71912L10.2 9.46323C10.41 8.99515 10.4649 8.42703 10.3199 7.87883C10.0425 6.84013 9.125 6.14177 8.105 6.09918C7.96 6.09421 7.875 6.2519 7.92 6.39205C7.9725 6.55236 8.0025 6.72239 8.0025 6.90015C8.0025 7.15537 7.9425 7.39579 7.8375 7.6085L5.58256 5.33886L5.57756 5.33389ZM9.325 11.3511C8.915 11.5137 8.4675 11.6041 8 11.6041C6.01255 11.6041 4.40006 9.98946 4.40006 7.99955C4.40006 7.8269 4.41256 7.65909 4.43506 7.49393L2.07761 5.63427C1.5076 6.37765 1.10012 7.11848 0.862625 7.69171C0.780125 7.88947 0.780125 8.10971 0.862625 8.30747C1.23512 9.20104 2.01761 10.5026 3.18759 11.5889C4.36256 12.6851 5.98005 13.6063 8 13.6063C9.195 13.6063 10.2475 13.3333 11.1549 12.7928L9.325 11.3511Z'
      fill={hidden ? '#999999' : '#DCDCDC'}
    />
  </svg>
);

const CareerChangeIcon = () => (
  <svg
    width='16'
    height='16'
    viewBox='0 0 16 16'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M3 8H13M13 8L10 5M13 8L10 11'
      stroke='white'
      strokeWidth='1.5'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export function CandidateSlideMenu({
  isOpen,
  onClose,
  candidateId,
  candidateData: propsCandidateData,
  companyGroupId,
  jobOptions = [],
  onJobChange,
}: CandidateSlideMenuProps) {
  console.log('[DEBUG] CandidateSlideMenu props:', { candidateId, companyGroupId, isOpen });
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'details' | 'progress'>('details');
  const [candidateData, setCandidateData] = useState<CandidateDetailData | null>(propsCandidateData || null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [secondaryDataLoading, setSecondaryDataLoading] = useState(false);
  const [isPickedUp, setIsPickedUp] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [selectedStage, setSelectedStage] = useState<string>('');
  const [selectionProgress, setSelectionProgress] = useState<any>(null);

  // 同じグループの求人のみをフィルタリング（CandidateCardと同じロジック）
  const filteredJobOptions = jobOptions.filter(job => 
    job.value === '' || // "すべて"オプションは常に表示
    job.groupId === companyGroupId // 同じグループの求人のみ
  );
  
  console.log('🔍 [CandidateSlideMenu] Job filtering debug:', {
    allJobOptions: jobOptions,
    filteredJobOptions,
    candidateGroupId: candidateData?.groupId,
    companyGroupId,
    candidateJobPostingId: candidateData?.jobPostingId,
    selectedOption: filteredJobOptions.find(job => job.value === candidateData?.jobPostingId)
  });

  // CandidateCardと同じselectionProgress取得ロジック
  useEffect(() => {
    if (candidateId && companyGroupId) {
      getSelectionProgressAction(candidateId, companyGroupId).then(result => {
        if (result.success) {
          setSelectionProgress(result.data);
        }
      });
    }
  }, [candidateId, companyGroupId]);

  // メッセージを確認ボタンのハンドラー
  const handleCheckMessage = async () => {
    if (!candidateId || !companyGroupId) {
      console.error('❌ [handleCheckMessage] Missing required parameters:', { candidateId, companyGroupId });
      return;
    }
    
    // 数値IDの場合は機能を無効化
    const isValidUUID = candidateId.length >= 30 && candidateId.includes('-');
    if (!isValidUUID) {
      alert('この機能はデモ候補者では利用できません。');
      return;
    }
    
    console.log('🔍 [handleCheckMessage] Starting message navigation:', { candidateId, companyGroupId });
    
    try {
      const roomId = await getRoomIdAction(candidateId, companyGroupId);
      console.log('🔍 [handleCheckMessage] getRoomIdAction result:', { roomId });
      
      if (roomId) {
        console.log('✅ [handleCheckMessage] Navigating to room:', `/company/message?room=${roomId}`);
        router.push(`/company/message?room=${roomId}`);
      } else {
        // roomが存在しない場合は、メッセージページに遷移（room指定なし）
        // メッセージページで新規メッセージ作成やroom一覧が表示される
        console.log('❌ [handleCheckMessage] Room not found, showing alert');
        alert('この候補者とのメッセージルームがまだ作成されていません。\nメッセージページから新規でメッセージを送信してください。');
        router.push('/company/message');
      }
    } catch (error) {
      console.error('❌ [handleCheckMessage] Error navigating to message room:', error);
      alert('メッセージルームへの遷移でエラーが発生しました。');
    }
  };

  // candidateIdが変更されたときにデータを取得し、状態をリセット
  useEffect(() => {
    if (candidateId && isOpen && companyGroupId) {
      // 状態をリセット
      setActiveTab('details');
      setCandidateData(null);
      setIsPickedUp(false);
      setIsHidden(false);
      setSelectionProgress(null);
      
      setDetailsLoading(true);
      setSecondaryDataLoading(true);
      setLoading(true);
      
      // candidateIdがUUID形式かチェック（36文字で、ハイフンを含む）
      const isValidUUID = candidateId.length >= 30 && candidateId.includes('-');
      
      if (!isValidUUID) {
        // 数値IDの場合はpropsで渡されたcandidateDataを使用し、APIは呼ばない
        console.log('🔍 [CandidateSlideMenu] Using props candidateData for numeric ID:', candidateId);
        setCandidateData(propsCandidateData);
        setDetailsLoading(false);
        setSecondaryDataLoading(false);
        setLoading(false);
        return;
      }
      
      // 第1段階: 最優先データ（候補者詳細）を先に取得・表示
      getCandidateDetailAction(candidateId, companyGroupId)
        .then((candidateDetail) => {
          console.log('🔍 [CandidateSlideMenu] Retrieved candidate detail:', candidateDetail);
          console.log('🔍 [CandidateSlideMenu] group:', candidateDetail?.group);
          console.log('🔍 [CandidateSlideMenu] jobPostingId:', candidateDetail?.jobPostingId);
          console.log('🔍 [CandidateSlideMenu] jobPostingTitle:', candidateDetail?.jobPostingTitle);
          console.log('🔍 [CandidateSlideMenu] assignedUsers:', candidateDetail?.assignedUsers);
          console.log('🔍 [CandidateSlideMenu] experience:', candidateDetail?.experience);
          console.log('🔍 [CandidateSlideMenu] industry:', candidateDetail?.industry);
          setCandidateData(candidateDetail);
        })
        .catch((error) => {
          console.error('候補者詳細データの取得に失敗:', error);
        })
        .finally(() => {
          setDetailsLoading(false);
        });

      // 第2段階: セカンダリデータを並列で取得（候補者詳細の表示を妨げない）
      Promise.all([
        getSavedCandidatesAction(companyGroupId),
        getHiddenCandidatesAction(companyGroupId),
        getSelectionProgressAction(candidateId, companyGroupId)
      ])
        .then(([savedResult, hiddenResult, progressResult]) => {
          // 保存状態（ピックアップ）の設定
          if (savedResult.success && savedResult.data) {
            setIsPickedUp(savedResult.data.includes(candidateId));
          }
          
          // 非表示状態の設定
          if (hiddenResult.success && hiddenResult.data) {
            setIsHidden(hiddenResult.data.includes(candidateId));
          }
          
          // 選考進捗の設定
          if (progressResult.success && progressResult.data) {
            setSelectionProgress(progressResult.data);
          } else {
            setSelectionProgress(null);
          }
        })
        .catch((error) => {
          console.error('セカンダリデータの取得に失敗:', error);
        })
        .finally(() => {
          setSecondaryDataLoading(false);
          setLoading(false);
        });
    }
  }, [candidateId, isOpen, companyGroupId]);

  // ESCキーでメニューを閉じる
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // スクロールを無効化
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // ピックアップ状態をトグルする関数
  const handlePickupToggle = async () => {
    console.log('[DEBUG] handlePickupToggle called', { candidateId, companyGroupId, isPickedUp });
    if (!candidateId || !companyGroupId) {
      console.log('[DEBUG] Missing candidateId or companyGroupId');
      return;
    }
    
    // 数値IDの場合は機能を無効化
    const isValidUUID = candidateId.length >= 30 && candidateId.includes('-');
    if (!isValidUUID) {
      alert('この機能はデモ候補者では利用できません。');
      return;
    }
    
    try {
      if (isPickedUp) {
        // 保存解除
        const result = await unsaveCandidateAction(candidateId, companyGroupId);
        if (result.success) {
          setIsPickedUp(false);
        } else {
          console.error('Error unsaving candidate:', result.error);
        }
      } else {
        // 保存
        const result = await saveCandidateAction(candidateId, companyGroupId);
        if (result.success) {
          setIsPickedUp(true);
        } else if (result.error === 'Candidate already saved') {
          // 既に保存済みの場合は状態を更新
          setIsPickedUp(true);
        } else {
          console.error('Error saving candidate:', result.error);
        }
      }
    } catch (error) {
      console.error('Error toggling pickup:', error);
    }
  };

  // 非表示状態をトグルする関数
  const handleHiddenToggle = async () => {
    console.log('[DEBUG] handleHiddenToggle called', { candidateId, companyGroupId, isHidden });
    if (!candidateId || !companyGroupId) {
      console.log('[DEBUG] Missing candidateId or companyGroupId');
      return;
    }
    
    // 数値IDの場合は機能を無効化
    const isValidUUID = candidateId.length >= 30 && candidateId.includes('-');
    if (!isValidUUID) {
      alert('この機能はデモ候補者では利用できません。');
      return;
    }
    
    try {
      const result = await toggleCandidateHiddenAction(candidateId, companyGroupId);
      if (result.success) {
        setIsHidden(result.isHidden ?? false);
      } else {
        console.error('Error toggling hidden status:', result.error);
      }
    } catch (error) {
      console.error('Error toggling hidden:', error);
    }
  };

  const handleScoutSend = () => {
    if (candidateId) {
      router.push(`/company/search/${candidateId}/scout`);
    }
  };

  // CandidateCardと同じモーダル処理
  const handleModalOpen = (stage: string) => {
    setSelectedStage(stage);
    setShowSelectionModal(true);
  };

  const handleModalClose = () => {
    setShowSelectionModal(false);
    setSelectedStage('');
  };

  // CandidateCardと全く同じhandlePass
  const handlePass = async () => {
    if (!candidateId || !companyGroupId || !selectedStage) return;

    const stageMapping: Record<string, any> = {
      '書類選考': 'document_screening',
      '一次面接': 'first_interview', 
      '二次以降': 'secondary_interview',
      '最終面接': 'final_interview',
      '内定': 'offer'
    };

    const result = await updateSelectionProgressAction({
      candidateId: candidateId,
      companyGroupId: companyGroupId,
      jobPostingId: candidateData?.jobPostingId || selectionProgress?.job_posting_id,
      stage: stageMapping[selectedStage],
      result: 'pass',
    });

    if (result.success) {
      setSelectionProgress(result.data);
    }
    handleModalClose();
  };

  // CandidateCardと全く同じhandleReject
  const handleReject = async () => {
    if (!candidateId || !companyGroupId || !selectedStage) return;

    const stageMapping: Record<string, any> = {
      '書類選考': 'document_screening',
      '一次面接': 'first_interview',
      '二次以降': 'secondary_interview', 
      '最終面接': 'final_interview',
      '内定': 'offer'
    };

    const result = await updateSelectionProgressAction({
      candidateId: candidateId,
      companyGroupId: companyGroupId,
      jobPostingId: candidateData?.jobPostingId || selectionProgress?.job_posting_id,
      stage: stageMapping[selectedStage],
      result: 'fail',
    });

    if (result.success) {
      setSelectionProgress(result.data);
    }
    handleModalClose();
  };

  // handleSelectionResult関数を追加
  const handleSelectionResult = (stage: string) => {
    setSelectedStage(stage);
    setShowSelectionModal(true);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 半透明のオーバーレイ */}
      <div
        className='fixed inset-0 bg-black/30 z-40 transition-opacity duration-300'
        onClick={onClose}
      />

      {/* スライドメニュー */}
      <div
        className={`fixed top-0 right-0 h-full w-[1000px] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* ヘッダーセクション */}
        <div className='bg-white px-10 py-6 border-b border-[#efefef] flex-shrink-0'>
          {/* 上部セクション */}
          <div className='flex justify-between mb-6'>
            {/* 左側：候補者情報 */}
            <div className='flex-1'>
              {/* 閉じるボタン */}
              <button
                onClick={onClose}
                className='mb-3 p-0 hover:opacity-70 transition-opacity'
              >
                <CloseIcon />
              </button>

              {/* バッジと日付情報を横並びに */}
              <div className='flex justify-between items-end mb-1'>
                {/* バッジ */}
                <div className='flex gap-1 flex-col'>
                  <div className='flex gap-1'>
                    {candidateData?.tags?.isHighlighted && (
                      <div className='bg-[#ff9d00] px-5 py-1 rounded-full flex items-center gap-2.5'>
                        <span
                          className='text-white text-[14px] font-bold tracking-[1.4px]'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          注目
                        </span>
                      </div>
                    )}
                    {candidateData?.tags?.isCareerChange && (
                      <div className='bg-[#44b0ef] px-5 py-1 rounded-[8px] flex items-center gap-2'>
                        <CareerChangeIcon />
                        <span
                          className='text-white text-[14px] font-bold tracking-[1.4px]'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          キャリアチェンジ志向
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    {/* 志向タグ */}
                    <div className='flex items-center gap-2 mb-2'>
                      {candidateData?.isAttention && (
                        <div className='bg-[#ff9d00] px-5 py-0 h-8 rounded-[100px] flex items-center justify-center'>
                          <span
                            className='text-white text-[12px] font-bold tracking-[1.2px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            注目
                          </span>
                        </div>
                      )}
                      {candidateData?.badgeType === 'change' && (
                        <div className='bg-[#44b0ef] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M2.97062 6.24841C3.22734 5.53293 3.64409 4.86011 4.23088 4.28575C6.31465 2.23448 9.69202 2.23448 11.7758 4.28575L12.3459 4.85026H11.2023C10.6122 4.85026 10.1354 5.3196 10.1354 5.90052C10.1354 6.48144 10.6122 6.95077 11.2023 6.95077H14.9198H14.9331C15.5232 6.95077 16 6.48144 16 5.90052V2.22464C16 1.64372 15.5232 1.17438 14.9331 1.17438C14.343 1.17438 13.8662 1.64372 13.8662 2.22464V3.37991L13.2828 2.80227C10.3655 -0.0695081 5.63784 -0.0695081 2.72057 2.80227C1.90706 3.60309 1.32028 4.54503 0.9602 5.55262C0.763492 6.10072 1.05689 6.69805 1.61034 6.89169C2.16378 7.08533 2.77391 6.79651 2.97062 6.25169V6.24841ZM0.766826 9.09394C0.600125 9.14317 0.440092 9.23178 0.310065 9.36307C0.176703 9.49435 0.0866848 9.65188 0.0400084 9.82255C0.0300063 9.86193 0.0200042 9.9046 0.0133361 9.94727C0.00333401 10.0031 0 10.0589 0 10.1147V13.7774C0 14.3583 0.476766 14.8277 1.06689 14.8277C1.65701 14.8277 2.13378 14.3583 2.13378 13.7774V12.6254L2.72057 13.1998C5.63784 16.0683 10.3655 16.0683 13.2794 13.1998C14.0929 12.3989 14.6831 11.457 15.0431 10.4494C15.2398 9.90132 14.9464 9.30399 14.393 9.11035C13.8396 8.91671 13.2294 9.20553 13.0327 9.75034C12.776 10.4658 12.3592 11.1386 11.7725 11.713C9.68869 13.7643 6.31132 13.7643 4.22755 11.713L4.22421 11.7097L3.65409 11.1518H4.801C5.39112 11.1518 5.86789 10.6824 5.86789 10.1015C5.86789 9.5206 5.39112 9.05127 4.801 9.05127H1.08023C1.02688 9.05127 0.973536 9.05455 0.920192 9.06112C0.866847 9.06768 0.816837 9.07753 0.766826 9.09394Z'
                              fill='white'
                            />
                          </svg>
                          <span
                            className='text-white text-[12px] font-bold tracking-[1.2px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidateData?.badgeText}
                          </span>
                        </div>
                      )}
                      {candidateData?.badgeType === 'professional' && (
                        <div className='bg-[#b687e8] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z'
                              fill='white'
                            />
                            <path
                              fillRule='evenodd'
                              clipRule='evenodd'
                              d='M0 8C0 3.58172 3.58172 0 8 0C12.4183 0 16 3.58172 16 8C16 12.4183 12.4183 16 8 16C3.58172 16 0 12.4183 0 8ZM8 1.33333C4.31803 1.33333 1.33333 4.31803 1.33333 8C1.33333 11.682 4.31803 14.6667 8 14.6667C11.682 14.6667 14.6667 11.682 14.6667 8C14.6667 4.31803 11.682 1.33333 8 1.33333Z'
                              fill='white'
                            />
                            <path d='M7.33333 2V4H8.66667V2H7.33333Z' fill='white' />
                            <path d='M7.33333 12V14H8.66667V12H7.33333Z' fill='white' />
                            <path d='M2 7.33333H4V8.66667H2V7.33333Z' fill='white' />
                            <path d='M12 7.33333H14V8.66667H12V7.33333Z' fill='white' />
                          </svg>
                          <span
                            className='text-white text-[12px] font-bold tracking-[1.2px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidateData?.badgeText}
                          </span>
                        </div>
                      )}
                      {candidateData?.badgeType === 'multiple' && (
                        <div className='bg-[#f182b4] px-5 py-0 h-8 rounded-[8px] flex items-center gap-2'>
                          <svg
                            width='16'
                            height='16'
                            viewBox='0 0 16 16'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M0 0V6H2V2.94118L5.52941 6.47059L6.47059 5.52941L2.94118 2H6V0H0Z'
                              fill='white'
                            />
                            <path
                              d='M10 0V2H13.0588L9.52941 5.52941L10.4706 6.47059L14 2.94118V6H16V0H10Z'
                              fill='white'
                            />
                            <path
                              d='M2 13.0588V10H0V16H6V14H2.94118L6.47059 10.4706L5.52941 9.52941L2 13.0588Z'
                              fill='white'
                            />
                            <path
                              d='M13.0588 14H10V16H16V10H14V13.0588L10.4706 9.52941L9.52941 10.4706L13.0588 14Z'
                              fill='white'
                            />
                          </svg>
                          <span
                            className='text-white text-[12px] font-bold tracking-[1.2px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {candidateData?.badgeText}
                          </span>
                        </div>
                      )}
                    </div>
                    
                    {/* 候補者名 */}
                    <h1
                      className='text-[#323232] text-[24px] font-bold tracking-[2.4px] mb-1'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {String(candidateData?.name || '候補者名（もしくはID）テキスト')}
                    </h1>

                    {/* 基本情報 */}
                    <p
                      className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {candidateData?.location || '地域未設定'}／
                      {candidateData?.age && candidateData.age > 0 ? `${candidateData.age}歳` : '○○歳'}
                      ／{candidateData?.gender || '性別未設定'}／
                      {candidateData?.income || '未設定'}
                    </p>
                  </div>
                </div>

                {/* 日付情報 */}
                <div className='flex flex-col items-end gap-1 w-[208px]'>
                  <p
                    className='text-[#999999] text-[14px] font-bold tracking-[1.4px] text-right w-full'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終ログイン：{String(candidateData?.lastLogin || 'yyyy/mm/dd')}
                  </p>
                  <p
                    className='text-[#999999] text-[14px] font-bold tracking-[1.4px] text-right'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    最終更新：{String(candidateData?.lastUpdate || 'yyyy/mm/dd')}
                  </p>
                  <p
                    className='text-[#999999] text-[14px] font-bold tracking-[1.4px] text-right'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    登録：{String(candidateData?.registrationDate || 'yyyy/mm/dd')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ボタンセクション */}
          <div className='flex justify-between items-center mb-6'>
            {/* スカウト送信ボタン */}
            <Button
              onClick={handleScoutSend}
              variant='blue-gradient'
              size='figma-default'
              className='min-w-[160px] bg-[linear-gradient(263.02deg,#26AF94_0%,#3A93CB_100%)] hover:bg-[linear-gradient(263.02deg,#1F8A76_0%,#2E75A3_100%)]'
            >
              <span
                className='text-[16px] font-bold tracking-[1.6px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                スカウト送信
              </span>
            </Button>

            {/* 右側のボタン群 */}
            <div className='flex gap-4'>
              {secondaryDataLoading ? (
                <div className='flex gap-4'>
                  {/* ピックアップボタン（ローディング状態） */}
                  <div className='px-10 py-3.5 rounded-[32px] flex items-center gap-2.5 min-w-[160px] bg-[#DCDCDC] opacity-70'>
                    <div className='animate-pulse w-4 h-4 bg-white rounded'></div>
                    <span
                      className='text-white text-[16px] font-bold tracking-[1.6px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      ピックアップ
                    </span>
                  </div>

                  {/* 非表示ボタン（ローディング状態） */}
                  <div className='border border-[#DCDCDC] px-10 py-3.5 rounded-[32px] flex items-center gap-2.5 min-w-[160px] opacity-70'>
                    <div className='animate-pulse w-4 h-4 bg-[#DCDCDC] rounded'></div>
                    <span
                      className='text-[#DCDCDC] text-[16px] font-bold tracking-[1.6px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      非表示
                    </span>
                  </div>
                </div>
              ) : (
                <>
                  {/* ピックアップボタン */}
                  <button 
                    onClick={handlePickupToggle}
                    className={`px-10 py-3.5 rounded-[32px] flex items-center gap-2.5 min-w-[160px] transition-colors ${
                      isPickedUp 
                        ? 'bg-[#FFDA5F] hover:bg-[#FFD040]' 
                        : 'bg-[#DCDCDC] hover:bg-[#C5C5C5]'
                    }`}
                  >
                    <StarIcon filled={isPickedUp} />
                    <span
                      className='text-white text-[16px] font-bold tracking-[1.6px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      ピックアップ
                    </span>
                  </button>

                  {/* 非表示ボタン */}
                  <button 
                    onClick={handleHiddenToggle}
                    className={`border px-10 py-3.5 rounded-[32px] flex items-center gap-2.5 min-w-[160px] transition-colors ${
                      isHidden 
                        ? 'border-[#999999] bg-gray-50 hover:bg-gray-100' 
                        : 'border-[#DCDCDC] hover:bg-gray-50'
                    }`}
                  >
                    <EyeOffIcon hidden={isHidden} />
                    <span
                      className={`text-[16px] font-bold tracking-[1.6px] ${
                        isHidden ? 'text-[#999999]' : 'text-[#DCDCDC]'
                      }`}
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      非表示
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* タブセクション */}
          <div className='-mx-10'>
            <div className='flex mx-10'>
              <button
                onClick={() => setActiveTab('details')}
                className={`flex-1 h-10 px-4 py-1 text-[16px] font-bold leading-[200%] tracking-[0.1em] border border-[#efefef] transition-colors ${
                  activeTab === 'details'
                    ? 'bg-[#d2f1da] text-[#0f9058]'
                    : 'bg-white text-[#999999] hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                詳細情報
              </button>
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex-1 h-10 px-4 py-1 text-[16px] font-bold leading-[200%] tracking-[0.1em] border border-[#efefef] transition-colors ${
                  activeTab === 'progress'
                    ? 'bg-[#d2f1da] text-[#0f9058]'
                    : 'bg-white text-[#999999] hover:bg-gray-50'
                }`}
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                進捗・メモ
              </button>
            </div>
          </div>
        </div>

        {/* コンテンツエリア */}
        <div className='flex-1 overflow-y-auto'>
          <div className='px-10 py-6'>
            {detailsLoading ? (
              <div className='flex items-center justify-center py-20'>
                <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f9058]'></div>
              </div>
            ) : activeTab === 'details' ? (
              <div className='space-y-10'>
                {/* 職務要約セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      職務要約
                    </h2>
                  </div>

                  {/* 職務要約本文 */}
                  <p
                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {candidateData?.jobSummary ||
                      '職務要約未登録'}
                  </p>
                </div>

                {/* 経験セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      経験
                    </h2>
                  </div>

                  {/* 経験コンテンツ（2カラム） */}
                  <div className='flex gap-10'>
                    {/* 経験職種 */}
                    <div className='flex-1 flex gap-6'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] whitespace-nowrap'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        経験職種
                      </div>
                      <div className='flex-1 flex flex-col gap-2'>
                        <ul className='list-disc ml-6 space-y-0'>
                          {Array.isArray(candidateData?.experience) &&
                          candidateData.experience.length > 0 ? (
                            candidateData.experience.map((job, index) => (
                              <li
                                key={index}
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {job}
                              </li>
                            ))
                          ) : (
                            <li
                              className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              設定なし
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    {/* 経験業種 */}
                    <div className='flex-1 flex gap-6'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] whitespace-nowrap'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        経験業種
                      </div>
                      <div className='flex-1 flex flex-col gap-2'>
                        <ul className='list-disc ml-6 space-y-0'>
                          {Array.isArray(candidateData?.industry) &&
                          candidateData.industry.length > 0 ? (
                            candidateData.industry.map(
                              (industry, index) => (
                                <li
                                  key={index}
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {industry}
                                </li>
                              )
                            )
                          ) : (
                            <li
                              className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              設定なし
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 職務経歴セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      職務経歴
                    </h2>
                  </div>

                  {/* 職務経歴リスト */}
                  <div className='flex flex-col gap-4'>
                    {Array.isArray(candidateData?.workHistory) &&
                    candidateData.workHistory.length > 0 ? (
                      candidateData.workHistory.map((work, index) => (
                        <div
                          key={index}
                          className='bg-[#f9f9f9] rounded-[10px] p-6 flex flex-col gap-2'
                        >
                          {/* 企業名と期間 */}
                          <div className='flex justify-between items-center'>
                            <h3
                              className='text-[#0f9058] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.companyName || '')}
                            </h3>
                            <span
                              className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.period || '')}
                            </span>
                          </div>

                          {/* 業種タグ */}
                          <div className='flex gap-1 flex-wrap'>
                            {work.industries.map((industry, idx) => (
                              <span
                                key={idx}
                                className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {String(industry || '')}
                              </span>
                            ))}
                          </div>

                          {/* 部署・役職と職種 */}
                          <div className='flex items-center gap-2 flex-wrap'>
                            <span
                              className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.department || '')}・{String(work.position || '')}
                            </span>
                            <div className='w-px h-7 bg-[#dcdcdc]' />
                            <span
                              className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(work.jobType || '')}
                            </span>
                          </div>

                          {/* 区切り線 */}
                          <hr className='border-t border-[#dcdcdc] my-2' />

                          {/* 業務内容 */}
                          <p
                            className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-pre-wrap'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(work.description || '')}
                          </p>
                        </div>
                      ))
                    ) : (
                      /* プレースホルダー */
                      <div className='bg-[#f9f9f9] rounded-[10px] p-6 flex flex-col gap-2'>
                            <div className='flex justify-between items-center'>
                              <h3
                                className='text-[#0f9058] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                企業名未登録
                              </h3>
                              <span
                                className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                期間未登録
                              </span>
                            </div>
                            <div className='flex gap-1'>
                              <span
                                className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                業種未登録
                              </span>
                            </div>
                            <div className='flex items-center gap-2'>
                              <span
                                className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                部署・役職名未登録
                              </span>
                              <div className='w-px h-7 bg-[#dcdcdc]' />
                              <span
                                className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                職種未登録
                              </span>
                            </div>
                            <hr className='border-t border-[#dcdcdc]' />
                            <p
                              className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              業務内容未登録
                            </p>
                          </div>
                    )}
                  </div>
                </div>

                {/* 希望条件セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      希望条件
                    </h2>
                  </div>

                  {/* 希望条件コンテンツ */}
                  <div className='flex flex-col gap-4'>
                    {/* 希望年収 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望年収
                      </div>
                      <div
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.desiredConditions?.annualIncome 
                          ? `${candidateData.desiredConditions.annualIncome}${!candidateData.desiredConditions.annualIncome.includes('万円') ? '万円' : ''}`
                          : '未設定'
                        }
                        （直近年収：
                        {candidateData?.desiredConditions?.currentIncome 
                          ? `${candidateData.desiredConditions.currentIncome}${!candidateData.desiredConditions.currentIncome.includes('万円') ? '万円' : ''}`
                          : '未設定'
                        }）
                      </div>
                    </div>

                    {/* 希望職種・希望業種（2カラム） */}
                    <div className='flex gap-10'>
                      {/* 希望職種 */}
                      <div className='flex-1 flex gap-6'>
                        <div
                          className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          希望職種
                        </div>
                        <div className='flex-1'>
                          <ul className='list-disc ml-6 space-y-0'>
                            {Array.isArray(candidateData?.desiredConditions?.jobTypes) &&
                            candidateData.desiredConditions.jobTypes.length >
                              0 ? (
                              candidateData.desiredConditions.jobTypes.map(
                                (jobType, index) => (
                                  <li
                                    key={index}
                                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {(() => {
                                      try {
                                        if (jobType !== null && jobType !== undefined && typeof jobType === 'object' && jobType && 'name' in jobType) {
                                          return (jobType as any).name;
                                        }
                                        return String(jobType || '');
                                      } catch {
                                        return String(jobType || '');
                                      }
                                    })()}
                                  </li>
                                )
                              )
                            ) : (
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                設定なし
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>

                      {/* 希望業種 */}
                      <div className='flex-1 flex gap-6'>
                        <div
                          className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] whitespace-nowrap'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          希望業種
                        </div>
                        <div className='flex-1'>
                          <ul className='list-disc ml-6 space-y-0'>
                            {Array.isArray(candidateData?.desiredConditions?.industries) &&
                            candidateData.desiredConditions.industries.length >
                              0 ? (
                              candidateData.desiredConditions.industries.map(
                                (industry, index) => (
                                  <li
                                    key={index}
                                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                    style={{
                                      fontFamily: 'Noto Sans JP, sans-serif',
                                    }}
                                  >
                                    {(() => {
                                      try {
                                        if (industry !== null && industry !== undefined && typeof industry === 'object' && industry && 'name' in industry) {
                                          return (industry as any).name;
                                        }
                                        return String(industry || '');
                                      } catch {
                                        return String(industry || '');
                                      }
                                    })()}
                                  </li>
                                )
                              )
                            ) : (
                              <li
                                className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                設定なし
                              </li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* 希望勤務地 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        希望勤務地
                      </div>
                      <div
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.desiredConditions?.workLocations && 
                         candidateData.desiredConditions.workLocations.length > 0
                          ? candidateData.desiredConditions.workLocations.join(
                              '、'
                            )
                          : '未設定'}
                      </div>
                    </div>

                    {/* 転職希望時期 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        転職希望時期
                      </div>
                      <div
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.desiredConditions?.jobChangeTiming ||
                          '3か月以内に'}
                      </div>
                    </div>

                    {/* 興味のある働き方 */}
                    <div className='flex gap-6'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.4px] leading-[2] text-right w-[140px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        興味のある働き方
                      </div>
                      <div className='flex-1'>
                        <ul className='list-disc ml-6 space-y-0'>
                          {Array.isArray(candidateData?.desiredConditions?.workStyles) &&
                          candidateData.desiredConditions.workStyles.length >
                            0 ? (
                            candidateData.desiredConditions.workStyles.map(
                              (style, index) => (
                                <li
                                  key={index}
                                  className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                                  style={{
                                    fontFamily: 'Noto Sans JP, sans-serif',
                                  }}
                                >
                                  {String(style || '')}
                                </li>
                              )
                            )
                          ) : (
                            <li
                              className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                              style={{
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              働き方未登録
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 選考状況セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      選考状況
                    </h2>
                  </div>

                  {/* 選考状況リスト */}
                  <div className='flex flex-col gap-6'>
                          {Array.isArray(candidateData?.selectionStatus) &&
                    candidateData.selectionStatus.length > 0 ? (
                      candidateData.selectionStatus.map((selection, index) => (
                        <div key={index} className='flex gap-4 items-start'>
                          {/* 企業名 */}
                          <a
                            href='#'
                            className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px] leading-[1.6] underline w-[200px] truncate'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(selection.companyName || '')}
                          </a>

                          {/* 業種タグ */}
                          <div className='flex flex-wrap gap-2 items-center w-[200px]'>
                            {selection.industries.map((industry, idx) => (
                              <span
                                key={idx}
                                className='bg-[#d2f1da] text-[#0f9058] px-2 py-0.5 rounded-[5px] text-[14px] font-medium tracking-[1.4px] leading-[1.6]'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                {String(industry || '')}
                              </span>
                            ))}
                          </div>

                          {/* 職種 */}
                          <span
                            className='text-[#323232] text-[14px] font-medium tracking-[1.4px] leading-[1.6] w-[200px]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(selection.jobTypes || '')}
                          </span>

                          {/* ステータスバッジ */}
                          <span
                            className={`px-2 py-0.5 rounded-[5px] text-[14px] font-medium tracking-[1.4px] leading-[1.6] text-white whitespace-nowrap ${
                              selection.statusType === 'decline'
                                ? 'bg-[#999999]'
                                : 'bg-[#0f9058]'
                            }`}
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(selection.status || '')}
                          </span>

                          {/* 辞退理由（辞退の場合のみ） */}
                          {selection.statusType === 'decline' &&
                            selection.declineReason && (
                              <span
                                className='text-[#323232] text-[10px] font-medium tracking-[1px] leading-[1.6] flex-1'
                                style={{
                                  fontFamily: 'Noto Sans JP, sans-serif',
                                }}
                              >
                                辞退理由：{String(selection.declineReason || '')}
                              </span>
                            )}
                        </div>
                      ))
                    ) : (
                      <div className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                        未設定
                      </div>
                    )}
                  </div>
                </div>

                {/* 自己PR・その他セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      自己PR・その他
                    </h2>
                  </div>

                  {/* 自己PR・その他本文 */}
                  <p
                    className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {candidateData?.selfPR ||
                      '未設定'}
                  </p>
                </div>

                {/* 資格・スキル・語学セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      資格・スキル・語学
                    </h2>
                  </div>

                  {/* 資格・スキル・語学コンテンツ */}
                  <div className='flex flex-col gap-4'>
                    {/* 保有資格 */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right whitespace-nowrap flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        保有資格
                      </div>
                      <p
                        className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] flex-1'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {candidateData?.qualifications ||
                          '未設定'}
                      </p>
                    </div>

                    {/* スキル */}
                    <div className='flex gap-10'>
                      <div
                        className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[69px] flex-shrink-0'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        スキル
                      </div>
                      <div className='flex flex-wrap gap-2 items-center flex-1'>
                        {Array.isArray(candidateData?.skills) &&
                        candidateData.skills.length > 0 ? (
                          candidateData.skills.map((skill, index) => (
                            <span
                              key={index}
                              className='bg-[#d2f1da] text-[#0f9058] px-4 py-0 rounded-[8px] text-[14px] font-medium tracking-[1.4px] leading-[2]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {String(skill || '')}
                            </span>
                          ))
                        ) : (
                          <span
                            className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            未設定
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 語学 */}
                    <div className='flex gap-10'>
                      <div className='flex gap-6 flex-1'>
                        <div
                          className='text-[#999999] text-[16px] font-bold tracking-[1.6px] leading-[2] text-right w-[69px] flex-shrink-0'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          語学
                        </div>
                        <div className='flex-1'>
                          <ul className='list-disc ml-6 space-y-0'>
                            <li className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2] list-none'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
                              未設定
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 学歴セクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      学歴
                    </h2>
                  </div>

                  {/* 学歴コンテンツ */}
                  <div className='flex flex-col gap-2'>
                    {Array.isArray(candidateData?.education) &&
                    candidateData.education.length > 0 ? (
                      candidateData.education.map((edu, index) => (
                        <div key={index} className='flex gap-4 items-start'>
                          <span
                            className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(edu.schoolName || '')}／{String(edu.department || '')}
                          </span>
                          <span
                            className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          >
                            {String(edu.graduationDate || '')}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className='flex gap-4 items-start'>
                        <span
                          className='text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          学校名・学部名未登録
                        </span>
                        <span
                          className='text-[#999999] text-[16px] font-medium tracking-[1.6px] leading-[2] whitespace-nowrap'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          yyyy年mm月 卒業
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className='space-y-8'>
                {secondaryDataLoading ? (
                  <div className='flex items-center justify-center py-20'>
                    <div className='flex flex-col items-center gap-3'>
                      <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f9058]'></div>
                      <span className='text-[#999999] text-[14px]'>選考進捗を読み込み中...</span>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 候補者の進捗状況セクション */}
                    <div className='flex flex-col gap-4'>
                      {/* セクションタイトル */}
                      <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                        <h2
                          className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          候補者の進捗状況
                        </h2>
                      </div>

                  {candidateData ? (
                      <div className='flex flex-col gap-4'>
                        {/* Group and Job - CandidateCardと完全に同じ構造 */}
                        <div className='flex flex-col sm:flex-row gap-[18px] items-stretch sm:items-center w-full h-auto sm:h-[38px]'>
                          <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-full sm:w-[240px] h-[38px] flex items-center justify-center flex-shrink-0'>
                            <span
                              className='text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] text-center w-full sm:w-[200px] h-[22px] truncate'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {selectionProgress?.group_name || candidateData.group}
                            </span>
                          </div>
                          <div
                            className='flex-1 flex gap-4 items-center w-full sm:w-[602px] h-[38px]'
                            onClick={e => e.stopPropagation()}
                          >
                            <SelectInput
                              options={filteredJobOptions}
                              value={selectionProgress?.job_posting_id || candidateData.jobPostingId}
                              onChange={(value) => onJobChange && onJobChange(candidateData.id, value)}
                              placeholder="求人を選択"
                              className="w-full h-[38px]"
                            />
                          </div>
                        </div>

                        {/* 進捗ステップ */}
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2'>
                            {/* 応募 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                応募
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              <div className='text-[#323232] text-[10px] font-bold tracking-[1px]'>
                                yyyy/mm/dd
                              </div>
                            </div>

                            {/* 書類選考 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                書類選考
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              {(() => {
                                const progress = selectionProgress;
                                if (progress?.document_screening_result === 'pass') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      通過
                                    </div>
                                  );
                                } else if (progress?.document_screening_result === 'fail') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      見送り
                                    </div>
                                  );
                                }
                                // 書類選考段階で合否登録ボタンを表示
                                if (true) {
                                  return (
                                    <button
                                      className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                                      style={{
                                        background:
                                          'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                        fontFamily: 'Noto Sans JP, sans-serif',
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleModalOpen('書類選考');
                                      }}
                                    >
                                      合否登録
                                    </button>
                                  );
                                } else {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      -
                                    </div>
                                  );
                                }
                              })()}
                            </div>

                            {/* 一次面接 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                一次面接
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              {(() => {
                                const progress = selectionProgress;
                                // 書類選考で見送りになった場合は何も表示しない
                                if (progress?.document_screening_result === 'fail') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      -
                                    </div>
                                  );
                                }
                                // 書類選考が通過している場合のみ一次面接の判定を表示
                                if (progress?.document_screening_result === 'pass') {
                                  if (progress?.first_interview_result === 'pass') {
                                    return (
                                      <div className='text-[#0f9058] text-[14px] font-bold h-[35px] flex items-center'>
                                        通過
                                      </div>
                                    );
                                  } else if (progress?.first_interview_result === 'fail') {
                                    return (
                                      <div className='text-[#ff5b5b] text-[14px] font-bold h-[35px] flex items-center'>
                                        見送り
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <button
                                        onClick={() => handleSelectionResult('一次面接')}
                                        className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                                        style={{
                                          background:
                                            'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                          fontFamily: 'Noto Sans JP, sans-serif',
                                        }}
                                      >
                                        合否登録
                                      </button>
                                    );
                                  }
                                }
                                return (
                                  <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                    -
                                  </div>
                                );
                              })()}
                            </div>

                            {/* 二次以降 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                二次以降
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              {(() => {
                                const progress = selectionProgress;
                                if (progress?.secondary_interview_result === 'pass') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      通過
                                    </div>
                                  );
                                } else if (progress?.secondary_interview_result === 'fail') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      見送り
                                    </div>
                                  );
                                }
                                // 一次面接を通過している場合のみ合否登録ボタンを表示
                                if (progress?.first_interview_result === 'pass') {
                                  return (
                                    <button
                                      onClick={() => handleSelectionResult('二次以降')}
                                      className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                                      style={{
                                        background:
                                          'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                        fontFamily: 'Noto Sans JP, sans-serif',
                                      }}
                                    >
                                      合否登録
                                    </button>
                                  );
                                } else {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      -
                                    </div>
                                  );
                                }
                              })()}
                            </div>

                            {/* 最終面接 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                最終面接
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              {(() => {
                                const progress = selectionProgress;
                                if (progress?.final_interview_result === 'pass') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      通過
                                    </div>
                                  );
                                } else if (progress?.final_interview_result === 'fail') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      見送り
                                    </div>
                                  );
                                }
                                // 二次面接を通過している場合のみ合否登録ボタンを表示
                                if (progress?.secondary_interview_result === 'pass') {
                                  return (
                                    <button
                                      onClick={() => handleSelectionResult('最終面接')}
                                      className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                                      style={{
                                        background:
                                          'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                        fontFamily: 'Noto Sans JP, sans-serif',
                                      }}
                                    >
                                      合否登録
                                    </button>
                                  );
                                } else {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      -
                                    </div>
                                  );
                                }
                              })()}
                            </div>

                            {/* 内定 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                内定
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              {(() => {
                                const progress = selectionProgress;
                                if (progress?.offer_result === 'accepted') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      通過
                                    </div>
                                  );
                                } else if (progress?.offer_result === 'declined') {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      見送り
                                    </div>
                                  );
                                }
                                // 最終面接を通過している場合のみ合否登録ボタンを表示
                                if (progress?.final_interview_result === 'pass') {
                                  return (
                                    <button
                                      onClick={() => handleSelectionResult('内定')}
                                      className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                                      style={{
                                        background:
                                          'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                        fontFamily: 'Noto Sans JP, sans-serif',
                                      }}
                                    >
                                      合否登録
                                    </button>
                                  );
                                } else {
                                  return (
                                    <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                      -
                                    </div>
                                  );
                                }
                              })()}
                            </div>

                            {/* 入社 */}
                            <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                              <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                                入社
                              </div>
                              <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                              <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                                -
                              </div>
                            </div>
                          </div>

                        {/* 担当者情報 */}
                        <div className='h-[66px] flex items-center justify-between gap-10'>
                          <p className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                            やりとりしている担当者：{candidateData?.assignedUsers && candidateData.assignedUsers.length > 0 
                              ? candidateData.assignedUsers.join('、') 
                              : '設定なし'}
                          </p>
                          <button 
                            className='border border-[#0f9058] rounded-[32px] px-6 py-2.5 min-w-[120px] hover:bg-gray-50 transition-colors'
                            onClick={handleCheckMessage}
                          >
                            <span
                              className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              メッセージを確認
                            </span>
                          </button>
                        </div>
                      </div>
                  ) : (
                      <div className='flex flex-col gap-4'>
                        {/* グループ名と求人選択 */}
                        <div className='flex flex-col sm:flex-row gap-[18px] items-stretch sm:items-center w-full h-auto sm:h-[38px]'>
                          <div className='bg-gradient-to-l from-[#86c36a] to-[#65bdac] rounded-[8px] px-5 py-0 w-full sm:w-[240px] h-[38px] flex items-center justify-center flex-shrink-0'>
                            <span
                              className='text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] text-center w-full sm:w-[200px] h-[22px] truncate'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              {selectionProgress?.group_name || 'グループ未設定'}
                            </span>
                          </div>
                          <div
                            className='flex-1 flex gap-4 items-center w-full sm:w-[602px] h-[38px]'
                            onClick={e => e.stopPropagation()}
                          >
                            <SelectInput
                              options={filteredJobOptions}
                              value={selectionProgress?.job_posting_id || ''}
                              onChange={(value) => onJobChange && onJobChange(candidateId!, value)}
                              placeholder="求人を選択"
                              className="w-full h-[38px]"
                            />
                          </div>
                        </div>

                        {/* 進捗ステップ */}
                        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2'>
                          {/* 応募 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              応募
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <div className='text-[#323232] text-[10px] font-bold tracking-[1px]'>
                              yyyy/mm/dd
                            </div>
                          </div>

                          {/* 書類選考 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              書類選考
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <button
                              onClick={() => handleSelectionResult('書類選考')}
                              className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                              style={{
                                background:
                                  'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              合否登録
                            </button>
                          </div>

                          {/* 一次面接 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              一次面接
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <button
                              className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                              style={{
                                background:
                                  'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              合否登録
                            </button>
                          </div>

                          {/* 二次以降 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              二次以降
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <button
                              className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                              style={{
                                background:
                                  'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              合否登録
                            </button>
                          </div>

                          {/* 最終面接 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              最終面接
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <button
                              className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                              style={{
                                background:
                                  'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              合否登録
                            </button>
                          </div>

                          {/* 内定 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              内定
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <button
                              className='w-[84px] h-[38px] bg-gradient-to-r from-[#26AF94] to-[#3A93CB] rounded-[32px] flex items-center justify-center text-white text-[14px] font-bold leading-[160%] tracking-[1.4px] transition-all duration-200 ease-in-out hover:opacity-90'
                              style={{
                                background:
                                  'linear-gradient(263.02deg, #26AF94 0%, #3A93CB 100%)',
                                fontFamily: 'Noto Sans JP, sans-serif',
                              }}
                            >
                              合否登録
                            </button>
                          </div>

                          {/* 入社 */}
                          <div className='bg-[#f9f9f9] rounded-[5px] p-4 flex flex-col gap-4 items-center'>
                            <div className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'>
                              入社
                            </div>
                            <div className='w-full h-[1px] bg-[#dcdcdc]'></div>
                            <div className='text-[#323232] text-[14px] font-bold h-[35px] flex items-center'>
                              -
                            </div>
                          </div>
                        </div>

                        {/* 担当者情報 */}
                        <div className='h-[66px] flex items-center justify-between gap-10'>
                          <p className='text-[#323232] text-[14px] font-bold tracking-[1.4px]'>
                            やりとりしている担当者：設定なし
                          </p>
                          <button 
                            className='border border-[#0f9058] rounded-[32px] px-6 py-2.5 min-w-[120px] hover:bg-gray-50 transition-colors'
                            onClick={handleCheckMessage}
                          >
                            <span
                              className='text-[#0f9058] text-[14px] font-bold tracking-[1.4px]'
                              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                            >
                              メッセージを確認
                            </span>
                          </button>
                        </div>
                      </div>
                    )}
                </div>

                {/* 社内メモセクション */}
                <div className='flex flex-col gap-4'>
                  {/* セクションタイトル */}
                  <div className='flex gap-3 items-center pb-2 border-b-2 border-[#dcdcdc] relative'>
                    <h2
                      className='text-[#323232] text-[20px] font-bold tracking-[2px] leading-[1.6]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      社内メモ
                    </h2>
                  </div>

                  {/* 社内メモコンテンツ */}
                  <div className='w-full border border-[#dcdcdc] rounded-[5px]'>
                  <textarea
                    className='w-full h-32 p-3 border border-[#dcdcdc] rounded-[5px] resize-none text-[#323232] text-[16px] font-medium tracking-[1.6px] leading-[2]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    placeholder='社内メモを入力してください...'
                  />
                  </div>
                  <p className='text-[#999999] text-[14px] font-medium tracking-[1.4px]'>
                    社内メモは候補者に共有されません。
                  </p>
                </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>

        {/* フッターセクション（ボタンエリア） */}
        <div className='bg-white px-10 py-6 border-t border-[#efefef] flex-shrink-0'>
          <div className='flex justify-center'>
            <Button
              variant='blue-gradient'
              size='figma-default'
              className='min-w-[160px] bg-[linear-gradient(263.02deg,#26AF94_0%,#3A93CB_100%)] hover:bg-[linear-gradient(263.02deg,#1F8A76_0%,#2E75A3_100%)] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]'
              onClick={handleScoutSend}
            >
              <span
                className='text-[16px] font-bold tracking-[1.6px]'
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                スカウト送信
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* 合否登録モーダル */}
      <SelectionResultModal
        isOpen={showSelectionModal}
        onClose={handleModalClose}
        candidateName={candidateData?.name || '候補者テキスト'}
        selectionStage={selectedStage}
        onPass={handlePass}
        onReject={handleReject}
      />
    </>
  );
}
