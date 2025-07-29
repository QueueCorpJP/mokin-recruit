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
  children,
}: JobPostCardProps) {
  return (
    <div
      style={{
        width: '100%',
        boxShadow: '0px 0px 20px rgba(0,0,0,0.05)',
      }}
      className={`bg-white h-auto md:h-[366px] ${className} rounded-[10px] overflow-hidden`}
    >
      <div className='flex flex-col md:flex-row justify-center items-center w-full h-full gap-8 p-6'>
        <img
          src={imageUrl}
          alt={imageAlt}
          width={477}
          height={318}
          className='w-full h-auto object-cover rounded-[5px] md:w-[477px] md:h-[318px]'
        />
        <div
          className='w-full md:w-[731px]'
          style={{ background: 'transparent', height: undefined }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
