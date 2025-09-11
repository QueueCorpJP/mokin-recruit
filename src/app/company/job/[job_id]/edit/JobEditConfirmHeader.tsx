import React from 'react';
import Link from 'next/link';

function RightLine() {
  return (
    <div
      className="flex-shrink-0 self-stretch"
      style={{ width: '4.571px', aspectRatio: '4.57/8.00' }}
      data-name="right line"
    >
      <svg
        className="block size-full"
        xmlns="http://www.w3.org/2000/svg"
        width="6"
        height="8"
        viewBox="0 0 6 8"
        fill="none"
      >
        <path
          d="M5.11804 3.59656C5.34118 3.8197 5.34118 4.18208 5.11804 4.40522L1.69061 7.83264C1.46747 8.05579 1.10509 8.05579 0.881954 7.83264C0.658815 7.60951 0.658815 7.24713 0.881954 7.02399L3.90594 4L0.883739 0.976012C0.6606 0.752873 0.6606 0.390494 0.883739 0.167355C1.10688 -0.0557849 1.46926 -0.0557849 1.6924 0.167355L5.11982 3.59478L5.11804 3.59656Z"
          fill="white"
        />
      </svg>
    </div>
  );
}

interface JobEditConfirmHeaderProps {
  breadcrumbText?: string;
  titleText?: string;
  jobId: string;
}

export default function JobEditConfirmHeader({ jobId }: JobEditConfirmHeaderProps) {
  return (
    <div
      className="bg-gradient-to-t from-[#17856f] to-[#229a4e] py-10 px-10"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl md:px-[80px]">
        <div className="flex flex-col gap-4 items-start justify-start">
            <div
              className="[flex-flow:wrap] box-border content-center flex gap-2 items-center justify-start"
            >
              <div
                className="box-border content-stretch flex flex-row gap-2.5 items-center justify-center"
              >
                <Link href="/company/job" className="hover:opacity-80">
                  <div
                    className="font-['Noto_Sans_JP'] font-bold leading-[1.6] not-italic text-white text-[14px] text-left tracking-[1.4px] cursor-pointer"
                  >
                    求人一覧
                  </div>
                </Link>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ width: '6px', height: '8px' }}
              >
                <RightLine />
              </div>
              <Link href={`/company/job/${jobId}`} className="hover:opacity-80">
                <div
                  className="font-['Noto_Sans_JP'] font-bold leading-[1.6] not-italic text-white text-[14px] text-left tracking-[1.4px] cursor-pointer"
                >
                  求人詳細
                </div>
              </Link>
              <div
                className="flex items-center justify-center"
                style={{ width: '6px', height: '8px' }}
              >
                <RightLine />
              </div>
              <Link href={`/company/job/${jobId}/edit`} className="hover:opacity-80">
                <div
                  className="font-['Noto_Sans_JP'] font-bold leading-[1.6] not-italic text-white text-[14px] text-left tracking-[1.4px] cursor-pointer"
                >
                  求人編集
                </div>
              </Link>
              <div
                className="flex items-center justify-center"
                style={{ width: '6px', height: '8px' }}
              >
                <RightLine />
              </div>
              <div
                className="font-['Noto_Sans_JP'] font-bold leading-[1.6] not-italic text-white text-[14px] text-left tracking-[1.4px]"
              >
                編集内容の確認
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
                編集内容確認
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}