'use client';

import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { TagDisplay } from '@/components/ui/TagDisplay';
import type { CompanyDetailData, JobPostingData } from '@/types';
import Image from 'next/image';

interface CompanyDetailClientProps {
  initialCompanyData: CompanyDetailData | null;
  jobPostings?: JobPostingData[];
}

// 雇用形態の英語→日本語マッピング
const getEmploymentTypeInJapanese = (employmentType: string): string => {
  const mapping: Record<string, string> = {
    FULL_TIME: '正社員',
    CONTRACT: '契約社員',
    正社員: '正社員',
    契約社員: '契約社員',
    業務委託: '業務委託',
    その他: 'その他',
  };

  return mapping[employmentType] || employmentType;
};

// 最適化された勤務地タグコンポーネント
const OptimizedLocationTags: React.FC<{ locations: string[] }> = ({
  locations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(locations.length);

  // 計算処理をメモ化
  const calculateVisibleTags = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const containerWidth = container.offsetWidth;

    // 簡素化された幅計算
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < locations.length; i++) {
      const estimatedWidth = locations[i].length * 12 + 40; // 簡略化
      if (totalWidth + estimatedWidth > containerWidth - 40) break;
      totalWidth += estimatedWidth + 8;
      count++;
    }

    setVisibleCount(Math.max(1, count));
  }, [locations]);

  // ResizeObserverを最適化（デバウンス処理付き）
  useEffect(() => {
    if (!containerRef.current) return;

    let timeoutId: NodeJS.Timeout;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(calculateVisibleTags, 150); // デバウンス
    });

    resizeObserver.observe(containerRef.current);
    calculateVisibleTags(); // 初回計算

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [calculateVisibleTags]);

  return (
    <div
      ref={containerRef}
      className='flex flex-nowrap gap-2 items-center justify-start w-full overflow-hidden'
    >
      {locations.slice(0, visibleCount).map(item => (
        <div
          key={item}
          className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 shrink-0'
          style={{ borderRadius: '5px' }}
        >
          <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058] whitespace-nowrap">
            {item}
          </span>
        </div>
      ))}
      {visibleCount < locations.length && (
        <div
          className='bg-[#d2f1da] flex flex-row gap-2.5 h-10 items-center justify-center px-6 py-0 shrink-0'
          style={{ borderRadius: '5px' }}
        >
          <span className="font-['Noto_Sans_JP'] font-medium text-[14px] leading-[1.6] tracking-[1.4px] text-[#0f9058]">
            ...
          </span>
        </div>
      )}
    </div>
  );
};

