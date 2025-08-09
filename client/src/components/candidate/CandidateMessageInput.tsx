'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { sendCandidateMessage } from '@/lib/candidate-message';

interface CandidateMessageInputProps {
  roomId: string;
  candidateId: string;
}

export function CandidateMessageInput({
  roomId,
  candidateId,
}: CandidateMessageInputProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // メッセージ送信処理
  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;
    
    try {
      setIsSending(true);
      const result = await sendCandidateMessage(roomId, candidateId, message.trim());
      
      if (result.success) {
        setMessage(''); // 送信後にメッセージをクリア
        // ページを再読み込みしてメッセージを表示更新
        window.location.reload();
      } else {
        console.error('Failed to send message:', result.error);
        alert('メッセージの送信に失敗しました');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('メッセージの送信に失敗しました');
    } finally {
      setIsSending(false);
    }
  };

  // Enterキーでの送信（Shift+Enterは改行）
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // クイック返信ボタンのクリック処理
  const handleQuickReply = (templateName: string) => {
    const templates: { [key: string]: string } = {
      '話を聞いてみる': 'このたびはご連絡いただき、誠にありがとうございます。ぜひ詳しくお話を伺えればと存じます。',
      '面談する（訪問）': 'ご連絡ありがとうございます。ぜひ貴社に直接お伺いして、お話を伺えますでしょうか？\nご都合のよい日程がございましたらご共有いただけますと幸いです。\n\n※以下に候補日を記載させていただきます。\n・〇月〇日（〇）〇時〜\n・〇月〇日（〇）〇時〜',
      '面談する（オンライン）': 'ご連絡ありがとうございます。ぜひ一度オンラインにてお話を伺えますでしょうか？\nご都合のよい日程がございましたらご共有いただけますと幸いです。\n\n※以下に候補日を記載させていただきます。\n・〇月〇日（〇）〇時〜\n・〇月〇日（〇）〇時〜',
      '質問する': 'ご連絡ありがとうございます。いくつかお伺いしたい点があり、下記に質問事項を記載いたしました。\nお忙しいところ恐縮ですが、ご確認のほどよろしくお願い申し上げます。\n\n【質問内容】\n・〇〇について\n・〇〇について'
    };
    
    setMessage(templates[templateName] || templateName);
  };

  return (
    <div
      className='w-full py-4 bg-white border-t border-[#efefef] transition-all duration-200'
      style={{ 
        paddingLeft: isExpanded ? '6px' : '24px', 
        paddingRight: isExpanded ? '6px' : '24px'
      }}
      // py-4: 上下16px, 動的パディング: 3行以上で6px（+18px幅拡張）、2行以下で24px
    >
      {/* 候補者用クイック返信ボタン */}
      <div className='w-full flex flex-row flex-wrap md:flex-nowrap items-start mb-2 gap-x-2 gap-y-2'>
        {[
          '話を聞いてみる',
          '面談する（訪問）',
          '面談する（オンライン）',
          '質問する',
        ].map((label) => (
          <button
            key={label}
            type='button'
            onClick={() => handleQuickReply(label)}
            disabled={isSending}
            className='px-4 py-1 border border-[#0F9058] text-[#0F9058] rounded-full text-[14px] font-bold bg-white w-auto flex-shrink-0 disabled:opacity-50'
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
        ))}
      </div>
      
      {/* テキスト入力欄 */}
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
        // 入力が増えると自動で高さが増える＋行数によって幅を調整
        onInput={(e) => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = '56px';
          target.style.height = target.scrollHeight + 'px';
          
          // より正確な行数計算：初期高さ56pxを基準に判定
          const initialHeight = 56;
          const lineHeight = 32; // line-height: 2 × font-size: 16px = 32px
          const additionalHeight = target.scrollHeight - initialHeight;
          const currentLines = Math.floor(additionalHeight / lineHeight) + 1;
          
          console.log('CandidateMessageInput Height calculation:', {
            scrollHeight: target.scrollHeight,
            currentLines,
            shouldExpand: currentLines >= 3
          });
          
          setIsExpanded(currentLines >= 3);
        }}
      />
      
      {/* 添付・送信エリア */}
      <div className='w-full flex flex-row items-center gap-2 mt-4 justify-between'>
        {/* 左端：クリップアイコンボタン */}
        <button
          type='button'
          className='flex items-center justify-center w-8 h-8 p-0 bg-transparent border-none cursor-pointer'
          disabled={isSending}
        >
          <Image src='/images/clip.svg' alt='添付' width={24} height={24} />
        </button>
        
        {/* 添付ファイルタグ（ダミー） */}
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
        
        {/* 右端：送信ボタン */}
        <button
          type='button'
          onClick={handleSendMessage}
          disabled={isSending || !message.trim()}
          className='flex items-center gap-2 bg-[#0F9058] text-white font-bold text-[14px] leading-[1.6] tracking-[0.1em] rounded-[32px] px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed'
          style={{ maxWidth: 120, padding: '10px 24px' }}
        >
          <Image src='/images/form.svg' alt='送信' width={16} height={16} />
          {isSending ? '送信中...' : '送信'}
        </button>
      </div>
    </div>
  );
}