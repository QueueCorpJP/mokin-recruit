'use client';

import { useState, useTransition } from 'react';

interface NewPasswordFormProps {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
  isLoading?: boolean;
}

// パスワード表示切り替えアイコンコンポーネント
function EyeIcon({ isVisible, onClick }: { isVisible: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="aspect-[120/120] box-border flex items-center justify-center h-full p-0 relative shrink-0"
    >
      <div className="aspect-[120/96.1165] basis-0 grow min-h-px min-w-px relative shrink-0">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 28 23"
        >
          <path
            d="M1.69772 0.223637C1.24272 -0.13554 0.582111 -0.0523163 0.223367 0.403226C-0.135377 0.858768 -0.0522531 1.52018 0.402739 1.87936L26.3023 22.2035C26.7573 22.5627 27.4179 22.4795 27.7766 22.024C28.1354 21.5684 28.0523 20.907 27.5973 20.5478L22.9948 16.9385C24.7273 15.1602 25.8998 13.1672 26.4904 11.7524C26.6348 11.4063 26.6348 11.0209 26.4904 10.6748C25.8385 9.11109 24.4692 6.83338 22.4217 4.93237C20.3655 3.01383 17.5349 1.40191 14 1.40191C11.0163 1.40191 8.53135 2.55391 6.59325 4.06508L1.69772 0.223637ZM9.7607 6.54867C10.8763 5.52808 12.3682 4.90609 14 4.90609C17.4781 4.90609 20.2999 7.73132 20.2999 11.2136C20.2999 12.3043 20.0243 13.3292 19.5387 14.2228L17.8499 12.9C18.2174 12.0546 18.3137 11.0866 18.0599 10.1273C17.5743 8.30951 15.9687 7.08743 14.1837 7.01297C13.93 7.00421 13.7813 7.28016 13.86 7.52545C13.9519 7.80579 14.0044 8.10364 14.0044 8.41464C14.0044 8.86142 13.8994 9.28192 13.7156 9.65424L9.76507 6.55305L9.7607 6.54867ZM16.3187 17.0787C15.6012 17.3634 14.8181 17.5211 14 17.5211C10.5219 17.5211 7.70011 14.6959 7.70011 11.2136C7.70011 10.9114 7.72198 10.6179 7.76136 10.3288L3.63581 7.07429C2.63832 8.37521 1.92521 9.67176 1.50959 10.6748C1.36522 11.0209 1.36522 11.4063 1.50959 11.7524C2.16146 13.3161 3.53081 15.5938 5.57827 17.4948C7.63449 19.4134 10.4651 21.0253 14 21.0253C16.0912 21.0253 17.9331 20.4602 19.5212 19.6017L16.3187 17.0787Z"
            fill="#0F9058"
          />
        </svg>
      </div>
    </button>
  );
}

export function NewPasswordForm({
  onSubmit,
  isLoading = false,
}: NewPasswordFormProps) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  // 基本的なバリデーション
  const isPasswordValid = password.length >= 8;
  const isConfirmPasswordValid = confirmPassword && password === confirmPassword;
  const isFormValid = isPasswordValid && isConfirmPasswordValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isLoading || isPending) return;

    startTransition(async () => {
      try {
        await onSubmit(password, confirmPassword);
        setPassword('');
        setConfirmPassword('');
      } catch (error) {
        // エラーハンドリングは上位コンポーネントで行う
        console.error('Password reset error:', error);
      }
    });
  };

  return (
    <div className="bg-[#ffffff] relative rounded-[10px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] size-full">
      <div className="flex flex-col items-center relative size-full">
        <form onSubmit={handleSubmit} className="box-border content-stretch flex flex-col gap-10 items-center justify-start p-[80px] relative size-full">
          
          {/* 見出し+説明 */}
          <div className="box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] gap-6 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-center w-full">
            <div className="relative shrink-0 text-[#0f9058] text-[32px] tracking-[3.2px] w-full">
              <p className="block leading-[1.6]">パスワードの再設定</p>
            </div>
            <div className="relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full">
              <p className="block leading-[2]">
                半角英数字・記号のみ、8文字以上でパスワードを設定してください。
              </p>
            </div>
          </div>

          {/* フォームフィールド */}
          <div className="box-border content-stretch cursor-pointer flex flex-col gap-6 items-end justify-start p-0 relative shrink-0">
            
            {/* 新規パスワード */}
            <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start overflow-visible p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-row items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0">
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
                  <p className="adjustLetterSpacing block leading-[2] whitespace-pre">
                    新規パスワード
                  </p>
                </div>
              </div>
              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]">
                <div className="bg-[#ffffff] h-[50px] relative rounded-[5px] shrink-0 w-full">
                  <div className="absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]" />
                  <div className="flex flex-row items-center relative size-full">
                    <div className="box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative w-full">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="半角英数字・記号のみ、8文字以上"
                        disabled={isLoading || isPending}
                        required
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic flex-1 text-[#323232] text-[16px] text-left tracking-[1.6px] bg-transparent border-none outline-none placeholder:text-[#999999] placeholder:leading-[2]"
                        style={{ 
                          color: password ? '#323232' : '#999999',
                          lineHeight: password ? '2' : '2'
                        }}
                      />
                      <EyeIcon 
                        isVisible={showPassword} 
                        onClick={() => setShowPassword(!showPassword)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 新規パスワード再入力 */}
            <div className="box-border content-stretch flex flex-row gap-4 items-start justify-start overflow-visible p-0 relative shrink-0">
              <div className="box-border content-stretch flex flex-row items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0">
                <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
                  <p className="adjustLetterSpacing block leading-[2] whitespace-pre">
                    新規パスワード再入力
                  </p>
                </div>
              </div>
              <div className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]">
                <div className="bg-[#ffffff] h-[50px] relative rounded-[5px] shrink-0 w-full">
                  <div className="absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]" />
                  <div className="flex flex-row items-center relative size-full">
                    <div className="box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative w-full">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="確認のためもう一度入力"
                        disabled={isLoading || isPending}
                        required
                        className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic flex-1 text-[#323232] text-[16px] text-left tracking-[1.6px] bg-transparent border-none outline-none placeholder:text-[#999999] placeholder:leading-[2]"
                        style={{ 
                          color: confirmPassword ? '#323232' : '#999999',
                          lineHeight: confirmPassword ? '2' : '2'
                        }}
                      />
                      <EyeIcon 
                        isVisible={showConfirmPassword} 
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 設定するボタン */}
          <button
            type="submit"
            disabled={!isFormValid || isLoading || isPending}
            className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-[#0F9058] hover:bg-[#0D7A4A] disabled:bg-[#999999] disabled:cursor-not-allowed transition-colors"
          >
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.6px]">
              <p className="adjustLetterSpacing block font-bold leading-[1.6] text-[16px] whitespace-pre">
                {isLoading || isPending ? (
                  <span className="flex items-center gap-2 justify-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    設定中...
                  </span>
                ) : (
                  '設定する'
                )}
              </p>
            </div>
          </button>
        </form>
      </div>
    </div>
  );
}
