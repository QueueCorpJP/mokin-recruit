'use client';

import { Navigation } from '@/components/ui/navigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { useState } from 'react';

// Image assets from Figma design
const img =
  'http://localhost:3845/assets/b94ac86d41a5faa2ef2160fba8f34b5510b65d33.svg';
const img1 =
  'http://localhost:3845/assets/af1e5ff25fdcc1ca5e43c87f4714a7ce81a31d11.svg';
const img2 =
  'http://localhost:3845/assets/710d8a39044515b00a2a4542fb9e5ad160c29fa3.svg';
const img3 =
  'http://localhost:3845/assets/b14a33ac6016aab92c1a98e0e6423ac5b788105a.svg';
const imgEye =
  'http://localhost:3845/assets/0f8e0f5a1d2036c3561056d157a008cdde559266.svg';
const imgEllipse60 =
  'http://localhost:3845/assets/c42ea1e9cc024551f5f63745a907a402f2b03f24.svg';

// SP (mobile) background images
const spImg =
  'http://localhost:3845/assets/2d804c689c7c8c2634d49e1a03555bf65379e7e4.svg';
const spImg1 =
  'http://localhost:3845/assets/61e93da4cb649866a170c0c65b6837b3cb55863f.svg';
const spImg2 =
  'http://localhost:3845/assets/da1f2bbef77c4b662265b38ccc16dc7bfc3e0a82.svg';

interface PasswordFormCardProps {
  isMobile?: boolean;
  password: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onTogglePasswordVisibility: () => void;
  onToggleConfirmPasswordVisibility: () => void;
  onSubmit: () => void;
}

