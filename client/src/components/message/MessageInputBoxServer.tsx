'use client';

import React, { useState } from 'react';
import { SelectInput } from '@/components/ui/select-input';
import { sendMessage } from '@/lib/actions';

export const MessageInputBoxServer: React.FC<{ 
  isCandidatePage?: boolean;
  userId?: string;
  userType?: string; 
  roomId?: string;
}> = ({
  isCandidatePage = false,
  userId = '',
  userType = '',
  roomId,
}) => {
  const templateOptions = [
    { value: '', label: 'テンプレート未選択' },
    { value: '1', label: '面談日程調整テンプレート' },
    { value: '2', label: '合否連絡テンプレート' },
  ];
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // デバッグ用：props の値を確認
  console.log('MessageInputBoxServer props:', { 
    userId, 
    userType, 
    roomId, 
    isCandidatePage,
    messageLength: message.trim().length 
  });

  const handleSendMessage = async () => {
    console.log('Send button clicked! Checking conditions:', {
      messageEmpty: !message.trim(),
      isSending,
      noRoomId: !roomId,
      userId,
      userType
    });
    
    if (!message.trim()) {
      alert('メッセージを入力してください');
      return;
    }
    
    if (!roomId) {
      alert('送信先のルームが選択されていません');
      return;
    }
    
    if (!userId) {
      alert('ユーザー認証が必要です');
      return;
    }
    
    if (isSending) return;
    
    try {
      setIsSending(true);
      console.log('Sending message with params:', {
        roomId,
        message: message.trim(),
        userType,
        userId
      });
      
      const result = await sendMessage(
        roomId,
        message.trim(),
        userType as 'candidate' | 'company',
        userId
      );
      
      console.log('Send message result:', result);
      
      if (result.success) {
        setMessage(''); // 送信後にメッセージをクリア
        alert('メッセージを送信しました');
      } else {
        console.error('Failed to send message:', result.error);
        alert(`送信に失敗しました: ${result.error}`);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert(`送信エラー: ${error}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickReply = (replyText: string) => {
    setMessage(replyText);
  };

  return (
    <div
      className='w-full px-6 py-4 bg-white border-t border-[#efefef]'
    >
      <div className='w-full flex flex-row flex-wrap md:flex-nowrap items-start mb-2 gap-x-2 gap-y-2'>
        {isCandidatePage ? (
          [
            '話を聞いてみる',
            '面談する（訪問）',
            '面談する（オンライン）',
            '質問する',
          ].map((label) => (
            <button
              key={label}
              type='button'
              onClick={() => handleQuickReply(label)}
              className='px-4 py-1 border border-[#0F9058] text-[#0F9058] rounded-full text-[14px] font-bold bg-white w-auto flex-shrink-0'
              style={{
                paddingTop: 4,
                paddingBottom: 4,
                paddingLeft: 16,
                paddingRight: 16,
                borderColor: '#0F9058',
                color: '#0F9058',
                background: '#fff',
                minWidth: 0,
                display: 'inline-block',
              }}
            >
              {label}
            </button>
          ))
        ) : (
          <SelectInput
            options={templateOptions}
            value={template}
            onChange={setTemplate}
            placeholder='テンプレート未選択'
            className='w-[240px] font-bold text-[16px]'
          />
        )}
      </div>
      <textarea
        className='w-full min-h-[56px] resize-none bg-white outline-none text-[16px] font-bold leading-[2] placeholder:text-[#bbb] placeholder:font-bold placeholder:text-[16px] placeholder:leading-[2]'
        placeholder='メッセージを入力'
        rows={1}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isSending}
        style={{
          lineHeight: '2',
          fontWeight: 'bold',
          fontSize: 16,
          background: '#fff',
          border: 'none',
          padding: 0,
        }}
        onInput={e => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = '56px';
          target.style.height = target.scrollHeight + 'px';
        }}
      />
      <div className='w-full flex flex-row items-center gap-2 mt-4 justify-between'>
        <button
          type='button'
          className='flex items-center justify-center w-8 h-8 p-0 bg-transparent border-none cursor-pointer'
        >
          <img src='/images/file.svg' alt='添付' className='w-6 h-6' />
        </button>
        <div className='flex flex-row gap-2 flex-1 ml-2'>
          <div className='bg-[#EFEFEF] rounded-[5px] px-2 py-1 flex items-center max-w-[200px]'>
            <span className='text-[#323232] text-[14px] font-medium truncate'>
              ファイル名テキストが入ります.pdf
            </span>
            <button
              type='button'
              className='ml-1 w-4 h-4 flex items-center justify-center bg-transparent border-none p-0 cursor-pointer'
            >
              <span className='text-[#999] text-[12px] font-bold'>×</span>
            </button>
          </div>
        </div>
        <button
          type='button'
          onClick={handleSendMessage}
          disabled={isSending}
          className='flex items-center gap-2 bg-[#0F9058] text-white font-bold text-[14px] leading-[1.6] tracking-[0.1em] rounded-[32px] px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ maxWidth: 120, padding: '10px 24px' }}
        >
          <img src='/images/complete.svg' alt='送信' className='w-4 h-4' />
          {isSending ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
};