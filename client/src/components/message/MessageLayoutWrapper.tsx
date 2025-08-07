'use client';

import React, { useState, useEffect } from 'react';
import { MessageLayoutServer, MessageLayoutServerProps } from './MessageLayoutServer';

export function MessageLayoutWrapper(props: MessageLayoutServerProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className='w-full h-full flex items-center justify-center'>
        <div className='text-gray-500'>メッセージを読み込み中...</div>
      </div>
    );
  }

  return <MessageLayoutServer {...props} />;
}