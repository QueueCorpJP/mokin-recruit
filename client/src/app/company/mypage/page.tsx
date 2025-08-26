import { Navigation } from '@/components/ui/navigation';
import { Footer } from '@/components/ui/footer';
import React from 'react';

export default function CompanyMypage() {
  return (
    <>
      <Navigation variant='company' />
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
            {/* 左カラム（メイン） */}
            <div className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
              {/* ここに会社用のメインコンテンツを配置 */}
              <div
                style={{
                  height: 300,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#999' }}>左カラム（メイン）ダミー</span>
              </div>
            </div>
            {/* 右カラム（サブ） */}
            <div className='w-full md:max-w-[320px] md:flex-none'>
              {/* ここに会社用のサブコンテンツを配置 */}
              <div
                style={{
                  height: 300,
                  background: '#fff',
                  borderRadius: 8,
                  boxShadow: '0 0 20px rgba(0,0,0,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <span style={{ color: '#999' }}>右カラム（サブ）ダミー</span>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Footer variant='company' />
    </>
  );
}
