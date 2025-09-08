'use client';

import React from 'react';
import Image from 'next/image';
import type { CandidateData } from '@/components/company/CandidateCard';

interface CandidateDetailModalProps {
  candidate: CandidateData;
  onClose: () => void;
}

const CandidateDetailModal: React.FC<CandidateDetailModalProps> = ({
  candidate,
  onClose,
}) => {
  // TODO: 実際の詳細UIは今後実装
  // 画像URLがなければダミー画像
  const imageUrl = (candidate as any).imageUrl || '/noimage.png';
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 2000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 1000,
          background: '#fff',
          zIndex: 2001,
          boxShadow: '0 0 24px rgba(0,0,0,0.2)',
          padding: '24px 40px',
          borderRadius: '16px 0 0 16px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* 左上に×ボタン */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 24,
            left: 40,
            fontSize: 32,
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            zIndex: 2002,
          }}
          aria-label='閉じる'
        >
          ×
        </button>
        {/* 画像表示 */}
        <div
          style={{
            marginTop: 80,
            marginBottom: 32,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Image
            src={imageUrl}
            alt='候補者画像'
            width={120}
            height={120}
            style={{
              borderRadius: '50%',
              objectFit: 'cover',
              background: '#f0f0f0',
            }}
          />
        </div>
        {/* ここに今後、候補者情報を追加 */}
      </div>
    </div>
  );
};

export default CandidateDetailModal;
