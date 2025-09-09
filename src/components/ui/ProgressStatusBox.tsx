import React from 'react';

interface ProgressStatusBoxProps {
  children: React.ReactNode;
  type?: 'progress' | 'select';
  width?: number | string;
  height?: number | string;
  style?: React.CSSProperties;
}

const ProgressStatusBox: React.FC<ProgressStatusBoxProps> = ({
  children,
  type = 'progress',
  width = 240,
  height = 38,
  style = {},
}) => {
  const isProgress = type === 'progress';
  return (
    <div
      style={{
        width,
        height,
        padding: '8px 20px',
        background: isProgress
          ? 'linear-gradient(to right, #65BDAC, #86C36A)'
          : '#fff',
        color: isProgress ? '#fff' : '#323232',
        borderRadius: 8,
        boxSizing: 'border-box',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: isProgress ? undefined : '1px solid #999999',
        fontWeight: 'bold',
        fontSize: 14,
        lineHeight: '160%',
        letterSpacing: '0.1em',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        ...style,
      }}
    >
      <span
        style={{
          width: '100%',
          textAlign: 'center',
          overflow: 'hidden',
          display: 'block',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </span>
    </div>
  );
};

export default ProgressStatusBox;
