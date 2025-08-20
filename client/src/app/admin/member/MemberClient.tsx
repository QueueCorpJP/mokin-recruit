'use client';

import { useState } from 'react';

const userIcon =
  'http://localhost:3845/assets/4ac1f1371e0fe963f2fed64d4c41acd59fa8b23c.svg';
const workIcon =
  'http://localhost:3845/assets/d8b99409a0d1bde5b0ce75dddf1a109c278179f8.svg';
const billIcon =
  'http://localhost:3845/assets/14f287a9b53a7fb0f56e3299fa063c98ac1d2e96.svg';
const bagIcon =
  'http://localhost:3845/assets/39aeb0e21189e7d9e191901bdcc7e89f0fc017bd.svg';
const tagIcon =
  'http://localhost:3845/assets/0a73ee4df7a970150b5fb34e877289f43706f9e4.svg';
const flagIcon =
  'http://localhost:3845/assets/cac0bfb39cc3bd077488c0332eab146430c291b7.svg';
const profileIcon =
  'http://localhost:3845/assets/98fb4c0041b233568a10b2e3c7d7ddd686738941.svg';
const arrowDownIcon =
  'http://localhost:3845/assets/b8ec927e1b16d99a848effc5e2833c8d0e7ca488.svg';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  isActive: boolean;
}

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  description?: string;
}

