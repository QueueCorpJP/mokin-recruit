import React from 'react';

export const Sidebar: React.FC = () => (
  <div className='w-full md:max-w-[320px] md:flex-none'>
    <div className='h-[300px] bg-white rounded-lg flex items-center justify-center' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
      <span className='text-gray-400'>右カラム（サブ）ダミー</span>
    </div>
  </div>
);
