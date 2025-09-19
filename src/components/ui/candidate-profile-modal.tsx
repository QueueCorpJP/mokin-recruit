import React, { useState, useEffect } from 'react';
import { Modal } from './mo-dal';
import Link from 'next/link';
import Image from 'next/image';
import { X } from 'lucide-react';
import styles from './candidate-profile-modal.module.css';

interface CandidateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * 候補者プロフィール確認・編集用モーダル
 * 今後、プロフィール編集フォーム等をここに追加・拡張することを想定
 */
export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  if (!isOpen) return null;

  // モバイル用の独自レンダリング
  if (isMobile) {
    return (
      <div
        className='fixed inset-0 z-50'
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        onClick={onClose}
      >
        <div className='fixed inset-0 flex items-center justify-center p-4'>
          <div
            className='bg-white shadow-lg w-full max-w-[95vw] rounded-[10px] flex flex-col'
            style={{ maxHeight: 'calc(85vh)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header - 固定 */}
            <header className='flex w-full items-center justify-between gap-4 px-4 py-4 bg-white border-b border-[#E5E7EB]'>
              <h2 className="text-[#323232] text-lg tracking-[0.05em] leading-[1.6] font-bold font-['Noto_Sans_JP'] truncate">
                プロフィール確認・編集
              </h2>
              <button
                className='flex w-8 h-8 items-center justify-center hover:bg-gray-100 rounded transition-colors flex-shrink-0'
                onClick={onClose}
              >
                <X className='w-5 h-5 text-gray-400 hover:text-gray-600' />
              </button>
            </header>

            {/* Main content - スクロール可能領域 */}
            <div
              className='overflow-y-auto bg-[#F9F9F9]'
              style={{ flex: '1 1 auto' }}
            >
              <div className='p-4 w-full'>
                <div className={styles.profileGrid}>
                  {[
                    [
                      { text: '基本情報', path: '/candidate/account/profile' },
                      {
                        text: '転職活動状況',
                        path: '/candidate/account/career-status',
                      },
                    ],
                    [
                      {
                        text: '希望条件',
                        path: '/candidate/account/expectation',
                      },
                      {
                        text: '履歴書・職務経歴書',
                        path: '/candidate/account/resume',
                      },
                    ],
                    [
                      { text: '職務要約', path: '/candidate/account/summary' },
                      {
                        text: '職務経歴',
                        path: '/candidate/account/recent-job',
                      },
                    ],
                    [
                      {
                        text: '学歴・経験業種/職種',
                        path: '/candidate/account/education',
                      },
                      {
                        text: '語学・スキル',
                        path: '/candidate/account/skills',
                      },
                    ],
                  ].map((row, i) => (
                    <div key={i} className={styles.profileContainerInner}>
                      {row.map(item => (
                        <Link href={item.path} key={item.text} legacyBehavior>
                          <a
                            className={styles.profileContainer}
                            onClick={onClose}
                          >
                            <span className={styles.profileContainerText}>
                              {item.text}
                            </span>
                            <Image
                              src='/images/arrow.svg'
                              alt='arrow'
                              width={8}
                              height={13}
                            />
                          </a>
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // デスクトップ用の既存Modal使用
  return (
    <Modal
      title='プロフィール確認・編集'
      isOpen={isOpen}
      onClose={onClose}
      width='800px'
      height='382px'
      overlayBgColor='rgba(0,0,0,0.4)'
      primaryButtonText=''
      secondaryButtonText=''
      hideFooter={true}
      className={styles.modalContainer}
    >
      <div className={styles.modalContent}>
        {/* データ配列で管理しmapで描画 */}
        <div className={styles.profileGrid}>
          {[
            [
              { text: '基本情報', path: '/candidate/account/profile' },
              {
                text: '転職活動状況',
                path: '/candidate/account/career-status',
              },
            ],
            [
              { text: '希望条件', path: '/candidate/account/expectation' },
              { text: '履歴書・職務経歴書', path: '/candidate/account/resume' },
            ],
            [
              { text: '職務要約', path: '/candidate/account/summary' },
              { text: '職務経歴', path: '/candidate/account/recent-job' },
            ],
            [
              {
                text: '学歴・経験業種/職種',
                path: '/candidate/account/education',
              },
              { text: '語学・スキル', path: '/candidate/account/skills' },
            ],
          ].map((row, i) => (
            <div key={i} className={styles.profileContainerInner}>
              {row.map(item => (
                <Link href={item.path} key={item.text} legacyBehavior>
                  <a className={styles.profileContainer} onClick={onClose}>
                    <span className={styles.profileContainerText}>
                      {item.text}
                    </span>
                    <Image
                      src='/images/arrow.svg'
                      alt='arrow'
                      width={8}
                      height={13}
                    />
                  </a>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
