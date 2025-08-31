'use client';

import React, { useState } from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { NewMessageList } from './NewMessageList';
import { Message } from './NewMessageItem';
import { CandidateCard, CandidateData } from '@/components/company/CandidateCard';
import { CompanyTaskSidebar } from '@/components/company/CompanyTaskSidebar';

export default function CompanyMypage() {
  // ダミーデータ
  const mockCandidates: CandidateData[] = [
    {
      id: 1,
      isPickup: false,
      isHidden: false,
      isAttention: true,
      badgeType: 'change' as const,
      badgeText: 'キャリアチェンジ志向',
      lastLogin: '1時間前',
      companyName: '直近企業名テキスト直近企業名テキスト',
      department: '部署名テキスト部署名テキスト部署名テキスト',
      position: '役職名テキスト役職名テキスト役職名テキスト',
      location: '東京',
      age: '28歳',
      gender: '男性',
      salary: '500〜600万円',
      university: '青山大学',
      degree: '大学卒',
      language: '英語',
      languageLevel: 'ネイティブ',
      experienceJobs: ['職種テキスト', '職種テキスト', '職種テキスト'],
      experienceIndustries: ['業種テキスト', '業種テキスト', '業種テキスト'],
      careerHistory: [
        {
          period: 'yyyy/mm〜現在',
          company: '企業名テキスト企業名テキスト',
          role: '役職名テキスト役職名テキスト',
        },
        {
          period: 'yyyy/mm〜現在',
          company: '企業名テキスト企業名テキスト',
          role: '役職名テキスト役職名テキスト',
        },
        {
          period: 'yyyy/mm〜現在',
          company: '企業名テキスト企業名テキスト',
          role: '役職名テキスト役職名テキスト',
        },
      ],
      selectionCompanies: [
        {
          company: '企業名テキスト企業名テキスト',
          detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
        },
        {
          company: '企業名テキスト企業名テキスト',
          detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
        },
        {
          company: '企業名テキスト企業名テキスト',
          detail: '職種テキスト、職種テキスト、職種テキスト職種テキスト',
        },
      ],
    },
  ];

  const [candidates, setCandidates] = useState(mockCandidates);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const togglePickup = (id: number) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, isPickup: !c.isPickup } : c))
    );
  };

  const toggleHidden = (id: number) => {
    setCandidates(prev =>
      prev.map(c => (c.id === id ? { ...c, isHidden: !c.isHidden } : c))
    );
  };

  const toggleTooltip = () => {
    setIsTooltipVisible(!isTooltipVisible);
  };

  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          {/* 左カラム（メイン） */}
          <div className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
            {/* 新着メッセージ 見出し */}
            <SectionHeading
              iconSrc='/images/mail.svg'
              iconAlt='新着メッセージアイコン'
            >
              新着メッセージ
            </SectionHeading>
            {/* ダミーデータ */}
            {(() => {
              const messages: Message[] = [
                {
                  id: '1',
                  date: '2025/08/27',
                  group: 'グループ名',
                  user: 'ユーザー名',
                  content: 'メッセージ内容がここに入ります',
                },
                {
                  id: '2',
                  date: '2025/08/26',
                  group: 'グループ名2',
                  user: 'ユーザー名2',
                  content: '別のメッセージ内容がここに入ります',
                },
                {
                  id: '3',
                  date: '2025/08/25',
                  group: 'グループ名3',
                  user: 'ユーザー名3',
                  content: '三つ目のメッセージ内容がここに入ります',
                },
              ];
              return <NewMessageList messages={messages} />;
            })()}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 24,
              }}
            >
              <Button
                variant='green-outline'
                size='lg'
                style={{
                  paddingLeft: 40,
                  paddingRight: 40,
                  height: 60,
                  borderRadius: '999px',
                }}
              >
                メッセージ一覧
              </Button>
            </div>
            {/* おすすめの候補者 見出し */}
            <div className='mt-20'>
              <div className='flex flex-row items-center pb-2 border-b-2 border-[#DCDCDC]'>
                <div className='flex flex-row items-center gap-3'>
                  <img
                    src='/images/user-1.svg'
                    alt='おすすめの候補者アイコン'
                    width={24}
                    height={25}
                    style={{ display: 'block' }}
                  />
                  <span 
                    className='text-[18px] font-bold text-[#222]'
                    style={{ 
                      fontFamily: 'Noto Sans JP, sans-serif',
                      letterSpacing: '0.04em',
                      lineHeight: 1.4
                    }}
                  >
                    おすすめの候補者
                  </span>
                </div>
                <div className='relative ml-2'>
                  <button onClick={toggleTooltip} className='flex items-center justify-center'>
                    <img 
                      src='/images/question.svg' 
                      alt='クエスチョンアイコン' 
                      className='w-4 h-4' 
                    />
                  </button>
                  {isTooltipVisible && (
                    <div 
                      className='absolute left-8 -top-2 z-10 w-80 flex flex-col items-start justify-center rounded-[5px] bg-[#F0F9F3] p-4'
                      style={{ 
                        boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.05)',
                        border: '1px solid #E5E5E5'
                      }}
                    >
                      <h3 
                        className='font-bold text-[14px] text-[#323232] mb-2'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        おすすめの候補者
                      </h3>
                      <p 
                        className='text-[12px] text-[#323232] leading-relaxed'
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        保存した候補者の検索条件にマッチする候補者を表示しています。
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          
            {/* 区切り線 */}
            <div className='border-t border-gray-300 mb-6' />
           
            {/* 候補者カード */}
            <div className="space-y-2">
              {candidates.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  onTogglePickup={togglePickup}
                  onToggleHidden={toggleHidden}
                  showActions={true}
                />
              ))}
            </div>
          </div>
          {/* 右カラム（サブ） */}
          <CompanyTaskSidebar className="md:flex-none" showTodoAndNews={true} />
        </div>
      </main>
    </div>
  );
}
