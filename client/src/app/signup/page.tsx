'use client';

import { Navigation } from '@/components/ui/navigation';
import { AuthAwareFooter } from '@/components/layout/AuthAwareFooter';
import { CandidateAuthBackground } from '@/components/ui/candidate-auth-background';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import Link from 'next/link';

interface TitleSectionProps {
  isMobile?: boolean;
}

function TitleSection({ isMobile = false }: TitleSectionProps) {
  return (
    <div
      className="relative shrink-0 text-[#0f9058] text-center w-full"
      id={isMobile ? 'node-I1_7240-189_3453-788_44958' : 'node-1_579'}
    >
      <p
        className={`block leading-[1.6] ${
          isMobile
            ? 'text-[24px] tracking-[2.4px]'
            : 'text-[32px] tracking-[3.2px]'
        } font-['Noto_Sans_JP:Bold',_sans-serif] font-bold`}
      >
        新規会員登録
      </p>
    </div>
  );
}

interface EmailInputFieldProps {
  isMobile?: boolean;
  value: string;
  onChange: (value: string) => void;
}

function EmailInputField({
  isMobile = false,
  value,
  onChange,
}: EmailInputFieldProps) {
  if (isMobile) {
    return (
      <div
        className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full"
        data-name="縦並び_通常"
        id="node-I1_7240-189_3455"
      >
        <div
          className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[14px] text-left tracking-[1.4px] w-full"
          id="node-I1_7240-189_3455-82_2002"
        >
          <p className="block leading-[2]">メールアドレス</p>
        </div>
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="name@example.com"
          className="bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[14px] text-left tracking-[1.4px] focus:outline-none focus:border-[#0f9058]"
          data-name="入力フォーム"
          id="node-I1_7240-189_3455-82_2003"
        />
      </div>
    );
  }

  return (
    <div
      className="box-border content-stretch flex flex-col md:flex-row gap-4 items-start justify-start p-0 relative shrink-0"
      data-name="プロパティ1=横並び, プロパティ2=デフォルト"
      id="node-1_601"
    >
      <div
        className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0"
        id="node-1_602"
      >
        <div
          className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]"
          id="node-1_603"
        >
          <p className="block leading-[2] whitespace-pre">メールアドレス</p>
        </div>
      </div>
      <div
        className="box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-full md:w-[400px]"
        id="node-1_604"
      >
        <input
          type="email"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="name@example.com"
          className="bg-[#ffffff] box-border content-stretch cursor-pointer flex flex-row gap-2.5 items-center justify-start overflow-visible p-[11px] relative rounded-[5px] shrink-0 w-full border border-[#999999] border-solid font-['Noto_Sans_JP:Medium',_sans-serif] font-medium text-[16px] text-left tracking-[1.6px] focus:outline-none focus:border-[#0f9058]"
          data-name="入力フォーム"
          id="node-1_605"
        />
      </div>
    </div>
  );
}

interface AgreementCheckboxProps {
  isMobile?: boolean;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function AgreementCheckbox({
  isMobile = false,
  checked,
  onChange,
}: AgreementCheckboxProps) {
  return (
    <div className="flex flex-row gap-2 items-start justify-start">
      <Checkbox
        checked={checked}
        onChange={onChange}
        className="mt-0.5"
      />
      <div className="flex flex-wrap items-center justify-start">
        <Link
          href="/candidate/auth/terms"
          className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold text-[#323232] text-[14px] tracking-[1.4px] underline mr-1"
        >
          利用規約
        </Link>
        <span className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold text-[#323232] text-[14px] tracking-[1.4px] mr-1">
          ・
        </span>
        <Link
          href="/candidate/auth/privacy"
          className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold text-[#323232] text-[14px] tracking-[1.4px] underline mr-1"
        >
          個人情報の取扱い
        </Link>
        <span className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold text-[#323232] text-[14px] tracking-[1.4px]">
          に同意する
        </span>
      </div>
    </div>
  );
}

interface SubmitButtonProps {
  isMobile?: boolean;
}

function SubmitButton({ isMobile = false }: SubmitButtonProps) {
  return (
    <div
      className={`box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 ${
        isMobile ? 'w-full' : ''
      } bg-gradient-to-r from-[#198d76] to-[#1ca74f]`}
      data-name="通常サイズ_グリーン"
      id={isMobile ? 'node-I1_7240-189_3457' : 'node-I1_5889-189_3457'}
    >
      <div
        className="font-['Noto_Sans_JP:Bold',_sans-serif] font-bold leading-[0] relative shrink-0 text-[#ffffff] text-[0px] text-center text-nowrap tracking-[1.6px]"
        id={
          isMobile
            ? 'node-I1_7240-189_3457-1_513'
            : 'node-I1_5889-189_3457-1_513'
        }
      >
        <p className="block font-['Inter:Bold',_'Noto_Sans_JP:Bold',_sans-serif] leading-[1.6] not-italic text-[16px] whitespace-pre">
          会員登録（無料）
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation variant="candidate" isLoggedIn={false} userInfo={undefined} />
      
      <CandidateAuthBackground>
        {/* メインコンテンツ */}
        <main className='flex-1 px-4 sm:px-6 md:px-[80px] pt-6 md:pt-[80px] mb-20 lg:mb-0 lg:pb-[460px] flex justify-center items-start relative w-full'>
          {/* フォームコンテナ */}
          <div className="bg-[#ffffff] box-border content-stretch flex flex-col gap-10 items-center justify-start p-6 md:p-[80px] relative rounded-3xl md:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] shrink-0 w-full max-w-[480px] md:max-w-[800px] mx-auto">
            <div
              className="box-border content-stretch flex flex-col gap-2 md:gap-6 items-center justify-start p-0 relative shrink-0 w-full"
              data-name="見出し+説明"
            >
              <TitleSection isMobile={false} />
            </div>
            <div
              className="box-border content-stretch flex flex-col gap-6 items-center justify-start p-0 relative shrink-0 w-full"
            >
              <EmailInputField value={email} onChange={setEmail} />
              <div
                className="box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0"
                data-name="プラポリ"
              >
                <AgreementCheckbox checked={agreed} onChange={setAgreed} />
              </div>
            </div>
            <SubmitButton />
          </div>
        </main>
      </CandidateAuthBackground>

      <AuthAwareFooter />
    </div>
  );
}
