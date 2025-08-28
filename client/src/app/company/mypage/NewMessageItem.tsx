import React from 'react';

export interface Message {
  id: string;
  date: string;
  group: string;
  user: string;
  content: string;
}

interface NewMessageItemProps {
  message: Message;
}

export const NewMessageItem: React.FC<NewMessageItemProps> = ({ message }) => (
  <div className='w-full bg-white px-6 py-4 rounded-lg' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
    <div className='flex items-center gap-6'>
      <span className='text-xs text-gray-400' style={{ lineHeight: '160%' }}>
        {message.date}
      </span>
      <div className='w-40 h-8 flex items-center justify-center bg-gradient-to-r from-[#65BDAC] to-[#86C36A] rounded-lg'>
        <span
          className='text-xs font-bold text-white w-full text-center truncate'
          style={{ lineHeight: '160%' }}
        >
          {message.group}
        </span>
      </div>
      <span
        className='w-30 text-base font-bold text-green-700 inline-block truncate'
        style={{ lineHeight: '200%' }}
      >
        {message.user}
      </span>
      <span
        className='w-[382px] text-base text-gray-900 inline-block truncate'
        style={{ lineHeight: '200%' }}
      >
        {message.content}
      </span>
    </div>
  </div>
);