function PasswordFormCard({
  isMobile = false,
  password,
  confirmPassword,
  showPassword,
  showConfirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onTogglePasswordVisibility,
  onToggleConfirmPasswordVisibility,
  onSubmit,
}: PasswordFormCardProps) {
  return (
    <div
      className={`bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start relative shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 ${
        isMobile
          ? 'px-6 py-10 rounded-3xl w-full'
          : 'min-w-[720px] p-[80px] rounded-[40px] w-[800px]'
      }`}
      id={isMobile ? 'node-1_7246' : 'node-1_5961'}
    >
      <div
        className={`box-border content-stretch flex flex-col font-['Noto_Sans_JP:Bold',_sans-serif] font-bold items-center justify-start leading-[0] p-0 relative shrink-0 text-center w-full ${
          isMobile ? 'gap-2' : 'gap-6'
        }`}
        data-name="見出し+説明"
        id={isMobile ? 'node-I1_7246-189_3570' : 'node-I1_5961-189_3570'}
      >
        <div
          className={`relative shrink-0 text-[#0f9058] w-full ${
            isMobile
              ? 'text-[24px] tracking-[2.4px]'
              : 'text-[32px] tracking-[3.2px]'
          }`}
          id={isMobile ? 'node-I1_7246-189_3570-788_44958' : 'node-1_579'}
        >
          <p className="block leading-[1.6]">パスワード</p>
        </div>
        <div
          className={`relative shrink-0 text-[#323232] text-[16px] tracking-[1.6px] w-full ${
            isMobile ? '' : 'leading-[2]'
          }`}
          id={isMobile ? 'node-I1_7246-189_3570-788_44959' : 'node-1_580'}
        >
          <p className="block leading-[2]">
            半角英数字・記号のみ、8文字以上でパスワードを設定してください
          </p>
        </div>
      </div>

      <div
        className={`box-border content-stretch flex flex-col gap-6 items-end justify-center p-0 relative shrink-0 ${
          isMobile ? 'w-full' : ''
        }`}
        id={isMobile ? 'node-I1_7246-189_3571' : 'node-I1_5961-189_3571'}
      >
        {isMobile ? (
          <>
            <div
              className="box-border content-stretch flex flex-col gap-2 items-start justify-start overflow-visible p-0 relative shrink-0 w-full"
              data-name="パスワード"
              id="node-I1_7246-189_3572"
            >
              <div
                className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] text-left tracking-[1.6px] w-full"
                id="node-I1_7246-189_3572-788_72420"
              >
                <p className="block leading-[2]">新規パスワード</p>
              </div>
              <div
                className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
                id="node-I1_7246-189_3572-788_72421"
              >
                <div
                  className="bg-[#ffffff] box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid"
                  data-name="入力フォーム"
                  id="node-I1_7246-189_3572-788_72422"
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="半角英数字・記号のみ、8文字以上"
                    className="flex-1 font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[14px] text-left tracking-[1.4px] bg-transparent outline-none"
                  />
                  <button
                    onClick={onTogglePasswordVisibility}
                    type="button"
                    className="aspect-[120/120] box-border content-stretch flex flex-row gap-2.5 h-full items-center justify-start p-0 relative shrink-0"
                    data-name="eye"
                    id="node-I1_7246-189_3572-788_72424"
                  >
                    <div
                      className="aspect-[120/96.1165] basis-0 grow min-h-px min-w-px relative shrink-0"
                      data-name="Vector"
                      id="node-I1_7246-189_3572-788_72425"
                    >
                      <img
                        alt=""
                        className="block max-w-none size-full"
                        src={imgEye}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>

            <div
              className="box-border content-stretch flex flex-col gap-2 items-start justify-start overflow-visible p-0 relative shrink-0 w-full"
              data-name="パスワード"
              id="node-I1_7246-189_3573"
            >
              <div
                className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] text-left tracking-[1.6px] w-full"
                id="node-I1_7246-189_3573-788_72420"
              >
                <p className="block leading-[2]">新規パスワード再入力</p>
              </div>
              <div
                className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
                id="node-I1_7246-189_3573-788_72421"
              >
                <div
                  className="bg-[#ffffff] box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid"
                  data-name="入力フォーム"
                  id="node-I1_7246-189_3573-788_72422"
                >
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    placeholder="確認のためもう一度入力"
                    className="flex-1 font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[14px] text-left tracking-[1.4px] bg-transparent outline-none"
                  />
                  <button
                    onClick={onToggleConfirmPasswordVisibility}
                    type="button"
                    className="aspect-[120/120] box-border content-stretch flex flex-row gap-2.5 h-full items-center justify-start p-0 relative shrink-0"
                    data-name="eye"
                    id="node-I1_7246-189_3573-788_72424"
                  >
                    <div
                      className="aspect-[120/96.1165] basis-0 grow min-h-px min-w-px relative shrink-0"
                      data-name="Vector"
                      id="node-I1_7246-189_3573-788_72425"
                    >
                      <img
                        alt=""
                        className="block max-w-none size-full"
                        src={imgEye}
                      />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
              data-name="パスワード"
              id="node-I1_5961-189_3572"
            >
              <div
                className="box-border content-stretch flex flex-row items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0"
                id="node-I1_5961-189_3572-53_1429"
              >
                <div
                  className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]"
                  id="node-I1_5961-189_3572-1_5244"
                >
                  <p className="block leading-[2] whitespace-pre">
                    新規パスワード
                  </p>
                </div>
              </div>
              <div
                className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]"
                id="node-I1_5961-189_3572-192_3827"
              >
                <div
                  className="bg-[#ffffff] box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid"
                  data-name="入力フォーム"
                  id="node-I1_5961-189_3572-1_5245"
                >
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => onPasswordChange(e.target.value)}
                    placeholder="半角英数字・記号のみ、8文字以上"
                    className="flex-1 font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[16px] text-left tracking-[1.6px] bg-transparent outline-none"
                  />
                  <button
                    onClick={onTogglePasswordVisibility}
                    type="button"
                    className="aspect-[120/120] box-border content-stretch flex flex-row gap-2.5 h-full items-center justify-start p-0 relative shrink-0"
                    data-name="eye"
                    id="node-I1_5961-189_3572-1_5284"
                  >
                    <div
                      className="aspect-[120/96.1165] basis-0 grow min-h-px min-w-px relative shrink-0"
                      data-name="Vector"
                      id="node-I1_5961-189_3572-1_5285"
                    >
                      <img
                        alt=""
                        className="block max-w-none size-full"
                        src={imgEye}
                      />
                    </div>
                  </button>
                </div>
                <div
                  className="font-['Noto_Sans_JP:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#999999] text-[14px] text-left tracking-[1.4px] w-full"
                  id="node-I1_5961-189_3572-192_3776"
                >
                  <p className="block leading-[1.6]">
                    補足テキストが入ります。
                  </p>
                </div>
              </div>
            </div>

            <div
              className="box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative shrink-0"
              data-name="パスワード"
              id="node-I1_5961-189_3573"
            >
              <div
                className="box-border content-stretch flex flex-row items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0"
                id="node-I1_5961-189_3573-53_1429"
              >
                <div
                  className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]"
                  id="node-I1_5961-189_3573-1_5244"
                >
                  <p className="block leading-[2] whitespace-pre">
                    新規パスワード再入力
                  </p>
                </div>
              </div>
              <div
                className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]"
                id="node-I1_5961-189_3573-192_3827"
              >
                <div
                  className="bg-[#ffffff] box-border content-stretch flex flex-row h-[50px] items-center justify-between p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid"
                  data-name="入力フォーム"
                  id="node-I1_5961-189_3573-1_5245"
                >
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    placeholder="確認のためもう一度入力"
                    className="flex-1 font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[16px] text-left tracking-[1.6px] bg-transparent outline-none"
                  />
                  <button
                    onClick={onToggleConfirmPasswordVisibility}
                    type="button"
                    className="aspect-[120/120] box-border content-stretch flex flex-row gap-2.5 h-full items-center justify-start p-0 relative shrink-0"
                    data-name="eye"
                    id="node-I1_5961-189_3573-1_5284"
                  >
                    <div
                      className="aspect-[120/96.1165] basis-0 grow min-h-px min-w-px relative shrink-0"
                      data-name="Vector"
                      id="node-I1_5961-189_3573-1_5285"
                    >
                      <img
                        alt=""
                        className="block max-w-none size-full"
                        src={imgEye}
                      />
                    </div>
                  </button>
                </div>
                <div
                  className="font-['Noto_Sans_JP:Medium',_sans-serif] font-medium leading-[0] relative shrink-0 text-[#999999] text-[14px] text-left tracking-[1.4px] w-full"
                  id="node-I1_5961-189_3573-192_3776"
                >
                  <p className="block leading-[1.6]">
                    補足テキストが入ります。
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <button
        onClick={onSubmit}
        className={`box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-gradient-to-r from-[#198d76] to-[#1ca74f] ${
          isMobile ? 'w-full' : ''
        }`}
        data-name="通常サイズ_グリーン"
        id={isMobile ? 'node-I1_7246-189_3574' : 'node-I1_5961-189_3574'}
      >
        <div
          className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.6px]"
          id={
            isMobile
              ? 'node-I1_7246-189_3574-1_513'
              : 'node-I1_5961-189_3574-1_513'
          }
        >
          <p className="block font-['Inter:Bold',_'Noto_Sans_JP:Bold',_sans-serif] leading-[1.6] not-italic text-[16px] whitespace-pre">
            設定する
          </p>
        </div>
      </button>
    </div>
  );
}

