'use client';
import React from 'react';

interface MessageBubbleProps {
  children: React.ReactNode;
  className?: string;
  direction?: 'left' | 'right';
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  children, 
  className = '',
  direction = 'left'
}) => {
  const isLeft = direction === 'left';
  
  return (
    <div className={`relative ${isLeft ? '' : 'flex justify-end'} ${className}`}>
      {/* Speech bubble arrow - positioned to seamlessly connect */}
      <div className={`absolute top-6 z-10 ${isLeft ? '-left-[15px]' : '-right-[15px]'}`}>
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 16 16" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          {isLeft ? (
            <>
              {/* Triangle pointing right (left bubble) */}
              <path 
                d="M0 8L16 0v16L0 8z" 
                fill="white" 
                stroke="none"
              />
              {/* Black border on top and bottom edges */}
              <path 
                d="M0 8L16 0"
                fill="none"
                stroke="black"
                strokeWidth="1"
              />
              <path 
                d="M0 8L16 16"
                fill="none"
                stroke="black"
                strokeWidth="1"
              />
              {/* White border on right edge */}
              <path 
                d="M16 0v16"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </>
          ) : (
            <>
              {/* Triangle pointing left (right bubble) */}
              <path 
                d="M16 8L0 0v16L16 8z" 
                fill="white" 
                stroke="none"
              />
              {/* Black border on top and bottom edges */}
              <path 
                d="M16 8L0 0"
                fill="none"
                stroke="black"
                strokeWidth="1"
              />
              <path 
                d="M16 8L0 16"
                fill="none"
                stroke="black"
                strokeWidth="1"
              />
              {/* White border on left edge (接触部分) */}
              <path 
                d="M0 0v16"
                fill="none"
                stroke="white"
                strokeWidth="1"
              />
            </>
          )}
        </svg>
      </div>
      
      {/* Message content box */}
      <div 
        className={`bg-white border border-black rounded-[3px] p-4 max-w-4xl w-fit ${isLeft ? '' : 'relative'}`}
      >
        {children}
      </div>
    </div>
  );
};