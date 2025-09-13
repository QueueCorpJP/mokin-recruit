import React from 'react';
import { Modal } from './Modal';
import Link from 'next/link';
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
    >
      <div
        style={{
          width: '640px',
          height: 'auto',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        {/* データ配列で管理しmapで描画 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                    <img
                      src='/images/arrow.svg'
                      alt='arrow'
                      style={{ width: '8px', height: '13px' }}
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
