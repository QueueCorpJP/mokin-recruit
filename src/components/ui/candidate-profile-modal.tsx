import React from 'react';
import { Modal } from './mo-dal';

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
    >
      <div
        style={{
          width: '800px',
          height: '382px',
          background: '#fff',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* ここに内容を追加可能 */}
      </div>
    </Modal>
  );
};
