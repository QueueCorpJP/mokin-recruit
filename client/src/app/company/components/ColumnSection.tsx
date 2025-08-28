'use client'

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { sendContactFormEmail } from './contact-form-actions';

type ValidationErrors = {
  name?: string;
  companyName?: string;
  department?: string;
  email?: string;
  inquiryType?: string;
  content?: string;
  agreement?: string;
};

export function ColumnSection() {
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (data: {
    name: string;
    companyName: string;
    department: string;
    email: string;
    inquiryType: string;
    content: string;
  }) => {
    const newErrors: ValidationErrors = {};

    if (!data.name) {
      newErrors.name = 'お名前を入力してください';
    }

    if (!data.companyName) {
      newErrors.companyName = '貴社名を入力してください';
    }

    if (!data.department) {
      newErrors.department = '部署名・役職を入力してください';
    }

    if (!data.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!validateEmail(data.email)) {
      newErrors.email = 'メールアドレスの形式が正しくありません';
    }

    if (!data.inquiryType || data.inquiryType === '') {
      newErrors.inquiryType = 'お問い合わせ種別を選択してください';
    }

    if (!data.content) {
      newErrors.content = 'お問い合わせ内容を入力してください';
    }

    if (!isChecked) {
      newErrors.agreement = '利用規約と個人情報の取り扱いに同意してください';
    }

    return newErrors;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
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

    const validationErrors = validateForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

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
        setErrors({});
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
                お名前 <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='name'
                placeholder='山田太郎'
                className={`rounded-[5px] border ${errors.name ? 'border-red-500' : 'border-[#999]'} bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]`}
              />
              {errors.name && (
                <span className='text-red-500 text-[12px]'>{errors.name}</span>
              )}
            </div>

            {/* 貴社名 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                貴社名 <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='companyName'
                placeholder='株式会社ABC'
                className={`rounded-[5px] border ${errors.companyName ? 'border-red-500' : 'border-[#999]'} bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]`}
              />
              {errors.companyName && (
                <span className='text-red-500 text-[12px]'>{errors.companyName}</span>
              )}
            </div>

            {/* 部署名・役職 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                部署名・役職 <span className='text-red-500'>*</span>
              </label>
              <input
                type='text'
                name='department'
                placeholder='部署名・役職を入力'
                className={`rounded-[5px] border ${errors.department ? 'border-red-500' : 'border-[#999]'} bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]`}
              />
              {errors.department && (
                <span className='text-red-500 text-[12px]'>{errors.department}</span>
              )}
            </div>

            {/* メールアドレス */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                メールアドレス <span className='text-red-500'>*</span>
              </label>
              <input
                type='email'
                name='email'
                placeholder='name@example.com'
                className={`rounded-[5px] border ${errors.email ? 'border-red-500' : 'border-[#999]'} bg-white p-[11px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2]`}
              />
              {errors.email && (
                <span className='text-red-500 text-[12px]'>{errors.email}</span>
              )}
            </div>

            {/* お問い合わせ種別 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                お問い合わせ種別 <span className='text-red-500'>*</span>
              </label>
              <div className='relative'>
                <select name='inquiryType' className={`rounded-[5px] border ${errors.inquiryType ? 'border-red-500' : 'border-[#999]'} bg-white p-[11px] pr-10 font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2] w-full appearance-none`}>
                  <option value=''>未選択</option>
                  <option value='資料請求をしたい'>資料請求をしたい</option>
                  <option value='導入を検討している'>導入を検討している</option>
                  <option value='料金・プランについて'>料金・プランについて</option>
                  <option value='機能・使い方について'>機能・使い方について</option>
                  <option value='契約・請求について'>契約・請求について</option>
                  <option value='その他'>その他</option>
                </select>
                <div className='absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none'>
                  <img src='/images/down.svg' alt='下矢印' className='w-3.5 h-[9.333px]' />
                </div>
              </div>
              {errors.inquiryType && (
                <span className='text-red-500 text-[12px]'>{errors.inquiryType}</span>
              )}
            </div>

            {/* お問い合わせ内容 */}
            <div className='flex flex-col gap-2'>
              <label className='font-bold text-[#323232] text-[14px] tracking-[1.4px] leading-[2] font-[family-name:var(--font-noto-sans-jp)]'>
                お問い合わせ内容 <span className='text-red-500'>*</span>
              </label>
              <textarea
                name='content'
                placeholder='お問い合わせ内容を入力'
                className={`rounded-[5px] border ${errors.content ? 'border-red-500' : 'border-[#999]'} bg-white p-[11px] h-[147px] font-[family-name:var(--font-noto-sans-jp)] text-[14px] text-[#999999] tracking-[1.4px] leading-[2] resize-none`}
              />
              {errors.content && (
                <span className='text-red-500 text-[12px]'>{errors.content}</span>
              )}
            </div>

            {/* プライバシーポリシー同意 */}
            <div className='flex flex-col gap-2'>
              <Checkbox
                className='w-full'
                checked={isChecked}
                onChange={(checked) => {
                  setIsChecked(checked);
                  if (checked && errors.agreement) {
                    setErrors(prev => ({ ...prev, agreement: undefined }));
                  }
                }}
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
                    <span className='text-red-500'>*</span>
                  </div>
                }
              />
              {errors.agreement && (
                <span className='text-red-500 text-[12px] ml-6'>{errors.agreement}</span>
              )}
            </div>
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
            disabled={isSubmitting || !isChecked}
          >
            {isSubmitting ? '送信中...' : 'この内容で送信'}
          </Button>
        </form>
      </div>
    </section>
  );
}