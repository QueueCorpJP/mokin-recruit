'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
import { NewPasswordForm } from '@/components/auth/NewPasswordForm';
// Alert component is no longer used

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

// Client Component (インタラクティブ機能、状態管理)
export function NewPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [parameterError, setParameterError] = useState<string | null>(null);
  const [isParametersReady, setIsParametersReady] = useState(false);
  const [allParams, setAllParams] = useState<Record<string, string>>({});
  const [userType, setUserType] = useState<'candidate' | 'company' | null>(null);

  // URLパラメータの安全な取得と検証（クエリパラメータ + フラグメントパラメータ）
  useEffect(() => {
    try {
      const queryParams: Record<string, string> = {};
      const fragmentParams: Record<string, string> = {};
      let hasValidParams = false;

      // クエリパラメータ（?以降）を収集
      for (const [key, value] of searchParams.entries()) {
        queryParams[key] = value;
      }

      // フラグメントパラメータ（#以降）を収集（クライアントサイドでのみ）
      if (typeof window !== 'undefined') {
        const fragment = window.location.hash;
        Object.assign(fragmentParams, parseFragmentParams(fragment));
      }

      // ユーザータイプの取得（複数ソースから優先順位付きで取得）
      let detectedUserType: 'candidate' | 'company' | null = null;
      
      // 1. URLクエリパラメータから取得（最優先）
      if (queryParams.userType === 'candidate' || queryParams.userType === 'company') {
        detectedUserType = queryParams.userType;
        console.log('🔗 UserType from URL query:', detectedUserType);
      }
      
      // 2. URLフラグメントパラメータから取得
      if (!detectedUserType && (fragmentParams.userType === 'candidate' || fragmentParams.userType === 'company')) {
        detectedUserType = fragmentParams.userType;
        console.log('🔗 UserType from URL fragment:', detectedUserType);
      }
      
      // 3. ローカルストレージから取得
      if (!detectedUserType && typeof window !== 'undefined') {
        const savedUserType = localStorage.getItem('password_reset_user_type') as 'candidate' | 'company';
        if (savedUserType === 'candidate' || savedUserType === 'company') {
          detectedUserType = savedUserType;
          console.log('🔄 UserType restored from localStorage:', detectedUserType);
        }
      }
      
      // 4. デフォルト値（企業ユーザー）
      if (!detectedUserType) {
        detectedUserType = 'company';
        console.log('⚙️ UserType defaulted to company');
      }
      
      setUserType(detectedUserType);
      
      // 使用後はローカルストレージをクリア
      if (typeof window !== 'undefined' && (queryParams.userType || fragmentParams.userType)) {
        localStorage.removeItem('password_reset_user_type');
      }

      // 全パラメータをマージ（フラグメントパラメータを優先）
      const combinedParams = { ...queryParams, ...fragmentParams };
      setAllParams(combinedParams);

      // 必須パラメータの存在確認
      const tokenHash = combinedParams.token_hash || combinedParams.token;
      const code = combinedParams.code;
      const accessToken = combinedParams.access_token;
      const error = combinedParams.error;

      // デバッグ情報を出力
      console.log('🔍 NewPasswordContent - Parameter analysis:', {
        currentUrl: typeof window !== 'undefined' ? window.location.href : 'SSR',
        queryParams,
        fragmentParams,
        combinedParams,
        detectedUserType,
        hasQueryUserType: !!queryParams.userType,
        hasFragmentUserType: !!fragmentParams.userType,
        savedUserType: typeof window !== 'undefined' ? localStorage.getItem('password_reset_user_type') : null,
        hasError: !!error,
        hasTokenHash: !!tokenHash,
        hasCode: !!code,
        hasAccessToken: !!accessToken,
        tokenSources: {
          fromQuery: !!(queryParams.token_hash || queryParams.access_token),
          fromFragment: !!(fragmentParams.token_hash || fragmentParams.access_token)
        }
      });

      // エラーパラメータがある場合の処理
      if (error) {
        let errorMessage = 'リンクでエラーが発生しました。';

        switch (error) {
          case 'access_denied':
            if (combinedParams.error_code === 'otp_expired') {
              errorMessage = 'リンクの有効期限が切れています。新しいリンクを要求してください。';
            } else {
              errorMessage = 'アクセスが拒否されました。新しいパスワードリセットを要求してください。';
            }
            break;
          case 'invalid_request':
            errorMessage = '無効なリクエストです。メールから正しいリンクを使用してください。';
            break;
          case 'expired_token':
          case 'otp_expired':
            errorMessage = 'リンクの有効期限が切れています。新しいリンクを要求してください。';
            break;
          default:
            if (combinedParams.error_description) {
              const decodedDescription = decodeURIComponent(combinedParams.error_description);
              if (decodedDescription.toLowerCase().includes('expired')) {
                errorMessage = 'リンクの有効期限が切れています。新しいリンクを要求してください。';
              } else if (decodedDescription.toLowerCase().includes('invalid')) {
                errorMessage = 'リンクが無効です。メールから正しいリンクを使用してください。';
              } else {
                errorMessage = `エラー: ${decodedDescription}`;
              }
            }
        }
        setParameterError(errorMessage);
        setIsParametersReady(true);
        return;
      }

      // 有効なパラメータの確認
      if (tokenHash || code || accessToken) {
        hasValidParams = true;
      }

      if (!hasValidParams) {
        setParameterError('無効なリンクです。パスワードリセットを再度お試しください。');
      }

      setIsParametersReady(true);
    } catch (error) {
      setParameterError('URLパラメータの処理中にエラーが発生しました。');
      setIsParametersReady(true);
    }
  }, [searchParams]);

  const handleSubmit = useCallback(
    async (password: string, confirmPassword: string) => {
      // パラメータエラーがある場合は処理しない
      if (parameterError) {
        throw new Error(parameterError);
      }

      setIsLoading(true);

      try {
        // 統合されたパラメータから認証情報を取得
        const tokenHash = allParams.token_hash || allParams.token;
        const type = allParams.type || 'recovery';
        const accessToken = allParams.access_token;
        const refreshToken = allParams.refresh_token;
        const code = allParams.code;
        const state = allParams.state;

        // 必須パラメータの最終確認
        if (!tokenHash && !code && !accessToken) {
          throw new Error('無効なリンクです。パスワードリセットを再度お試しください。');
        }

        // APIリクエストのペイロード構築
        const requestBody = {
          tokenHash,
          type,
          accessToken,
          refreshToken,
          code,
          state,
          password,
          confirmPassword,
        };

        const response = await fetch('/api/auth/reset-password', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'パスワードの設定に失敗しました');
        }

        // パスワードリセット成功

        // 成功時は完了ページにリダイレクト（userTypeパラメータを引き継ぐ）
        const redirectUrl = `/auth/reset-password/complete?userType=${userType}`;
        router.push(redirectUrl);
      } catch (error) {
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [router, allParams, parameterError, userType]
  );

  // パラメータの準備ができていない場合はローディング表示
  if (!isParametersReady) {
    return (
              <div className='w-full max-w-md text-center space-y-4'>
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F9058] mx-auto'></div>
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
                  const resetPath = userType === 'candidate' 
                    ? '/candidate/auth/reset-password' 
                    : '/company/auth/reset-password';
                  router.push(resetPath);
                }}
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:min-w-40 px-6 sm:px-10 py-3 md:py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] hover:bg-[#0D7A4A] transition-colors"
              >
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
                  <p className="adjustLetterSpacing block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre">
                    新しいリセットを要求
                  </p>
                </div>
              </button>
              
              <button
                onClick={() => {
                  const loginPath = userType === 'candidate' 
                    ? '/candidate/auth/login' 
                    : '/company/auth/login';
                  router.push(loginPath);
                }}
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center w-full max-w-[280px] sm:max-w-[313px] md:min-w-40 px-6 sm:px-10 py-3 md:py-3.5 relative rounded-[32px] border-2 border-[#0F9058] shrink-0 bg-white text-[#0F9058] hover:bg-[#0F9058] hover:text-white transition-colors"
              >
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[0px] text-center text-nowrap tracking-[1.4px] md:tracking-[1.6px]">
                  <p className="adjustLetterSpacing block font-bold leading-[1.6] text-[14px] md:text-[16px] whitespace-pre">
                    ログインページに戻る
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 正常時はパスワードリセットフォームを表示（Figmaデザインに合わせたシンプルな構成）
  return (
    <div className='w-full'>
      {userType === 'candidate' ? (
        // 候補者の場合のフォーム表示
        <div className='relative w-full max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-6 md:px-[80px] py-10 md:py-[80px]'>
          <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} userType="candidate" />
        </div>
      ) : (
        // 企業ユーザーの場合
        <div className='relative w-full max-w-[480px] md:max-w-[800px] bg-white rounded-[20px] md:rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 md:p-[80px]'>
          <NewPasswordForm onSubmit={handleSubmit} isLoading={isLoading} userType="company" />
        </div>
      )}
    </div>
  );
}
