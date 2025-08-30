import React from 'react'

interface PaginationArrowProps {
  direction: 'left' | 'right'
  className?: string
}

export const PaginationArrow: React.FC<PaginationArrowProps> = ({ direction, className = '' }) => {
  return (
    <svg 
      width="6" 
      height="9" 
      viewBox="0 0 6 9" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{
        transform: direction === 'right' ? 'scaleX(-1)' : 'none'
      }}
    >
      <path 
        d="M0.881964 4.09656C0.658824 4.3197 0.658824 4.68208 0.881964 4.90522L4.30939 8.33264C4.53253 8.55579 4.89491 8.55579 5.11805 8.33264C5.34119 8.10951 5.34119 7.74713 5.11805 7.52399L2.09406 4.5L5.11626 1.47601C5.3394 1.25287 5.3394 0.890494 5.11626 0.667355C4.89312 0.444215 4.53074 0.444215 4.3076 0.667355L0.880178 4.09478L0.881964 4.09656Z" 
        fill="#0F9058"
      />
    </svg>
  )
} 