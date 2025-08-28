import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import React from 'react';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { NewMessageList } from './NewMessageList';
import { Message } from './NewMessageItem';
import { CandidateList } from './CandidateList';
import { Candidate } from './CandidateItem';
import { Sidebar } from './Sidebar';

export default function CompanyMypage() {
  return (
    <>
      <Navigation variant='company' />
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
                <SectionHeading
                  iconSrc='/images/user-1.svg'
                  iconAlt='おすすめの候補者アイコン'
                >
                  おすすめの候補者
                </SectionHeading>
              </div>
              {/* ダミーデータ */}
              {(() => {
                const candidates: Candidate[] = [
                  {
                    id: '1',
                    group: 'グループ名',
                    highlight: true,
                    changeCareer: true,
                  },
                ];
                return <CandidateList candidates={candidates} />;
              })()}
            </div>
            {/* 右カラム（サブ） */}
            <Sidebar />
          </div>
        </main>
      </div>
      <Footer variant='company' />
    </>
  );
}
