import React from 'react';

interface JobPostCardProps {
  imageUrl: string;
  imageAlt: string;
  className?: string;
  children?: React.ReactNode;
}

export function JobPostCard({ 
  imageUrl, 
  imageAlt, 
  className = '',
  children 
}: JobPostCardProps) {
  return (
    <div
      style={{
        width: '100%',
        height: '366px',
        boxShadow: '0px 0px 20px rgba(0,0,0,0.05)',
      }}
      className={`bg-white ${className}`}
    >
      <div className='flex flex-row justify-center items-center w-full h-full gap-8'>
        <img
          src={imageUrl}
          alt={imageAlt}
          width={477}
          height={318}
          style={{ width: 477, height: 318, objectFit: 'cover' }}
        />
        <div
          style={{ width: 731, height: 318, background: 'transparent' }}
        >
          {children}
        </div>
      </div>
    </div>
  );
} 