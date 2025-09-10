import React from 'react';

interface TagItem {
  id: string;
  name: string;
  experienceYears?: string;
}

interface TagListProps {
  items: TagItem[];
  onRemove: (id: string) => void;
  onChangeExperience: (id: string, years: string) => void;
  experienceOptions: string[];
  experienceLabel?: string; // e.g. '経験年数'
  className?: string;
}

export const TagList: React.FC<TagListProps> = ({
  items,
  onRemove,
  onChangeExperience,
  experienceOptions,
  experienceLabel = '経験年数',
  className = '',
}) => {
  if (!items || items.length === 0) return null;
  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {items.map(item => (
        <div key={item.id} className='inline-flex items-center gap-[2px]'>
          <div className='flex items-start md:items-center flex-col md:flex-row w-full gap-[2px]'>
            <span className='bg-[#d2f1da] rounded-tl-[10px] md:rounded-l-[10px] text-[#0f9058] text-[14px] font-bold tracking-[1.4px] h-[40px] flex items-center px-6 w-full sm:max-w-none overflow-hidden text-ellipsis whitespace-nowrap'>
              {item.name}
            </span>
            <div className='bg-[#d2f1da] h-[40px] flex items-center px-4 relative rounded-bl-[10px] md:rounded-b-none w-full'>
              <select
                className='bg-transparent text-[#0f9058] text-[14px] font-medium tracking-[1.4px] appearance-none cursor-pointer focus:outline-none w-full'
                value={item.experienceYears || ''}
                onChange={e => onChangeExperience(item.id, e.target.value)}
              >
                <option value=''>{experienceLabel}：未選択</option>
                {experienceOptions.map(year => (
                  <option key={year} value={year}>
                    {experienceLabel}：{year}
                  </option>
                ))}
              </select>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='14'
                height='10'
                viewBox='0 0 14 10'
                fill='none'
                className='absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none'
              >
                <path d='M7 10L0 0H14L7 10Z' fill='#0f9058' />
              </svg>
            </div>
          </div>
          <button
            type='button'
            onClick={() => onRemove(item.id)}
            className='bg-[#d2f1da] flex items-center justify-center w-10 h-[80px] md:h-[40px] rounded-r-[10px] md:rounded-br-[10px] rounded-br-[10px]'
          >
            <svg
              width='13'
              height='12'
              viewBox='0 0 13 12'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M0.707031 0.206055C0.98267 -0.0694486 1.42952 -0.0695749 1.70508 0.206055L6.50098 5.00293L11.2969 0.206055C11.5725 -0.0692376 12.0194 -0.0695109 12.2949 0.206055C12.5705 0.481731 12.5705 0.929373 12.2949 1.20508L7.49902 6.00195L12.291 10.7949L12.3154 10.8213C12.5657 11.0984 12.5579 11.5259 12.291 11.793C12.0241 12.06 11.5964 12.0685 11.3193 11.8184L11.293 11.793L6.50098 7L1.70898 11.7939L1.68262 11.8193C1.40561 12.0697 0.977947 12.0609 0.710938 11.7939C0.443995 11.5269 0.4354 11.0994 0.685547 10.8223L0.710938 10.7959L5.50293 6.00098L0.707031 1.2041C0.431408 0.928409 0.431408 0.481747 0.707031 0.206055Z'
                fill='#0F9058'
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
