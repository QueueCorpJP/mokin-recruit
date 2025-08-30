'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect, useTransition } from 'react';
import { SetPasswordForm } from '@/components/auth/SetPasswordForm';
import { setPasswordAction, SetPasswordResult } from './actions';
import { SpinnerIcon } from '@/components/ui/Loading';

interface SetPasswordClientProps {
  userType?: 'candidate' | 'company';
}

/**
 * URLフラグメント（#以降）からパラメータを解析する関数
 */
function parseFragmentParams(fragment: string): Record<string, string> {
  const params: Record<string, string> = {};

  if (!fragment) return params;

  // #を削除
  const cleanFragment = fragment.startsWith('#') ? fragment.slice(1) : fragment;

  // &で分割してパラメータを解析
  cleanFragment.split('&').forEach(param => {
    const [key, value] = param.split('=');
    if (key && value) {
      params[decodeURIComponent(key)] = decodeURIComponent(value);
    }
  });

  return params;
}

export function SetPasswordClient({ userType: initialUserType }: SetPasswordClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [parameterError, setParameterError] = useState<string | null>(null);
  const [isParametersReady, setIsParametersReady] = useState(false);
  const [allParams, setAllParams] = useState<Record<string, string>>({});
  const [userType, setUserType] = useState<'candidate' | 'company' | null>(null);
  const [userId, setUserId] = useState('');
  const [email, setEmail] = useState('');

  // ローカルストレージからユーザーIDとメールアドレスを取得
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUserId = localStorage.getItem('signup_user_id');
      const savedEmail = localStorage.getItem('signup_email');
      
      if (!savedUserId) {
        // ユーザーIDがない場合は会員登録ページに戻る
        router.push('/signup');
        return;
      }
      
      setUserId(savedUserId);
      if (savedEmail) {
        setEmail(savedEmail);
      }
    }
  }, [router]);

  // URLパラメータの安全な取得と検証（クエリパラメータ + フラグメントパラメータ）
  useEffect(() => {
    try {
      const queryParams: Record<string, string> = {};
      const fragmentParams: Record<string, string> = {};
      let hasValidParams = true; // signup/set-passwordでは常にアクセス可能

      // 現在のURLを詳細にログ出力
      if (typeof window !== 'undefined') {
        console.log('🌐 Current URL details:', {
          fullUrl: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
          hash: window.location.hash,
          searchParams: Array.from(searchParams.entries()),
        });
      }

      // クエリパラメータ（?以降）を収集
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
        console.log(`🔍 Query param found: ${key} = ${value}`);
      }

      // フラグメントパラメータ（#以降）を収集（クライアントサイドでのみ）
      if (typeof window !== 'undefined') {
        const fragment = window.location.hash;
        console.log('🔗 Fragment detected:', fragment);
        Object.assign(fragmentParams, parseFragmentParams(fragment));
        
        if (Object.keys(fragmentParams).length > 0) {
          console.log('🔗 Fragment params parsed:', fragmentParams);
        }
      }

      // ユーザータイプの取得（複数ソースから優先順位付きで取得）
      let detectedUserType: 'candidate' | 'company' | null = null;
      
      // 1. プロップスから取得（最優先）
      if (initialUserType === 'candidate' || initialUserType === 'company') {
        detectedUserType = initialUserType;
        console.log('🔗 UserType from props:', detectedUserType);
      }
      
      // 2. URLクエリパラメータから取得
      if (!detectedUserType && (queryParams.userType === 'candidate' || queryParams.userType === 'company')) {
        detectedUserType = queryParams.userType;
        console.log('🔗 UserType from URL query:', detectedUserType);
      }
      
      // 3. URLフラグメントパラメータから取得
      if (!detectedUserType && (fragmentParams.userType === 'candidate' || fragmentParams.userType === 'company')) {
        detectedUserType = fragmentParams.userType;
        console.log('🔗 UserType from URL fragment:', detectedUserType);
      }
      
      // 4. ローカルストレージから取得
      if (!detectedUserType && typeof window !== 'undefined') {
        const savedUserType = localStorage.getItem('password_reset_user_type') as 'candidate' | 'company';
        if (savedUserType === 'candidate' || savedUserType === 'company') {
          detectedUserType = savedUserType;
          console.log('🔄 UserType restored from localStorage:', detectedUserType);
        } else {
          console.log('🔄 No valid userType in localStorage:', savedUserType);
        }
      }
      
      // 5. デフォルト値（候補者ユーザー）
      if (!detectedUserType) {
        detectedUserType = 'candidate';
        console.log('⚙️ UserType defaulted to candidate');
      }
      
      console.log('🎯 Final userType decision:', detectedUserType);
      setUserType(detectedUserType);

      // 全パラメータをマージ（フラグメントパラメータを優先）
      const combinedParams = { ...queryParams, ...fragmentParams };
      setAllParams(combinedParams);

      setIsParametersReady(true);
    } catch (error) {
      setParameterError('URLパラメータの処理中にエラーが発生しました。');
      setIsParametersReady(true);
    }
  }, [searchParams, initialUserType]);

  const handleSubmit = useCallback(
    async (password: string, confirmPassword: string) => {
      // パラメータエラーがある場合は処理しない
      if (parameterError) {
        throw new Error(parameterError);
      }

      startTransition(async () => {
        try {
          // signup/set-passwordでは常にuserIdを使用
          const result: SetPasswordResult = await setPasswordAction({
            password,
            confirmPassword,
            userId,
          });

          if (!result.success) {
            throw new Error(result.error || 'パスワードの設定に失敗しました');
          }

          // 成功時はサーバーアクションがリダイレクトを行うため、ここには到達しない
        } catch (error) {
          // Next.jsのリダイレクトエラーは正常な処理なので無視
          if (error instanceof Error && (error.message.includes('NEXT_REDIRECT') || (error as any).digest?.includes('NEXT_REDIRECT'))) {
            // リダイレクト中なのでエラーを表示しない
            return;
          }
          
          // その他のエラーは再スロー（SetPasswordFormでキャッチされる）
          throw error;
        }
      });
    },
    [allParams, parameterError, userType, userId]
  );

  // パラメータの準備ができていない場合はローディング表示
  if (!isParametersReady || !userId) {
    return (
      <div className='w-full max-w-md text-center space-y-4'>
        <SpinnerIcon size="lg" variant="primary" className="mx-auto" />
        <p className='text-[#323232] font-medium'>パラメータを確認中...</p>
      </div>
    );
  }

  // パラメータエラーがある場合はエラー表示
  if (parameterError) {
    return (
      <div className={`relative w-full ${
        userType === 'candidate' 
          ? 'max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]' 
          : 'max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 md:p-[80px]'
      }`}>
        <div className="flex flex-col items-center relative w-full">
          <div className="box-border content-stretch flex flex-col gap-6 md:gap-10 items-center justify-start relative w-full">
            
            {/* エラーメッセージ - 一番上に配置 */}
            <div className="box-border content-stretch flex flex-col gap-4 md:gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full">
              <div className="relative shrink-0 text-[#DC2626] text-[24px] md:text-[32px] tracking-[2.4px] md:tracking-[3.2px] w-full">
                <p className="block leading-[1.6] font-bold font-[family-name:var(--font-noto-sans-jp)]">リンクが無効です</p>
              </div>
              <div className="relative shrink-0 text-[#323232] text-[14px] md:text-[16px] tracking-[1.4px] md:tracking-[1.6px] w-full">
                <p className="block leading-[2] font-bold font-[family-name:var(--font-noto-sans-jp)]">
                  パスワードリセットリンクの有効期限が切れています。<br />
                  新しいリンクを要求してください。
                </p>
              </div>
            </div>

            {/* ボタン */}
            <div className="box-border content-stretch flex flex-col gap-4 items-center justify-start p-0 relative shrink-0 w-full">
              <button
                onClick={() => {
                  router.push('/signup');
                }}
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:min-w-40 px-6 sm:px-10 py-3 md:py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors"
              >
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
                  <p className="adjustLetterSpacing block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre">
                    サインアップページに戻る
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正常時はパスワード設定フォームを表示（Figmaデザインに合わせたシンプルな構成）
  return (
    <div className='w-full'>
      {userType === 'candidate' ? (
        // 候補者の場合のフォーム表示
        <div className='relative w-full max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]'>
          <SetPasswordForm onSubmit={handleSubmit} isLoading={isPending} userType="candidate" />
        </div>
      ) : (
        // 企業ユーザーの場合
        <div className='relative w-full max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 md:p-[80px]'>
          <SetPasswordForm onSubmit={handleSubmit} isLoading={isPending} userType="company" />
        </div>
      )}
    </div>
  );
}