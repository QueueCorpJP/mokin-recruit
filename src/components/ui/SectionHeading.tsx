import React from 'react';

interface SectionHeadingProps {
  /** 画像のsrc（public配下のパス or 絶対URL） */
  iconSrc: string;
  /** 画像のaltテキスト */
  iconAlt: string;
  /** 見出しテキスト */
  children: React.ReactNode;
  /** 画像の幅（デフォルト24） */
  iconWidth?: number;
  /** 画像の高さ（デフォルト25） */
  iconHeight?: number;
  /** 見出しテキストの追加スタイル */
  textStyle?: React.CSSProperties;
  /** ラッパーdivの追加スタイル */
  style?: React.CSSProperties;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  iconSrc,
  iconAlt,
  children,
  iconWidth = 24,
  iconHeight = 25,
  textStyle,
  style,
}) => {
  const wrapperStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '8px',
    borderBottom: '2px solid #DCDCDC',
    ...style,
  };
  const headingTextStyle: React.CSSProperties = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#222',
    letterSpacing: '0.04em',
    lineHeight: 1.4,
    ...textStyle,
  };
  return (
    <div style={wrapperStyle}>
      <img
        src={iconSrc}
        alt={iconAlt}
        width={iconWidth}
        height={iconHeight}
        style={{ display: 'block' }}
      />
      <span style={headingTextStyle}>{children}</span>
    </div>
  );
};
