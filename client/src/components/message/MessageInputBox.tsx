import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { SelectInput } from '@/components/ui/select-input';
import { uploadMultipleFiles } from '@/lib/storage';

interface MessageInputBoxProps {
  isCandidatePage?: boolean;
  onSendMessage?: (message: string, fileUrls?: string[]) => void;
  candidateId?: string;
  userType?: 'candidate' | 'company';
}

/**
 * [MessageInputBox]
 * メッセージ詳細画面の一番下に配置される入力エリア用のコンテナdiv。
 * - 横幅: 100%（親要素にフィット）
 * - padding: 上下16px, 左右24px
 * - 今後、入力欄やボタン等をこの中に追加予定
 */
export const MessageInputBox: React.FC<MessageInputBoxProps> = ({
  isCandidatePage = false,
  onSendMessage,
  candidateId,
  userType = 'candidate',
}) => {
  // company用セレクトのstate
  const templateOptions = [
    { value: '', label: 'テンプレート未選択' },
  ];
  const [template, setTemplate] = useState('');
  const [message, setMessage] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 送信処理の共通関数
  const handleSendMessage = async () => {
    if (message.trim() && onSendMessage && candidateId) {
      setIsUploading(true);
      try {
        let fileUrls: string[] = [];
        
        // ファイルがある場合はStorageにアップロード
        if (attachedFiles.length > 0) {
          console.log('🔍 [MESSAGE INPUT DEBUG] Starting file upload:', {
            candidateId,
            fileCount: attachedFiles.length,
            files: attachedFiles.map(f => ({ name: f.name, size: f.size }))
          });
          
          if (!candidateId) {
            console.error('🔍 [MESSAGE INPUT DEBUG] candidateId is missing!');
            alert('ユーザーIDが取得できませんでした。ページを再読み込みしてください。');
            return;
          }
          
          const uploadResults = await uploadMultipleFiles(attachedFiles, candidateId, userType);
          fileUrls = uploadResults
            .filter(result => !result.error)
            .map(result => result.url);
          
          // エラーがあった場合はユーザーに通知
          const errors = uploadResults.filter(result => result.error);
          if (errors.length > 0) {
            console.error('File upload errors:', errors);
            alert('一部のファイルのアップロードに失敗しました');
          }
        }
        
        // メッセージを送信
        onSendMessage(message.trim(), fileUrls);
        setMessage('');
        setAttachedFiles([]);
        
        // テキストエリアの高さをリセット
        const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
        if (textarea) {
          textarea.style.height = '56px';
        }
      } catch (error) {
        console.error('Send message error:', error);
        alert('メッセージの送信に失敗しました');
      } finally {
        setIsUploading(false);
      }
    }
  };

  // ファイル選択ハンドラー
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setAttachedFiles(prev => [...prev, ...newFiles]);
    }
  };

  // ファイル削除ハンドラー
  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // クリップボタンクリックハンドラー
  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className='w-full px-6 py-4 bg-white border-t border-[#efefef]'
      // px-6: 左右24px, py-4: 上下16px
    >
      {/* タグ風アウトラインボタン or セレクト */}
      <div className='w-full flex flex-row flex-wrap md:flex-nowrap items-start mb-2 gap-x-2 gap-y-2'>
        {isCandidatePage ? (
          [
            { label: '話を聞いてみる', text: 'ご紹介いただいた求人について、ぜひお話を聞かせていただければと思います。どうぞよろしくお願いいたします。' },
            { label: '面談する（訪問）', text: 'ご紹介いただいた求人に興味があります。可能でしたら、御社にお伺いして面談をさせていただければと思います。ご検討のほど、よろしくお願いいたします。' },
            { label: '面談する（オンライン）', text: 'ご紹介いただいた求人に興味があります。可能でしたら、オンラインで面談をさせていただければと思います。ご検討のほど、よろしくお願いいたします。' },
            { label: '質問する', text: 'ご紹介いただいた求人について質問があります。お時間のある時に教えていただければ幸いです。よろしくお願いいたします。' },
          ].map((template) => (
            <button
              key={template.label}
              type='button'
              onClick={() => setMessage(template.text)}
              className='px-4 py-1 border border-[#0F9058] text-[#0F9058] bg-white rounded-full text-[14px] font-bold w-auto flex-shrink-0 inline-block hover:bg-[rgba(15,144,88,0.20)] transition-colors duration-200'
            >
              {template.label}
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
      {/* テキスト入力欄 */}
      <textarea
        className='w-full min-h-[56px] resize-none bg-white outline-none text-[16px] font-bold leading-[2] placeholder:text-[#bbb] placeholder:font-bold placeholder:text-[16px] placeholder:leading-[2]'
        placeholder='メッセージを入力'
        rows={1}
        value={message}
        onChange={e => setMessage(e.target.value)}
        style={{
          lineHeight: '2',
          fontWeight: 'bold',
          fontSize: 16,
          background: '#fff',
          border: 'none',
          padding: 0,
        }}
        // 入力が増えると自動で高さが増える
        onInput={e => {
          const target = e.target as HTMLTextAreaElement;
          target.style.height = '56px';
          target.style.height = target.scrollHeight + 'px';
        }}
      />
      {/* 添付・送信エリア */}
      <div className='w-full mt-4'>
        {/* 隠れたファイル入力 */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg"
        />
        
        {/* クリップアイコンとファイルタグ */}
        <div className='flex flex-row items-start gap-2 justify-between md:items-center'>
          {/* 左端：クリップアイコンボタン */}
          <button
            type='button'
            className='flex items-center justify-center w-8 h-8 p-0 bg-transparent border-none cursor-pointer flex-shrink-0'
            onClick={handleClipClick}
          >
            <Image src='/images/clip.svg' alt='添付' width={24} height={24} />
          </button>
          
          {/* 添付ファイルタグ */}
          <div className='flex flex-col gap-2 flex-1 ml-2'>
            {attachedFiles.map((file, index) => (
              <div key={index} className='bg-[#EFEFEF] rounded-[5px] px-2 py-1 flex items-center max-w-[200px]'>
                <span className='text-[#323232] text-[14px] font-medium truncate'>
                  {file.name}
                </span>
                <button
                  type='button'
                  className='ml-1 cursor-pointer border-none p-0 bg-transparent'
                  onClick={() => removeFile(index)}
                  style={{
                    display: 'flex',
                    width: '8px',
                    height: '8px',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '10px',
                    aspectRatio: '1',
                  }}
                >
                  <span className='text-[20px] font-medium' style={{ color: '#0F9058' }}>×</span>
                </button>
              </div>
            ))}
          </div>
          
          {/* PC時のみ右端に送信ボタン */}
          <button
            type='button'
            className='hidden md:flex items-center gap-2 bg-[#0F9058] text-white font-bold text-[14px] leading-[1.6] tracking-[0.1em] rounded-[32px] px-6 py-2'
            style={{ maxWidth: 120, padding: '10px 24px' }}
            disabled={isUploading}
            onClick={handleSendMessage}
          >
            <Image src='/images/form.svg' alt='送信' width={16} height={16} />
            送信
          </button>
        </div>
        
        {/* モバイル時のみ送信ボタンを下に表示 */}
        <div className='flex justify-end mt-3 md:hidden'>
          <button
            type='button'
            className='flex items-center gap-2 bg-[#0F9058] text-white font-bold text-[14px] leading-[1.6] tracking-[0.1em] rounded-[32px] px-6 py-2'
            style={{ maxWidth: 120, padding: '10px 24px' }}
            disabled={isUploading}
            onClick={handleSendMessage}
          >
            <Image src='/images/form.svg' alt='送信' width={16} height={16} />
            送信
          </button>
        </div>
      </div>
    </div>
  );
};
