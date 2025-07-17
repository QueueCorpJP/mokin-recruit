
import React from 'react';

function RightLine() {
  return (
    <div
      className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center p-0 relative size-full"
      data-name="right line"
    >
      <div
        className="aspect-[256.05/448.15] h-full relative shrink-0"
        data-name="Vector"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 69 120"
        >
          <path
            d="M66.0515 53.9484C69.3986 57.2955 69.3986 62.7312 66.0515 66.0783L14.6402 117.49C11.2931 120.837 5.85741 120.837 2.51032 117.49C-0.836773 114.143 -0.836773 108.707 2.51032 105.36L47.8701 60L2.5371 14.6402C-0.809997 11.2931 -0.809997 5.85741 2.5371 2.51032C5.88419 -0.836773 11.3199 -0.836773 14.667 2.51032L66.0783 53.9217L66.0515 53.9484Z"
            fill="var(--fill-0, #0F9058)"
          />
        </svg>
      </div>
    </div>
  );
}

interface NewJobHeaderProps {
  breadcrumbText?: string;
  titleText?: string;
}

export default function NewJobHeader({ 
  breadcrumbText = '求人一覧', 
  titleText = '新規求人作成' 
}: NewJobHeaderProps = {}) {
  return (
    <div
      className="bg-gradient-to-t from-[#17856f] to-[#229a4e] py-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col gap-4 items-start justify-start">
            <div
              className="[flex-flow:wrap] box-border content-center flex gap-2 items-center justify-start"
            >
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center"
              >
                <div
                  className="font-['Noto_Sans_JP'] font-bold leading-[1.6] not-italic text-white text-[14px] text-left tracking-[1.4px]"
                >
                    {breadcrumbText}
                </div>
              </div>
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center size-2"
              >
                <RightLine />
              </div>
              <div
                className="font-['Noto_Sans_JP'] font-bold leading-[1.6] not-italic text-white text-[14px] text-left tracking-[1.4px]"
              >
                  {titleText}
              </div>
            </div>
            <div
              className="flex flex-row gap-4 items-center justify-start w-full"
            >
              <div
                className="relative shrink-0 size-8"
              >
                <div
                  className="absolute aspect-[38/50] left-[12%] right-[12%] top-0"
                >
                  <svg
                    className="block size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 25 32"
                  >
                    <path
                      d="M12.16 0C9.51267 0 7.258 1.66875 6.42833 4H4.05333C1.81767 4 0 5.79375 0 8V28C0 30.2062 1.81767 32 4.05333 32H20.2667C22.5023 32 24.32 30.2062 24.32 28V8C24.32 5.79375 22.5023 4 20.2667 4H17.8917C17.062 1.66875 14.8073 0 12.16 0ZM12.16 4C12.6975 4 13.213 4.21071 13.5931 4.58579C13.9731 4.96086 14.1867 5.46957 14.1867 6C14.1867 6.53043 13.9731 7.03914 13.5931 7.41421C13.213 7.78929 12.6975 8 12.16 8C11.6225 8 11.107 7.78929 10.7269 7.41421C10.3469 7.03914 10.1333 6.53043 10.1333 6C10.1333 5.46957 10.3469 4.96086 10.7269 4.58579C11.107 4.21071 11.6225 4 12.16 4ZM4.56 17C4.56 16.6022 4.72014 16.2206 5.0052 15.9393C5.29025 15.658 5.67687 15.5 6.08 15.5C6.48313 15.5 6.86975 15.658 7.1548 15.9393C7.43986 16.2206 7.6 16.6022 7.6 17C7.6 17.3978 7.43986 17.7794 7.1548 18.0607C6.86975 18.342 6.48313 18.5 6.08 18.5C5.67687 18.5 5.29025 18.342 5.0052 18.0607C4.72014 17.7794 4.56 17.3978 4.56 17ZM11.1467 16H19.2533C19.8107 16 20.2667 16.45 20.2667 17C20.2667 17.55 19.8107 18 19.2533 18H11.1467C10.5893 18 10.1333 17.55 10.1333 17C10.1333 16.45 10.5893 16 11.1467 16ZM4.56 23C4.56 22.6022 4.72014 22.2206 5.0052 21.9393C5.29025 21.658 5.67687 21.5 6.08 21.5C6.48313 21.5 6.86975 21.658 7.1548 21.9393C7.43986 22.2206 7.6 22.6022 7.6 23C7.6 23.3978 7.43986 23.7794 7.1548 24.0607C6.86975 24.342 6.48313 24.5 6.08 24.5C5.67687 24.5 5.29025 24.342 5.0052 24.0607C4.72014 23.7794 4.56 23.3978 4.56 23ZM10.1333 23C10.1333 22.45 10.5893 22 11.1467 22H19.2533C19.8107 22 20.2667 22.45 20.2667 23C20.2667 23.55 19.8107 24 19.2533 24H11.1467C10.5893 24 10.1333 23.55 10.1333 23Z"
                      fill="var(--fill-0, white)"
                    />
                  </svg>
                </div>
              </div>
              <div
                className="font-['Noto_Sans_JP'] font-bold grow leading-[1.6] not-italic text-white text-[24px] text-left tracking-[2.4px]"
              >
                {titleText}
              </div>
          </div>
        </div>
      </div>
    </div>
  );
} 