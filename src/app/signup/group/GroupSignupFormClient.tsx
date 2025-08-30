'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PasswordFormField } from '@/components/ui/password-form-field';
import { BaseInput } from '@/components/ui/base-input';
import { Checkbox } from '@/components/ui/checkbox';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { sendGroupSignupVerification } from './actions';

interface GroupSignupFormClientProps {
  companyData: any;
  groupData: any;
  currentUser: any;
}

export function GroupSignupFormClient({ companyData, groupData, currentUser }: GroupSignupFormClientProps) {
  const [formData, setFormData] = useState({
    name: currentUser?.full_name || '',
    password: '',
    passwordConfirm: '',
    agreed: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // バリデーション
    if (!formData.name || !formData.password || !formData.passwordConfirm) {
      setMessage({ type: 'error', text: '全ての項目を入力してください。' });
      setIsSubmitting(false);
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setMessage({ type: 'error', text: 'パスワードが一致しません。' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.agreed) {
      setMessage({ type: 'error', text: '利用規約・個人情報に同意してください。' });
      setIsSubmitting(false);
      return;
    }

    if (!groupData?.id || !companyData?.id) {
      setMessage({ type: 'error', text: 'グループ情報を取得できませんでした。' });
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await sendGroupSignupVerification({
        ...formData,
        email: currentUser.email, // 認証ユーザーのメールアドレスを使用
        groupId: groupData.id,
        companyId: companyData.id
      });
      
      if (result.error) {
        setMessage({ type: 'error', text: result.error });
      } else {
        // 認証ページに遷移
        router.push(`/signup/group/verify?email=${encodeURIComponent(currentUser.email)}`);
      }
    } catch (error) {
      console.error('送信エラー:', error);
      setMessage({ type: 'error', text: 'システムエラーが発生しました。' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
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


      {/* お名前 */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
              width: '160px',
              minWidth: '160px',
            }}
          >
            お名前
          </span>
          <BaseInput
            id='name'
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            placeholder='お名前を入力してください'
            className='w-full'
            style={{ maxWidth: '400px' }}
          />
        </div>
      </div>

      {/* パスワード */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
              width: '160px',
              minWidth: '160px',
            }}
          >
            パスワード
          </span>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <PasswordFormField
              id='password'
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              label=''
              placeholder='半角英数字・記号のみ、8文字以上'
              showValidation={true}
              className='w-full'
              hideLabel={true}
            />
          </div>
        </div>
      </div>

      {/* パスワード再入力 */}
      <div className='flex w-full justify-end'>
        <div className='flex flex-row justify-end gap-4 w-full max-w-[620px]'>
          <span
            className='font-bold text-right'
            style={{
              fontSize: '16px',
              lineHeight: '200%',
              letterSpacing: '0.1em',
              display: 'block',
              width: '160px',
              minWidth: '160px',
            }}
          >
            パスワード再入力
          </span>
          <div style={{ maxWidth: '400px', width: '100%' }}>
            <PasswordFormField
              id='passwordConfirm'
              value={formData.passwordConfirm}
              onChange={e => setFormData({...formData, passwordConfirm: e.target.value})}
              label=''
              placeholder='もう一度パスワードを入力してください'
              showValidation={true}
              isConfirmField={true}
              confirmTarget={formData.password}
              className='w-full'
              hideLabel={true}
            />
          </div>
        </div>
      </div>

      {/* 利用規約・個人情報同意チェック */}
      <div className='flex items-center justify-center w-full'>
        <Checkbox
          checked={formData.agreed}
          onChange={checked => setFormData({...formData, agreed: checked})}
          label={
            <span
              style={{
                fontSize: '14px',
                lineHeight: '200%',
                color: '#333',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
              }}
            >
              <Link 
                href='/terms'
                style={{
                  color: '#333',
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginRight: 2,
                }}
              >
                利用規約
              </Link>
              ・
              <Link 
                href='/privacy'
                style={{
                  color: '#333',
                  textDecoration: 'underline',
                  textUnderlineOffset: '3px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginLeft: 2,
                }}
              >
                個人情報
              </Link>
              に同意する
            </span>
          }
        />
      </div>

      {/* 送信ボタン */}
      <div className='flex w-full justify-center mt-10'>
        <Button
          type="submit"
          variant='green-gradient'
          disabled={isSubmitting}
          style={{
            width: '160px',
            height: '60px',
            borderRadius: '9999px',
          }}
        >
          {isSubmitting ? '送信中...' : '登録する'}
        </Button>
      </div>
    </form>
  );
}