function FormField({ label, children, description }: FormFieldProps) {
  return (
    <div className='box-border content-stretch flex flex-row gap-4 items-start justify-start p-0 relative w-full'>
      <div className='box-border content-stretch flex flex-row gap-2.5 items-center justify-center pb-0 pt-[11px] px-0 relative shrink-0'>
        <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
          <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
            {label}
          </p>
        </div>
      </div>
      <div className='box-border content-stretch flex flex-col gap-2 items-start justify-start p-0 relative shrink-0 w-[400px]'>
        {children}
        {description && (
          <div className="font-['Noto_Sans_JP:Medium',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#999999] text-[14px] text-left tracking-[1.4px] w-full">
            <p className='block leading-[1.6]'>{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({ placeholder }: { placeholder: string }) {
  return (
    <div className='basis-0 bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 grow items-center justify-start min-h-px min-w-[120px] p-[11px] relative rounded-[5px] shrink-0'>
      <div
        aria-hidden='true'
        className='absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]'
      />
      <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#999999] text-[16px] text-left text-nowrap tracking-[1.6px]">
        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
          {placeholder}
        </p>
      </div>
    </div>
  );
}

function SelectField({ placeholder }: { placeholder: string }) {
  return (
    <div className='basis-0 bg-[#ffffff] box-border content-stretch flex flex-row gap-4 grow items-center justify-start min-h-px min-w-px pl-[11px] pr-4 py-[11px] relative rounded-[5px] shrink-0'>
      <div
        aria-hidden='true'
        className='absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]'
      />
      <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
          {placeholder}
        </p>
      </div>
      <div className='flex flex-row items-center self-stretch'>
        <div className='box-border content-stretch flex flex-col h-full items-center justify-start pb-0 pt-3 px-0 relative shrink-0 w-3.5'>
          <div className='h-[9.333px] relative shrink-0 w-3.5'>
            <img
              alt=''
              className='block max-w-none size-full'
              src={arrowDownIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function GenderButton({
  label,
  isSelected = false,
}: {
  label: string;
  isSelected?: boolean;
}) {
  return (
    <button className='basis-0 bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 grow items-center justify-center min-h-px min-w-px overflow-visible p-[11px] relative rounded-[5px] shrink-0'>
      <div
        aria-hidden='true'
        className='absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]'
      />
      <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#999999] text-[16px] text-left text-nowrap tracking-[1.6px]">
        <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
          {label}
        </p>
      </div>
    </button>
  );
}

function TextArea({ placeholder }: { placeholder: string }) {
  return (
    <div className='bg-[#ffffff] box-border content-stretch flex flex-row gap-2.5 items-center justify-start p-[11px] relative rounded-[5px] w-full'>
      <div
        aria-hidden='true'
        className='absolute border border-[#999999] border-solid inset-0 pointer-events-none rounded-[5px]'
      />
      <div className="basis-0 font-['Noto_Sans_JP:Medium',_sans-serif] grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[#999999] text-[16px] text-left tracking-[1.6px]">
        <p className='block leading-[2]'>{placeholder}</p>
      </div>
    </div>
  );
}

function TabNavigation({ tabs }: { tabs: TabItem[] }) {
  return (
    <div className='box-border content-stretch flex flex-row items-center justify-start p-0 relative w-full h-[45px]'>
      {tabs.map(tab => (
        <div
          key={tab.id}
          className='basis-0 box-border content-stretch flex flex-row gap-2 grow items-center justify-center min-h-px min-w-px px-6 py-2 relative shrink-0'
        >
          <div
            aria-hidden='true'
            className={`absolute border-solid inset-0 pointer-events-none ${
              tab.isActive
                ? 'border-[#0f9058] border-[0px_0px_2px]'
                : 'border-[#dcdcdc] border-[0px_0px_2px]'
            }`}
          />
          <div className='box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative shrink-0 size-6'>
            <div className='aspect-[48/54] h-full relative shrink-0'>
              <img
                alt=''
                className='block max-w-none size-full'
                src={tab.icon}
              />
            </div>
          </div>
          <div
            className={`font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[18px] text-center text-nowrap tracking-[1.8px] ${
              tab.isActive ? 'text-[#0f9058]' : 'text-[#dcdcdc]'
            }`}
          >
            <p className='adjustLetterSpacing block leading-[1.6] whitespace-pre'>
              {tab.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MemberClient() {
  const [selectedTab, setSelectedTab] = useState('basic');

  const tabs: TabItem[] = [
    {
      id: 'basic',
      label: '基本情報',
      icon: userIcon,
      isActive: selectedTab === 'basic',
    },
    {
      id: 'activity',
      label: '転職活動状況',
      icon: workIcon,
      isActive: selectedTab === 'activity',
    },
    {
      id: 'company',
      label: '直近の在籍企業',
      icon: billIcon,
      isActive: selectedTab === 'company',
    },
    {
      id: 'history',
      label: '経歴詳細',
      icon: bagIcon,
      isActive: selectedTab === 'history',
    },
    {
      id: 'skills',
      label: '資格・語学・スキル',
      icon: tagIcon,
      isActive: selectedTab === 'skills',
    },
    {
      id: 'conditions',
      label: '希望条件',
      icon: flagIcon,
      isActive: selectedTab === 'conditions',
    },
    {
      id: 'summary',
      label: '職務要約',
      icon: profileIcon,
      isActive: selectedTab === 'summary',
    },
  ];

  return (
    <div className='bg-[#ffffff] box-border content-stretch flex flex-col-reverse gap-10 items-center justify-start p-[80px] relative rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] size-full'>
      {/* Header */}
      <div className='box-border content-stretch flex flex-col gap-6 items-center justify-start order-5 p-0 relative shrink-0 w-full'>
        <div className='relative shrink-0 text-[#0f9058] text-[32px] tracking-[3.2px] w-full text-center'>
          <p className="block leading-[1.6] font-['Noto_Sans_JP:Bold',_sans-serif] font-bold">
            会員情報
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className='box-border content-stretch flex flex-row h-[45px] items-center justify-start order-4 p-0 relative shrink-0 w-full'>
        <TabNavigation tabs={tabs} />
      </div>

      {/* Instructions */}
      <div className='box-border content-stretch flex flex-col gap-6 items-center justify-start order-3 p-0 relative shrink-0 w-full'>
        <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[2] not-italic relative shrink-0 text-[#323232] text-[16px] text-center tracking-[1.6px] w-full">
          <p className='block mb-0'>あなたの基本情報を教えてください。</p>
          <p className='block mb-0'>
            ※氏名はスカウトに返信した場合のみ企業に開示されます
          </p>
          <p className='block'>※電話番号は企業には公開されません</p>
        </div>
      </div>

      {/* Form */}
      <div className='box-border content-stretch flex flex-col-reverse gap-6 items-end justify-start order-2 p-0 relative shrink-0'>
        {/* 氏名 */}
        <FormField
          label='氏名'
          description='※登録後の変更は不可となっております。'
        >
          <div className='[flex-flow:wrap] box-border content-start flex gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
            <InputField placeholder='姓' />
            <InputField placeholder='名' />
          </div>
        </FormField>

        {/* フリガナ */}
        <FormField
          label='フリガナ'
          description='※登録後の変更は不可となっております。'
        >
          <div className='[flex-flow:wrap] box-border content-start flex gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
            <InputField placeholder='セイ' />
            <InputField placeholder='メイ' />
          </div>
        </FormField>

        {/* 性別 */}
        <FormField label='性別'>
          <div className='box-border content-stretch cursor-pointer flex flex-row gap-2 items-start justify-start p-0 relative shrink-0 w-full'>
            <GenderButton label='男性' />
            <GenderButton label='女性' />
            <GenderButton label='未回答' />
          </div>
        </FormField>

        {/* 現在の住まい */}
        <FormField label='現在の住まい'>
          <div className='box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full'>
            <SelectField placeholder='未選択' />
          </div>
        </FormField>

        {/* 生年月日 */}
        <FormField label='生年月日'>
          <div className='[flex-flow:wrap] box-border content-center flex gap-2 items-center justify-start p-0 relative shrink-0 w-[400px]'>
            <SelectField placeholder='未選択' />
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
              <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                年
              </p>
            </div>
            <SelectField placeholder='未選択' />
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
              <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                月
              </p>
            </div>
            <SelectField placeholder='未選択' />
            <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]">
              <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
                日
              </p>
            </div>
          </div>
        </FormField>

        {/* 連絡先電話番号 */}
        <FormField
          label='連絡先電話番号'
          description='※「-」なしでご入力ください。'
        >
          <TextArea placeholder='08011112222' />
        </FormField>

        {/* 現在の年収 */}
        <FormField label='現在の年収'>
          <div className='box-border content-stretch flex flex-row gap-2 items-center justify-start p-0 relative shrink-0 w-full'>
            <SelectField placeholder='未選択' />
          </div>
        </FormField>
      </div>

      {/* Next Button */}
      <button className='box-border content-stretch flex flex-row gap-2.5 items-center justify-center min-w-40 order-1 px-10 py-3.5 relative rounded-[32px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] shrink-0 bg-gradient-to-r from-[#0f9058] to-[#0f9058]'>
        <div className="font-['Noto_Sans_JP:Bold',_sans-serif] leading-[0] not-italic relative shrink-0 text-[#ffffff] text-[16px] text-center text-nowrap tracking-[1.6px]">
          <p className='adjustLetterSpacing block leading-[2] whitespace-pre'>
            次へ
          </p>
        </div>
      </button>
    </div>
  );
}
