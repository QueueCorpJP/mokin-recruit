'use client';

import { useState } from 'react';
import SearchForm from "./SearchForm";
import { useSearchStore } from '../../../stores/searchStore';

export default function Search() {
  const { searchGroup, keyword, experienceJobTypes, experienceIndustries, desiredJobTypes, desiredIndustries } = useSearchStore();

  const getSearchConditionText = () => {
    const conditions = [];
    
    if (searchGroup) conditions.push(`グループ: ${searchGroup}`);
    if (keyword) conditions.push(`キーワード: ${keyword}`);
    if (experienceJobTypes.length > 0) conditions.push(`経験職種: ${experienceJobTypes.map(j => j.name).join(', ')}`);
    if (experienceIndustries.length > 0) conditions.push(`経験業界: ${experienceIndustries.map(i => i.name).join(', ')}`);
    if (desiredJobTypes.length > 0) conditions.push(`希望職種: ${desiredJobTypes.map(j => j.name).join(', ')}`);
    if (desiredIndustries.length > 0) conditions.push(`希望業界: ${desiredIndustries.map(i => i.name).join(', ')}`);
    
    return conditions.length > 0 ? conditions.join(' | ') : '検索条件を設定してください';
  };

  return (
    <div className="w-full bg-[#F9F9F9]">
     
    <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
    <div className="w-full max-w-[1280px] mx-auto">
      <div className="w-full max-w-[1280px] mx-auto">
        <div className="flex items-center gap-4">
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.0013 12.9967C26.0013 15.8656 25.07 18.5157 23.5011 20.6659L31.414 28.585C32.1953 29.3663 32.1953 30.6351 31.414 31.4164C30.6327 32.1977 29.3639 32.1977 28.5826 31.4164L20.6698 23.4972C18.5197 25.0723 15.8695 25.9974 13.0006 25.9974C5.81903 25.9974 0 20.1783 0 12.9967C0 5.81513 5.81903 -0.00390625 13.0006 -0.00390625C20.1822 -0.00390625 26.0013 5.81513 26.0013 12.9967ZM13.0006 21.9972C14.1826 21.9972 15.353 21.7644 16.445 21.312C17.5369 20.8597 18.5291 20.1968 19.3649 19.361C20.2007 18.5252 20.8636 17.533 21.316 16.441C21.7683 15.3491 22.0011 14.1787 22.0011 12.9967C22.0011 11.8148 21.7683 10.6444 21.316 9.55241C20.8636 8.46043 20.2007 7.46822 19.3649 6.63246C18.5291 5.79669 17.5369 5.13372 16.445 4.68141C15.353 4.22909 14.1826 3.99629 13.0006 3.99629C11.8187 3.99629 10.6483 4.22909 9.55632 4.68141C8.46433 5.13372 7.47213 5.79669 6.63636 6.63246C5.8006 7.46822 5.13763 8.46043 4.68531 9.55241C4.233 10.6444 4.0002 11.8148 4.0002 12.9967C4.0002 14.1787 4.233 15.3491 4.68531 16.441C5.13763 17.533 5.8006 18.5252 6.63636 19.361C7.47213 20.1968 8.46433 20.8597 9.55632 21.312C10.6483 21.7644 11.8187 21.9972 13.0006 21.9972Z"
              fill="white"
            />
          </svg>

          <h1
            className="text-white text-[24px] font-bold tracking-[2.4px]"
            style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
          >
            候補者検索
          </h1>
        </div>
       
      </div>
            

    </div>
    
   </div>
   <div className="w-full max-w-[1280px] mx-auto p-10">
     <SearchForm />
   </div>
</div>
  );
}



