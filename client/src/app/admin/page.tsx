'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function AdminPage() {
  const [memo, setMemo] = useState('');

  return (
    <div className='min-h-screen'>
      {/* 要対応リストセクション */}
      <div className='mb-8'>
        <h2
          style={{
            color: '#323232',
            fontFamily: 'Inter',
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            marginBottom: '24px',
          }}
        >
          要対応リスト
        </h2>

        <div className='flex gap-4'>
          <Link
            href='/admin/job'
            className='bg-[#0c0c0c] hover:bg-[#333] transition-colors rounded-md px-3 py-2'
          >
            <span
              style={{
                color: '#ffffff',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              求人
            </span>
            <span
              style={{
                color: '#323232',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 1.6,
                marginLeft: '8px',
              }}
            >
              (21)
            </span>
          </Link>

          <Link
            href='/admin/message'
            className='bg-[#0c0c0c] hover:bg-[#333] transition-colors rounded-md px-3 py-2'
          >
            <span
              style={{
                color: '#ffffff',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              メッセージ
            </span>
            <span
              style={{
                color: '#323232',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 1.6,
                marginLeft: '8px',
              }}
            >
              (33)
            </span>
          </Link>

          <Link
            href='/admin/candidate'
            className='bg-[#0c0c0c] hover:bg-[#333] transition-colors rounded-md px-3 py-2'
          >
            <span
              style={{
                color: '#ffffff',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 1.6,
              }}
            >
              レジュメ
            </span>
            <span
              style={{
                color: '#323232',
                fontFamily: 'Inter',
                fontSize: '16px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 1.6,
                marginLeft: '8px',
              }}
            >
              (5)
            </span>
          </Link>
        </div>
      </div>

      {/* 運営メモセクション */}
      <div>
        <h2
          style={{
            color: '#323232',
            fontFamily: 'Inter',
            fontSize: '32px',
            fontStyle: 'normal',
            fontWeight: 700,
            lineHeight: 'normal',
            marginBottom: '24px',
          }}
        >
          運営メモ
        </h2>

        <div className='bg-white border border-black p-4 h-32'>
          <textarea
            value={memo}
            onChange={e => setMemo(e.target.value)}
            placeholder='運営に関するメモを自由に入力できます。'
            className='w-full h-full border-none outline-none resize-none bg-transparent'
            style={{
              color: memo ? '#323232' : '#bababa',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>
    </div>
  );
}