export default function SignupPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = () => {
    // TODO: Implement password submission logic
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />

      {/* PC Version */}
      <main className="hidden lg:flex flex-grow items-center justify-center bg-gradient-to-t from-[#17856f] to-[#229a4e] relative">
        <div
          className="bg-gradient-to-t box-border content-stretch flex flex-col from-[#17856f] gap-10 items-center justify-start p-[80px] relative size-full to-[#229a4e]"
          id="node-1_5959"
        >
          <div
            className="absolute box-border content-stretch flex flex-col h-[1008px] items-center justify-between left-0 overflow-clip pb-0 pt-10 px-0 top-0 w-[1440px]"
            data-name="背景"
            id="node-1_5960"
          >
            <div
              className="h-40 relative shrink-0 w-[1600px]"
              id="node-I1_5960-222_7107"
            >
              <img alt="" className="block max-w-none size-full" src={img} />
            </div>
            <div
              className="box-border content-stretch flex flex-col h-[440px] items-start justify-start pb-20 pt-0 px-0 relative shrink-0 w-[1600px]"
              id="node-I1_5960-222_7106"
            >
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start mb-[-80px] pl-[140px] pr-0 py-0 relative shrink-0 w-full"
                id="node-I1_5960-222_7100"
              >
                <div
                  className="relative shrink-0 size-[250px]"
                  id="node-I1_5960-222_7101"
                >
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={img1}
                  />
                </div>
              </div>
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-end mb-[-80px] pl-0 pr-[140px] py-0 relative shrink-0 w-full"
                id="node-I1_5960-222_7102"
              >
                <div
                  className="relative shrink-0 size-[350px]"
                  id="node-I1_5960-222_7103"
                >
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={img2}
                  />
                </div>
              </div>
            </div>
            <div
              className="aspect-[1889.89/335] relative shrink-0 w-full"
              data-name="Intersect"
              id="node-I1_5960-222_7083"
            >
              <img alt="" className="block max-w-none size-full" src={img3} />
            </div>
          </div>
          <div
            className="absolute left-[-80px] size-[450px] top-[1150px]"
            id="node-1_5962"
          >
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgEllipse60}
            />
          </div>
          <PasswordFormCard
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
            onToggleConfirmPasswordVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      {/* SP (Mobile) Version */}
      <main className="lg:hidden flex flex-grow items-center justify-center bg-gradient-to-t from-[#17856f] to-[#229a4e] relative">
        <div
          className="bg-gradient-to-t box-border content-stretch flex flex-col from-[#17856f] gap-6 items-center justify-start pb-20 pt-6 px-4 relative size-full to-[#229a4e]"
          id="node-1_7244"
        >
          <div
            className="absolute box-border content-stretch flex flex-col h-[616px] items-center justify-between left-0 overflow-clip pb-10 pt-3 px-0 top-0 w-[393px]"
            data-name="SP背景"
            id="node-1_7245"
          >
            <div
              className="h-32 relative shrink-0 w-[850px]"
              id="node-I1_7245-788_45138"
            >
              <img alt="" className="block max-w-none size-full" src={spImg} />
            </div>
            <div
              className="box-border content-stretch flex flex-col items-start justify-start pb-20 pt-0 px-0 relative shrink-0 w-[850px]"
              id="node-I1_7245-788_45140"
            >
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-start mb-[-80px] pl-[140px] pr-0 py-0 relative shrink-0 w-full"
                id="node-I1_7245-788_45141"
              >
                <div
                  className="relative shrink-0 size-40"
                  id="node-I1_7245-788_45142"
                >
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={spImg1}
                  />
                </div>
              </div>
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-end mb-[-80px] pl-0 pr-[140px] py-0 relative shrink-0 w-full"
                id="node-I1_7245-788_45143"
              >
                <div
                  className="relative shrink-0 size-56"
                  id="node-I1_7245-788_45144"
                >
                  <img
                    alt=""
                    className="block max-w-none size-full"
                    src={spImg2}
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute left-[-80px] size-[450px] top-[1150px]"
            id="node-1_7247"
          >
            <img
              alt=""
              className="block max-w-none size-full"
              src={imgEllipse60}
            />
          </div>
          <PasswordFormCard
            isMobile
            password={password}
            confirmPassword={confirmPassword}
            showPassword={showPassword}
            showConfirmPassword={showConfirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onTogglePasswordVisibility={() => setShowPassword(!showPassword)}
            onToggleConfirmPasswordVisibility={() =>
              setShowConfirmPassword(!showConfirmPassword)
            }
            onSubmit={handleSubmit}
          />
        </div>
      </main>

      <AuthAwareFooter />
    </div>
  );
}