// 画像カルーセルコンポーネント（最適化版）
const OptimizedImageCarousel: React.FC<{
  images: string[];
  companyName: string;
}> = ({ images, companyName }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 画像が1枚以下の場合は自動切り替えを無効化
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 3000); // 3秒に延長してCPU負荷軽減

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {/* 画像 */}
      <div className='relative aspect-[3/2] rounded-[10px] md:rounded-3xl w-full overflow-hidden'>
        <Image
          src={images[currentImageIndex] || '/company.jpg'}
          alt={`${companyName} - 画像${currentImageIndex + 1}`}
          fill
          sizes='(max-width: 768px) 100vw, 50vw'
          priority={currentImageIndex === 0}
          className='object-cover transition-opacity duration-500'
        />
      </div>

      {/* プログレスバー */}
      {images.length > 1 && (
        <div className='flex flex-row gap-1 h-2 items-center justify-start w-full'>
          {images.map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-full rounded-[5px] transition-colors duration-300 ${
                index === currentImageIndex ? 'bg-[#0f9058]' : 'bg-[#dcdcdc]'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default function OptimizedCompanyDetailClient({
  initialCompanyData,
  jobPostings = [],
}: CompanyDetailClientProps) {
  const router = useRouter();
  const params = useParams();
  const companyData = initialCompanyData; // useState不要

  // お気に入り機能（企業用）
  const companyId = params.company_id as string;
  const [isFavorite, setIsFavorite] = useState(false);
  const [jobFavorites, setJobFavorites] = useState<Record<string, boolean>>({});

  // ハンドラー関数をメモ化
  const handleFavoriteToggle = useCallback(async () => {
    setIsFavorite(prev => !prev);
    console.log('企業お気に入り切り替え:', {
      companyId,
      isFavorite: !isFavorite,
    });
  }, [companyId, isFavorite]);

  const handleJobFavoriteToggle = useCallback((jobId: string) => {
    setJobFavorites(prev => ({ ...prev, [jobId]: !prev[jobId] }));
  }, []);

  // 求人データの処理をメモ化
  const processedJobPostings = useMemo(() => {
    return jobPostings.length > 0 ? jobPostings : Array(6).fill(null);
  }, [jobPostings]);

  if (!companyData) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-[#f9f9f9]'>
        <div className='text-center'>
          <p className='text-gray-500'>企業情報が見つかりませんでした</p>
          <button
            onClick={() => router.back()}
            className='mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600'
          >
            戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#F9F9F9] min-h-screen pb-20 pt-6 px-4 lg:pt-10 lg:px-20'>
      <div className='max-w-[1280px] mx-auto overflow-hidden'>
        {/* ヘッダー部分 */}
        <div className='flex flex-row gap-4 items-center justify-start w-full mb-10'>
          <div className='relative rounded-full shrink-0 w-10 h-10 overflow-hidden'>
            <Image
              src={companyData.companyLogo || '/company.jpg'}
              alt={companyData.companyName}
              fill
              sizes='40px'
              priority
              className='object-cover'
            />
          </div>
          <div className='flex-1'>
            <span className="font-['Noto_Sans_JP'] font-bold text-[20px] md:text-[32px] leading-[1.6] tracking-[2.4px] text-[#0f9058] break-words overflow-wrap-break-word line-break-auto max-w-full">
              {companyData.companyName}
            </span>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className='flex flex-col gap-8 min-w-0 max-w-full overflow-hidden'>
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start w-full max-w-full'>
            {/* 企業詳細 */}
            <div className='order-1 lg:order-1 flex flex-col gap-10 items-start justify-start lg:flex-1 min-w-0 max-w-full overflow-hidden'>
              {/* 画像・プログレス・タグセクション */}
              <div className='flex flex-col gap-4 items-start justify-start w-full'>
                <OptimizedImageCarousel
                  images={companyData.images}
                  companyName={companyData.companyName}
                />
              </div>

              {/* アピールポイントセクション */}
              {[
                {
                  title: 'アピールポイントタイトルテキストが入ります',
                  content: companyData.jobDescription,
                },
                {
                  title: 'アピールポイントタイトルテキストが入ります',
                  content: companyData.positionSummary,
                },
              ].map((section, index) => (
                <div
                  key={index}
                  className='flex flex-col gap-4 items-start justify-start w-full'
                >
                  <div className='flex flex-row gap-3 min-h-[40px] items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                    <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                      {section.title}
                    </h2>
                  </div>
                  <div className='flex flex-col items-start justify-start w-full'>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {section.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 右側サイドバー（既存のまま） */}
            {/* ... サイドバーの内容は変更なし ... */}
          </div>

          {/* 掲載求人セクション - 最適化版 */}
          <div className='order-3 w-full'>
            <div className='flex flex-col gap-4 items-start justify-start w-full'>
              <div className='flex flex-row gap-3 min-h-[40px] items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                <svg
                  className='w-5 h-5 text-[#0f9058]'
                  viewBox='0 0 32 32'
                  fill='currentColor'
                >
                  <path d='M15.9998 0C13.3525 0 11.0978 1.66875 10.2682 4H7.89318C5.65751 4 3.83984 5.79375 3.83984 8V28C3.83984 30.2062 5.65751 32 7.89318 32H24.1065C26.3422 32 28.1598 30.2062 28.1598 28V8C28.1598 5.79375 26.3422 4 24.1065 4H21.7315C20.9018 1.66875 18.6472 0 15.9998 0Z' />
                </svg>
                <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] md:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                  掲載求人
                </h2>
              </div>

              {/* 採用情報一覧 - 最適化版 */}
              <div className='flex flex-col gap-2 items-start justify-start w-full'>
                {processedJobPostings.map((job, index) => {
                  const jobKey = job?.id || `sample-${index}`;
                  const tags = job
                    ? [
                        getEmploymentTypeInJapanese(job.employment_type),
                        ...(job.work_location?.slice(0, 2) || []),
                      ]
                    : ['正社員', 'リモート', 'フレックス'];

                  return (
                    <div
                      key={jobKey}
                      className='bg-white flex md:flex-row flex-col gap-4 items-start justify-start w-full cursor-pointer hover:bg-gray-50 p-6 rounded-[10px] transition-colors border border-gray-100 shadow-sm'
                      onClick={() => {
                        if (job?.id) {
                          router.push(`/candidate/search/setting/${job.id}`);
                        } else {
                          alert(
                            'この求人は現在データベースに存在しません。サンプル表示です。'
                          );
                        }
                      }}
                    >
                      {/* 画像 */}
                      <div className='relative md:w-20 md:h-[53px] w-full h-[208px] overflow-hidden bg-gray-200 rounded-[5px] flex-shrink-0'>
                        {job?.image_urls?.[0] || companyData.images?.[0] ? (
                          <Image
                            src={job?.image_urls?.[0] || companyData.images[0]}
                            alt={job?.title || `求人${index + 1}`}
                            fill
                            sizes='(max-width: 768px) 100vw, 80px'
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                            <div className='md:w-8 md:h-8 w-16 h-16 bg-gray-400 rounded'></div>
                          </div>
                        )}
                      </div>

                      {/* コンテンツ */}
                      <div className='flex flex-col flex-1 min-w-0'>
                        {/* スマホ：タグ優先レイアウト */}
                        <div className='md:hidden'>
                          <div className='flex flex-row justify-between items-start gap-2'>
                            <div className='flex flex-row gap-2 items-start flex-wrap flex-1'>
                              {tags.map((tag, tagIndex) => (
                                <span
                                  key={`${jobKey}-${tagIndex}`}
                                  className='py-0.5 px-3 bg-[#d2f1da] rounded-[5px] text-[#0f9058] font-medium text-[12px] whitespace-nowrap'
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <button
                              type='button'
                              className='flex-shrink-0 items-start'
                              onClick={e => {
                                e.stopPropagation();
                                handleJobFavoriteToggle(jobKey);
                              }}
                              aria-label='お気に入り'
                            >
                              <Star
                                size={24}
                                fill={
                                  jobFavorites[jobKey] ? '#FFDA5F' : '#DCDCDC'
                                }
                                color={
                                  jobFavorites[jobKey] ? '#FFDA5F' : '#DCDCDC'
                                }
                              />
                            </button>
                          </div>
                          <h3 className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[1.6] tracking-[1.6px] text-[#0f9058] break-words mt-2">
                            {job?.title ||
                              '求人テキストが入ります | 求人テキストが入ります'}
                          </h3>
                        </div>

                        {/* PC：タイトル優先レイアウト */}
                        <div className='hidden md:block'>
                          <h3 className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[1.6] tracking-[1.6px] text-[#0f9058] break-words">
                            {job?.title ||
                              '求人テキストが入ります | 求人テキストが入ります'}
                          </h3>
                          <div className='flex flex-row gap-2 items-start flex-wrap mt-1'>
                            {tags.map((tag, tagIndex) => (
                              <span
                                key={`${jobKey}-pc-${tagIndex}`}
                                className='py-0.5 px-3 bg-[#d2f1da] rounded-[5px] text-[#0f9058] font-medium text-[12px] whitespace-nowrap'
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* PC：右側の星アイコン */}
                      <div className='hidden md:flex flex-col items-center justify-start pt-1'>
                        <button
                          type='button'
                          className='p-1'
                          onClick={e => {
                            e.stopPropagation();
                            handleJobFavoriteToggle(jobKey);
                          }}
                          aria-label='お気に入り'
                        >
                          <Star
                            size={24}
                            fill={jobFavorites[jobKey] ? '#FFDA5F' : '#DCDCDC'}
                            color={jobFavorites[jobKey] ? '#FFDA5F' : '#DCDCDC'}
                          />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
