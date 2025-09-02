import React from 'react';
import Image from 'next/image';

export interface Candidate {
  id: string;
  group: string;
  highlight: boolean;
  changeCareer: boolean;
}

interface CandidateItemProps {
  candidate: Candidate;
}

export const CandidateItem: React.FC<CandidateItemProps> = ({ candidate }) => (
  <div
    className='bg-white w-full p-6 rounded-xl mb-4'
    style={{ boxShadow: '0 0 20px rgba(0,0,0,0.05)' }}
  >
    <div className='flex items-center gap-6'>
      {candidate.highlight && (
        <div className='h-8 flex items-center justify-center bg-[#FF9D00] rounded-full px-5'>
          <span className='text-xs font-bold text-white tracking-wider'>
            注目
          </span>
        </div>
      )}
      {candidate.changeCareer && (
        <div className='h-8 flex items-center justify-center bg-[#44B0EF] rounded-full px-5 gap-2'>
          <Image
            src='/rotate.svg'
            alt='キャリアチェンジアイコン'
            width={16}
            height={16}
            className='block'
          />
          <span className='text-xs font-bold text-white tracking-wider'>
            キャリアチェンジ志向
          </span>
        </div>
      )}
    </div>
  </div>
);
