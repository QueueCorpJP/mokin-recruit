'use client';

import React from 'react';

// Design tokens from Figma
const DESIGN_TOKENS = {
  colors: {
    black: '#323232',
    white: '#FFFFFF', 
    green: '#0F9058',
    lightGreen: '#D2F1DA',
    red: '#FF5B5B'
  },
  fonts: {
    mini: {
      fontFamily: 'Noto Sans JP',
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: 1.6,
      letterSpacing: '1.4px'
    },
    miniBold: {
      fontFamily: 'Noto Sans JP',
      fontSize: '14px', 
      fontWeight: 700,
      lineHeight: 1.6,
      letterSpacing: '1.4px'
    },
    body: {
      fontFamily: 'Noto Sans JP',
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: 2,
      letterSpacing: '1.6px'
    }
  }
};

interface StatusBadgeProps {
  variant?: 'green' | 'lightGreen';
  children: React.ReactNode;
}

function StatusBadge({ variant = 'green', children }: StatusBadgeProps) {
  const styles = {
    green: {
      backgroundColor: DESIGN_TOKENS.colors.green,
      color: DESIGN_TOKENS.colors.white
    },
    lightGreen: {
      backgroundColor: DESIGN_TOKENS.colors.lightGreen,
      color: DESIGN_TOKENS.colors.green
    }
  };

  return (
    <div
      className="inline-flex items-center justify-center px-4 py-0 rounded-[5px] h-[32px]"
      style={{
        ...styles[variant],
        ...DESIGN_TOKENS.fonts.body
      }}
    >
      {children}
    </div>
  );
}

interface ActionButtonProps {
  variant: 'edit' | 'delete';
  onClick?: () => void;
  children: React.ReactNode;
}

function ActionButton({ variant, onClick, children }: ActionButtonProps) {
  const styles = {
    edit: {
      backgroundColor: DESIGN_TOKENS.colors.green,
      color: DESIGN_TOKENS.colors.white
    },
    delete: {
      backgroundColor: DESIGN_TOKENS.colors.red,
      color: DESIGN_TOKENS.colors.white
    }
  };

  return (
    <button
      className="inline-flex items-center justify-center px-4 py-1 rounded-[32px] transition-opacity hover:opacity-80"
      style={{
        ...styles[variant],
        ...DESIGN_TOKENS.fonts.miniBold
      }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

interface MediaTableRowProps {
  /** 日付文字列 (yyyy/mm/dd hh:mm 形式) */
  dateTime: string;
  /** ステータスバッジのリスト */
  statusBadges: Array<{
    variant: 'green' | 'lightGreen';
    text: string;
  }>;
  /** テキストコンテンツ（記事タイトルなど） */
  content: string;
  /** 編集ボタンのクリックハンドラ */
  onEdit?: () => void;
  /** 削除ボタンのクリックハンドラ */
  onDelete?: () => void;
}

export function MediaTableRow({
  dateTime,
  statusBadges,
  content,
  onEdit,
  onDelete
}: MediaTableRowProps) {
  return (
    <div className="flex items-center justify-start gap-6 px-10 py-5 bg-white rounded-[10px] border-b border-[#efefef] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]">
      {/* 日付・時刻 */}
      <div
        className="shrink-0 text-left whitespace-nowrap"
        style={{
          ...DESIGN_TOKENS.fonts.mini,
          color: DESIGN_TOKENS.colors.black
        }}
      >
        {dateTime}
      </div>

      {/* ステータスバッジ */}
      {statusBadges.map((badge, index) => (
        <StatusBadge key={index} variant={badge.variant}>
          {badge.text}
        </StatusBadge>
      ))}

      {/* コンテンツテキスト */}
      <div
        className="flex-1 min-w-0 text-left overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          ...DESIGN_TOKENS.fonts.mini,
          color: DESIGN_TOKENS.colors.black
        }}
      >
        {content}
      </div>

      {/* アクションボタン */}
      <div className="flex items-center gap-2 shrink-0">
        {onEdit && (
          <ActionButton variant="edit" onClick={onEdit}>
            編集
          </ActionButton>
        )}
        {onDelete && (
          <ActionButton variant="delete" onClick={onDelete}>
            削除
          </ActionButton>
        )}
      </div>
    </div>
  );
}

export default MediaTableRow;