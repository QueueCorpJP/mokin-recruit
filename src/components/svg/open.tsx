import React from 'react';

interface OpenIconProps extends React.SVGProps<SVGSVGElement> {
  width?: number | string;
  height?: number | string;
  fill?: string;
  rotate?: number;
  aspectRatio?: string;
}

const Open: React.FC<OpenIconProps> = ({
  width = 12,
  height = 8,
  fill = '#FFF',
  rotate = 0,
  aspectRatio,
  style,
  ...props
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 12 8"
      fill="none"
      style={{
        transform: `rotate(${rotate}deg)`,
        aspectRatio: aspectRatio,
        flex: '1 0 0',
        ...style,
      }}
      {...props}
    >
      <path
        d="M6.60515 6.97722C6.27045 7.31193 5.72688 7.31193 5.39217 6.97722L0.251032 1.83609C-0.0836773 1.50138 -0.0836773 0.957811 0.251032 0.623102C0.585741 0.288392 1.12931 0.288393 1.46402 0.623102L6 5.15908L10.536 0.62578C10.8707 0.291071 11.4143 0.291071 11.749 0.62578C12.0837 0.960489 12.0837 1.50406 11.749 1.83877L6.60783 6.9799L6.60515 6.97722Z"
        fill={fill}
      />
    </svg>
  );
};

export default Open;
