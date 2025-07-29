import React from 'react';

interface JobPostCardProps {
  imageUrl: string;
  imageAlt: string;
  className?: string;
  title: string;
  tags: string[];
  companyName: string;
  location: string;
  salary: string;
  starred: boolean;
  onStarClick?: () => void;
  apell: string[];
  isFavoriteLoading?: boolean;

}

export function JobPostCard({
  imageUrl,
  imageAlt,
  className = '',
  title,
  tags,
  companyName,
  location,
  salary,
  starred,
  apell,
  onStarClick,
  isFavoriteLoading = false,

}: JobPostCardProps) {
  return (
    <div
      style={{
        width: '100%',
        boxShadow: '0px 0px 20px rgba(0,0,0,0.05)',
      }}
      className={`bg-white h-auto md:h-[366px] ${className} rounded-[10px] overflow-hidden`}
    >
      <div className='flex flex-col md:flex-row justify-center items-center w-full h-full gap-8 p-6'>
        <img
          src={imageUrl}
          alt={imageAlt}
          width={477}
          height={318}
          className='w-full h-auto object-cover rounded-[5px] md:w-[477px] md:h-[318px]'
        />
        <div
          className='w-full md:w-[731px] flex flex-col items-start relative md:h-[318px]'
          style={{ background: 'transparent', height: undefined }}
        >
          {/* 右上のスターアイコン */}
          <button
            type='button'
            className={`absolute top-0 right-0 z-10 p-2 ${isFavoriteLoading ? 'opacity-50 cursor-wait' : ''}`}
            onClick={onStarClick}
            aria-label='お気に入り'
            disabled={isFavoriteLoading}
          >
            {isFavoriteLoading ? (
              // ローディングスピナー
              <div className="w-8 h-8 flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <svg
                width='32'
                height='32'
                viewBox='0 0 32 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                  fill={starred ? '#FFDA5F' : '#DCDCDC'}
                />
              </svg>
            )}
          </button>
          <div className='flex flex-row gap-2 items-start flex-wrap'>
            {tags.map((tag, idx) => (
              <span
                key={tag + idx}
                className='py-0.5 px-2 md:py-0 md:px-4 md:text-[16px] md:leading-[2] bg-[#d2f1da] rounded-[5px] text-[#0f9058] font-medium whitespace-nowrap'

              >
                {tag}
              </span>
            ))}
          </div>
          <div
            className='mt-4 md:mt-2 text-[18px] font-bold line-clamp-2'
            style={{ 
              color: '#0f9058', 
              lineHeight: '1.5',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 'calc(100% - 2em)'
            }}
          >
            {title}
          </div>
          <div className='flex flex-row items-center mt-4 hidden md:flex' style={{ maxWidth: 'calc(100% - 2em)' }}>

            <svg
              width='20'
              height='20'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
              className='flex-shrink-0'

            >
              <path
                d='M8.74534 15.6405C10.3582 13.629 14.0366 8.7539 14.0366 6.01557C14.0366 2.69447 11.3328 0 8.00023 0C4.66765 0 1.96387 2.69447 1.96387 6.01557C1.96387 8.7539 5.64228 13.629 7.25512 15.6405C7.64182 16.1198 8.35864 16.1198 8.74534 15.6405ZM8.00023 4.01038C8.53388 4.01038 9.04567 4.22164 9.42302 4.59768C9.80036 4.97373 10.0124 5.48376 10.0124 6.01557C10.0124 6.54738 9.80036 7.0574 9.42302 7.43345C9.04567 7.8095 8.53388 8.02076 8.00023 8.02076C7.46658 8.02076 6.95479 7.8095 6.57745 7.43345C6.2001 7.0574 5.98811 6.54738 5.98811 6.01557C5.98811 5.48376 6.2001 4.97373 6.57745 4.59768C6.95479 4.22164 7.46658 4.01038 8.00023 4.01038Z'
                fill='#0F9058'
              />
            </svg>
            <span 
              className='ml-1 text-[16px] font-medium truncate flex-1' 
              style={{ 
                color: '#323232'
              }}
            >
              {Array.isArray(location) ? location.join('、') : location}

            </span>
          </div>
          <div className='flex flex-row items-center mt-2 hidden md:flex'>
            <svg
              width='20'
              height='20'
              viewBox='0 0 16 16'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M4.39424 0.510485C4.04567 -0.0180946 3.34143 -0.157382 2.81502 0.192623C2.28862 0.542628 2.15346 1.24978 2.50203 1.77836L5.87386 6.85701H4.01722C3.38767 6.85701 2.87905 7.36773 2.87905 7.99988C2.87905 8.63203 3.38767 9.14276 4.01722 9.14276H6.86265V10.2856H4.01722C3.38767 10.2856 2.87905 10.7964 2.87905 11.4285C2.87905 12.0607 3.38767 12.5714 4.01722 12.5714H6.86265V14.8571C6.86265 15.4893 7.37127 16 8.00082 16C8.63037 16 9.13899 15.4893 9.13899 14.8571V12.5714H11.9844C12.614 12.5714 13.1226 12.0607 13.1226 11.4285C13.1226 10.7964 12.614 10.2856 11.9844 10.2856H9.13899V9.14276H11.9844C12.614 9.14276 13.1226 8.63203 13.1226 7.99988C13.1226 7.36773 12.614 6.85701 11.9844 6.85701H10.1278L13.4996 1.77836C13.8482 1.25335 13.7059 0.542628 13.1831 0.192623C12.6602 -0.157382 11.9524 -0.0145231 11.6038 0.510485L8.00082 5.93914L4.39424 0.510485Z'
                fill='#0F9058'
              />
            </svg>
            <span
              className='ml-1 text-[16px] font-medium'

              style={{ color: '#323232', lineHeight: '2' }}
            >
              {salary}
            </span>
            
          </div>
          <div className='flex flex-wrap gap-x-2 mr-2 gap-y-2 mt-4'>
            {apell.map((item, idx) => (
              <span key={idx} className='text-[16px] font-medium mr-2' style={{ color: '#999', lineHeight: '2' }}>
               {item}
              </span>
            ))}

          </div>
          <div className='pt-4 border-t-0 md:border-t-2 md:border-t-[#EFEFEF] w-full bg-white static md:absolute md:left-0 md:bottom-0'>
            <div className='flex flex-row items-center'>
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: '#0f9058',
                }}
              />
              <span
                className='ml-2 text-[14px] md:text-[16px] font-bold'
                style={{ color: '#323232', lineHeight: '2',letterSpacing: '1.6px' }}

              >
                {companyName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

