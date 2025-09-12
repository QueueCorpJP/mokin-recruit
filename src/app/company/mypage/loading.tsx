'use client';

import React from 'react';

export default function Loading() {
  return (
    <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
      <main className='w-full max-w-[1280px] mx-auto'>
        <div className='flex flex-col md:flex-row gap-10 md:gap-20 w-full justify-center items-stretch md:items-start'>
          {/* 左カラムスケルトン */}
          <div className='w-full max-w-[880px] flex-1 box-border md:px-6 px-0'>
            <div className='h-7 w-40 bg-gray-200 rounded animate-pulse mb-4' />
            <div className='flex flex-col gap-2 mt-2 mb-6'>
              {[0,1,2].map((i) => (
                <div key={i} className='w-full bg-white px-6 py-4 rounded-lg' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
                  <div className='flex items-center gap-6'>
                    <div className='w-16 h-3 bg-gray-200 animate-pulse rounded' />
                    <div className='w-40 h-8 bg-gray-200 animate-pulse rounded' />
                    <div className='w-28 h-4 bg-gray-200 animate-pulse rounded' />
                    <div className='flex-1 h-4 bg-gray-100 animate-pulse rounded' />
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-10 mb-4 h-6 w-48 bg-gray-200 rounded animate-pulse' />
            <div className='space-y-6'>
              {[0,1].map((i) => (
                <div key={i} className='bg-[#EFEFEF] p-6 rounded-[24px]'>
                  <div className='flex gap-6 items-start mb-6'>
                    <div className='w-40 h-8 bg-[#d9ead3] rounded-[8px] animate-pulse' />
                    <div className='flex-1 h-6 bg-gray-200 rounded animate-pulse' />
                  </div>
                  <div className='space-y-4'>
                    {[0,1,2].map((j) => (
                      <div key={j} className='bg-white p-6 rounded-[10px] shadow-sm'>
                        <div className='h-5 bg-gray-200 rounded w-1/3 mb-2 animate-pulse' />
                        <div className='h-4 bg-gray-100 rounded w-2/3 animate-pulse' />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 右カラムスケルトン */}
          <div className='w-full md:w-[360px] min-w-[280px]'>
            <div className='bg-white rounded-xl p-6 mb-6' style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}>
              <div className='h-5 w-32 bg-gray-200 rounded animate-pulse mb-4' />
              <div className='space-y-3'>
                {[0,1,2,3].map((k) => (
                  <div key={k} className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


