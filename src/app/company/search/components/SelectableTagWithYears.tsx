'use client';

import React from 'react';

interface SelectableTagWithYearsProps {
  id: string;
  name: string;
  experienceYears?: string;
  onYearsChange: (id: string, years: string) => void;
  onRemove: (id: string) => void;
  openSelectId?: string | null;
  setOpenSelectId?: (id: string | null) => void;
  selectIdPrefix?: string;
}

export default function SelectableTagWithYears({
  id,
  name,
  experienceYears,
  onYearsChange,
  onRemove,
  openSelectId,
  setOpenSelectId,
  selectIdPrefix = 'tag',
}: SelectableTagWithYearsProps) {
  const selectId = `${selectIdPrefix}-${id}`;
  const isOpen = openSelectId === selectId;

  return (
    <div className="inline-flex items-center gap-1">
      <span className="bg-[#d2f1da] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 rounded-l-[10px] overflow-hidden max-w-[200px]">
        <span className="line-clamp-1 break-all">{name}</span>
      </span>
      <div className="bg-[#d2f1da] h-[40px] flex items-center px-4 relative">
        <select
          className="bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none pr-8 cursor-pointer focus:outline-none border-none w-full"
          value={experienceYears || ''}
          onFocus={() => setOpenSelectId?.(selectId)}
          onBlur={() => setOpenSelectId?.(null)}
          onChange={(e) => {
            onYearsChange(id, e.target.value);
            setOpenSelectId?.(null);
          }}
        >
          <option value="">経験年数：未選択</option>
          <option value="1年">経験年数：1年</option>
          <option value="2年">経験年数：2年</option>
          <option value="3年">経験年数：3年</option>
          <option value="4年">経験年数：4年</option>
          <option value="5年">経験年数：5年</option>
          <option value="6年">経験年数：6年</option>
          <option value="7年">経験年数：7年</option>
          <option value="8年">経験年数：8年</option>
          <option value="9年">経験年数：9年</option>
          <option value="10年">経験年数：10年</option>
          <option value="11年">経験年数：11年</option>
          <option value="12年">経験年数：12年</option>
          <option value="13年">経験年数：13年</option>
          <option value="14年">経験年数：14年</option>
          <option value="15年">経験年数：15年</option>
          <option value="16年">経験年数：16年</option>
          <option value="17年">経験年数：17年</option>
          <option value="18年">経験年数：18年</option>
          <option value="19年">経験年数：19年</option>
          <option value="20年以上">経験年数：20年以上</option>
        </select>
        <svg
          className={`absolute right-2 pointer-events-none transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          width="14"
          height="10"
          viewBox="0 0 14 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.07178 8.90462L0.234161 1.71483C-0.339509 1.00828 0.206262 0 1.16238 0H12.8376C13.7937 0 14.3395 1.00828 13.7658 1.71483L7.92822 8.90462C7.46411 9.47624 6.53589 9.47624 6.07178 8.90462Z"
            fill="#0F9058"
          />
        </svg>
      </div>
      <button
        type="button"
        onClick={() => onRemove(id)}
        className="bg-[#d2f1da] flex items-center justify-center w-10 h-[40px] rounded-r-[10px]"
      >
        <svg
          width="13"
          height="12"
          viewBox="0 0 13 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z"
            fill="#0F9058"
          />
        </svg>
      </button>
    </div>
  );
}