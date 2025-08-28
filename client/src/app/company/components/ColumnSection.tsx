'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { sendContactFormEmail } from './contact-form-actions';

export function ColumnSection() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!isChecked) {
      setSubmitMessage('利用規約・個人情報の取扱いに同意してください。');
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage('');

    const formData = new FormData(event.currentTarget);
    
    const data = {
      name: formData.get('name') as string,
      companyName: formData.get('companyName') as string,
      department: formData.get('department') as string,
      email: formData.get('email') as string,
      inquiryType: formData.get('inquiryType') as string,
      content: formData.get('content') as string,
    };

    // 基本的なバリデーション
    if (!data.name || !data.companyName || !data.email || !data.content) {
      setSubmitMessage('必須項目を入力してください。');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await sendContactFormEmail(data);
      console.log('サーバーアクションの結果:', result);
      
      if (result?.success) {
        setSubmitMessage('お問い合わせを送信しました。ありがとうございました。');
        // フォームをリセット
        const form = event.currentTarget;
        if (form) {
          form.reset();
        }
        setIsChecked(false);
      } else {
        setSubmitMessage(result?.error || 'エラーが発生しました。');
      }
    } catch (error) {
      console.error('フロントエンドでのエラー:', error);
      setSubmitMessage('エラーが発生しました。しばらく時間をおいて再度お試しください。');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <section id="contact-form" className='bg-[#f9f9f9] pt-[120px] pb-[120px] px-[24px] flex flex-col items-center relative overflow-hidden'>
      {/* 背景装飾 - 左上 */}
      <div className='w-[531px] h-[701px] absolute left-0 top-0 mix-blend-multiply pointer-events-none select-none z-0'>
        <img
          src='/images/vector.svg'
          alt='装飾ベクター'
          className='w-full h-full object-cover'
          draggable='false'
        />
      </div>

      {/* 背景装飾 - 右下 */}
      <div className='w-[531px] h-[682px] absolute right-0 bottom-0 mix-blend-multiply pointer-events-none select-none z-0 rotate-180'>
        <img
          src='/images/vector.svg'
          alt='装飾ベクター'
          className='w-full h-full object-cover'
          draggable='false'
        />
      </div>

      {/* 背景テキスト */}
      <div className='absolute left-1/2 bottom-[132px] -translate-x-1/2 translate-y-full opacity-80 pointer-events-none select-none z-0'>
        <div className='font-[League_Spartan] font-bold text-[200px] text-white text-center tracking-[20px] leading-[1.8] whitespace-nowrap'>
          CONTACT FORM
        </div>
      </div>
     
      <div className='w-full max-w-[1200px] flex flex-col items-center gap-20 z-10 relative'>
        {/* ヘッダー */}
        <div className='flex flex-col items-center gap-4'>
          <h2 className='font-bold text-[#0f9058] text-[32px] text-center tracking-[3.2px] leading-[1.6] font-[family-name:var(--font-noto-sans-jp)]'>
            資料請求／お問い合わせ
          </h2>
          <div className='flex flex-row gap-7'>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
            <span className='w-[8px] h-[8px] md:h-[12px] md:w-[12px] rounded-full bg-[#0F9058]'></span>
          </div>
        </div>

        {/* お問い合わせフォーム */}
        <form onSubmit={handleSubmit} className='flex flex-col items-center gap-10 w-full max-w-[400px]'>
          <div className='flex flex-col gap-6 w-full'>
            {/* お名前 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                お名前
              </label>
              <input
                type='text'
                name='name'
                placeholder='山田 太郎'
                required
                className='rounded-[5px] border border-[#999] bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]'
              />
            </div>

            {/* 貴社名 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                貴社名
              </label>
              <input
                type='text'
                name='companyName'
                placeholder='株式会社ABC'
                required
                className='rounded-[5px] border border-[#999] bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]'
              />
            </div>

            {/* 部署名・役職 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                部署名・役職
              </label>
              <input
                type='text'
                name='department'
                placeholder='部署名・役職を入力'
                className='rounded-[5px] border border-[#999] bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]'
              />
            </div>

            {/* メールアドレス */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                メールアドレス
              </label>
              <input
                type='email'
                name='email'
                placeholder='name@example.com'
                required
                className='rounded-[5px] border border-[#999] bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]'
              />
            </div>

            {/* お問い合わせ種別 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[16px] tracking-[1.6px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                お問い合わせ種別
              </label>
              <div className='relative'>
                <select name='inquiryType' className='rounded-[5px] border border-[#999] bg-white p-[11px] pr-10 font-[family-name:var(--font-noto-sans-jp)] text-[16px] text-[#323232] tracking-[1.6px] leading-[2] w-full appearance-none'>
                  <option value=''>未選択</option>
                  <option value='資料請求'>資料請求</option>
                  <option value='サービス詳細'>サービス詳細</option>
                  <option value='その他'>その他</option>
                </select>
                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <img src='/images/down.svg' alt='下矢印' className='w-3.5 h-[9.333px]' />
                </div>
              </div>
            </div>

            {/* お問い合わせ内容 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                お問い合わせ内容
              </label>
              <textarea
                name='content'
                placeholder='お問い合わせ内容を入力'
                required
                className='rounded-[5px] border border-[#999] bg-white p-[11px] h-[147px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2] resize-none'
              />
            </div>

            {/* プライバシーポリシー同意 */}
            <Checkbox
              className='w-full'
              checked={isChecked}
              onChange={setIsChecked}
              label={
                <div className='flex gap-1 items-center flex-wrap ml-4'>
                  <a href='#' className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] underline font-[family-name:var(--font-noto-sans-jp)]'>
                    利用規約
                  </a>
                  <span className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                    ・
                  </span>
                  <a href='#' className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] underline font-[family-name:var(--font-noto-sans-jp)]'>
                    個人情報の取扱い
                  </a>
                  <span className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                    に同意する
                  </span>
                </div>
              }
            />
          </div>

          {/* メッセージ表示 */}
          {submitMessage && (
            <div className={`text-center p-4 rounded-md ${
              submitMessage.includes('送信しました') || submitMessage.includes('ありがとう') 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {submitMessage}
            </div>
          )}

          {/* 送信ボタン */}
          <Button
            type="submit"
            variant="green-gradient"
            size="figma-default"
            className="min-w-40"
            disabled={isSubmitting}
          >
            {isSubmitting ? '送信中...' : 'この内容で送信'}
          </Button>
        </form>
      </div>
    </section>
  );
}