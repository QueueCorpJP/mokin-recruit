import React from 'react';

interface FaqBoxProps {
  /** タイトル（質問文） */
  title: string;
  /** 本文（回答文） */
  body: string;
  /** ラッパーdivの追加スタイル */
  style?: React.CSSProperties;
}

export const FaqBox: React.FC<FaqBoxProps> = ({ title, body, style }) => {
  const faqBoxStyle: React.CSSProperties = {
    background: '#fff',
    padding: '16px 24px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    width: '100%',
    boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',

    ...style,
  };
  const faqTitleStyle: React.CSSProperties = {
    fontSize: '16px',
    fontWeight: 700,
    color: '#0F9058',
    lineHeight: '200%',
    margin: '4px 0',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  };
  const faqBodyStyle: React.CSSProperties = {
    fontSize: '14px',
    color: '#323232',
    lineHeight: '160%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    fontWeight: 700,
    WebkitBoxOrient: 'vertical',
    whiteSpace: 'normal',
  };
  return (
    <div style={faqBoxStyle}>
      <div style={faqTitleStyle}>{title}</div>
      <div style={faqBodyStyle}>{body}</div>
    </div>
  );
};