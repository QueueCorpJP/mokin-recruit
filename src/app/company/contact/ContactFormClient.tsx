'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { SelectInput } from '@/components/ui/select-input';
import { Button } from '@/components/ui/button';
import { sendContactForm } from './actions';
import { useRouter } from 'next/navigation';

interface Group {
  id: string;
  group_name: string;
}

interface ContactFormClientProps {
  groups: Group[];
}

export function ContactFormClient({ groups }: ContactFormClientProps) {
  const [formData, setFormData] = useState({
    group: '',
    inquiryType: '',
    ticketCount: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const result = await sendContactForm(formData);

      if ((result as any).error) {
        setMessage({
          type: 'error',
          text: (result as any).error || 'エラーが発生しました',
        });
      } else {
        router.push('/company/contact/complete');
      }
    } catch {
      setMessage({ type: 'error', text: 'システムエラーが発生しました。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex flex-col gap-6 w-full'>
      {/* メッセージ表示 */}
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* グループ選択 */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row items-center gap-4'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
            }}
          >
            グループ
          </span>
          <SelectInput
            options={[
              { value: '', label: '選択してください' },
              ...groups.map(group => ({
                value: group.id,
                label: group.group_name,
              })),
            ]}
            placeholder='選択してください'
            className='w-[400px] h-[54px]'
            style={{ width: '400px', height: '54px' }}
            value={formData.group}
            onChange={value => setFormData({ ...formData, group: value })}
          />
        </div>
      </div>

      {/* お問い合わせ種別 */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row items-center gap-4'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
            }}
          >
            お問い合わせ種別
          </span>
          <SelectInput
            options={[
              { value: '', label: '選択してください' },
              { value: 'general', label: '一般問い合わせ' },
              { value: 'support', label: 'サポート' },
              { value: 'feedback', label: 'ご意見・ご要望' },
            ]}
            placeholder='選択してください'
            className='w-[400px] h-[54px]'
            style={{ width: '400px', height: '54px' }}
            value={formData.inquiryType}
            onChange={value => setFormData({ ...formData, inquiryType: value })}
          />
        </div>
      </div>

      {/* チケット枚数 */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row items-center gap-4'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.09em',
              display: 'block',
            }}
          >
            追加購入するチケット枚数
          </span>
          <div
            className='flex flex-row items-center'
            style={{ width: '400px', height: '54px' }}
          >
            <Input
              type='number'
              min={1}
              className='font-normal'
              style={{
                width: '376px',
                height: '54px',
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.09em',
                fontWeight: 'normal',
                color: '#323232',
                border: '1px solid #999999',
                outline: 'none',
                background: 'none',
                boxShadow: 'none',
              }}
              value={formData.ticketCount}
              onChange={e =>
                setFormData({ ...formData, ticketCount: e.target.value })
              }
            />
            <span
              className='flex items-center justify-center font-bold'
              style={{
                width: '16px',
                height: '54px',
                marginLeft: '8px',
                fontSize: '16px',
                lineHeight: '54px',
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              枚
            </span>
          </div>
        </div>
      </div>

      {/* お問い合わせ内容 */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row items-start gap-4'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
              marginTop: '11px',
            }}
          >
            お問い合わせ内容
          </span>
          <div className='border border-[#999999] rounded-[8px]'>
            <textarea
              style={{
                width: '400px',
                height: '147px',
                fontSize: '16px',
                lineHeight: '200%',
                letterSpacing: '0.1em',
                fontWeight: 'normal',
                color: '#323232',
                border: '1px solid #999999',
                outline: 'none',
                background: 'none',
                boxShadow: 'none',
                resize: 'none',
                padding: '11px',
                borderRadius: '5px',
              }}
              value={formData.content}
              onChange={e =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>
        </div>
      </div>

      {/* 送信ボタン */}
      <div className='flex w-full justify-center mt-10'>
        <Button
          type='submit'
          variant='green-gradient'
          disabled={isSubmitting}
          style={{
            width: '160px',
            height: '60px',
            borderRadius: '9999px',
          }}
        >
          {isSubmitting ? '送信中...' : '送信する'}
        </Button>
      </div>
    </form>
  );
}
