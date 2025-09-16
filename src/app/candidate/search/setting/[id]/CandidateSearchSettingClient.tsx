'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Star } from 'lucide-react';
import { useFavoriteStatusQuery, useFavoriteToggleMutation } from '@/hooks';
import { useCompanyDetail } from '@/hooks/useCompanyDetail';
import { TagDisplay } from '@/components/ui/TagDisplay';
import { JobDetailData } from './actions';
import Image from 'next/image';

// 企業詳細サイドバーを動的インポート
const CompanyDetailsSidebar = dynamic(() => import('./CompanyDetailsSidebar'), {
  loading: () => (
    <div className='w-full lg:w-[320px] bg-white rounded-[10px] p-6 max-w-full overflow-hidden'>
      <div className='flex flex-col gap-6 items-start justify-start max-w-full overflow-hidden'>
        <div className='animate-pulse'>
          <div className='h-6 bg-gray-200 rounded w-32 mb-6'></div>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className='flex flex-col gap-2 mb-6'>
              <div className='h-4 bg-gray-200 rounded w-20 mb-2'></div>
              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
  ssr: false,
});

interface CandidateSearchSettingClientProps {
  initialJobData: JobDetailData | null;
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

// 勤務地タグの一行表示用コンポーネント
const SingleRowLocationTags: React.FC<{ locations: string[] }> = ({
  locations,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleCount, setVisibleCount] = useState(locations.length);

  useEffect(() => {
    const calculateVisibleTags = () => {
      if (!containerRef.current) return;

      const container = containerRef.current;
      const containerWidth = container.offsetWidth;
      const ellipsisWidth = 30; // "..." の幅
      let currentWidth = 0;
      let count = 0;

      // 各タグの幅を計算
      for (let i = 0; i < locations.length; i++) {
        // タグの幅を概算（パディング48px + フォントサイズ14px * 文字数 * 0.9）
        const estimatedTagWidth = 48 + locations[i].length * 14 * 0.9;
        const gapWidth = i > 0 ? 8 : 0; // gap分
        const totalWidthWithTag = currentWidth + gapWidth + estimatedTagWidth;

        // 次のタグを追加した場合の幅をチェック
        const remainingTags = locations.length - i - 1;
        const needsEllipsis = remainingTags > 0;

        // 省略記号が必要な場合はその分も考慮
        const finalWidth =
          totalWidthWithTag + (needsEllipsis ? 8 + ellipsisWidth : 0);

        if (finalWidth > containerWidth) {
          // このタグを追加すると溢れる場合
          break;
        }

        currentWidth = totalWidthWithTag;
        count++;
      }

      setVisibleCount(Math.max(1, count)); // 最低1つは表示
    };

    const timeoutId = setTimeout(calculateVisibleTags, 0);

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(calculateVisibleTags, 0);
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [locations]);

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

export default function CandidateSearchSettingClient({
  initialJobData,
}: CandidateSearchSettingClientProps) {
  const router = useRouter();
  const params = useParams();
  const [jobData] = useState<JobDetailData | null>(initialJobData);

  // 企業データを非同期で取得（軽量なデータのみ先行取得）
  const companyId = jobData?.companyId;

  // 企業詳細データを取得
  const {
    data: companyData,
    loading: companyDataLoading,
    error: _companyDataError,
  } = useCompanyDetail(companyId || '');

  // 画像カルーセル用のstate
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  // お気に入り機能のhook
  const jobId = params?.id as string;
  const { data: favoriteStatus } = useFavoriteStatusQuery(jobId ? [jobId] : []);
  const favoriteToggleMutation = useFavoriteToggleMutation();

  // お気に入り状態をローカルステートで管理（即座の更新のため）
  const [isFavorite, setIsFavorite] = useState(false);

  // favoriteStatusが更新されたらローカルステートも更新
  useEffect(() => {
    if (favoriteStatus !== undefined && jobId) {
      setIsFavorite(favoriteStatus[jobId] || false);
    }
  }, [favoriteStatus, jobId]);

  // 画像の自動切り替え
  useEffect(() => {
    if (!jobData || !jobData.images || jobData.images.length <= 1) return;

    const interval = setInterval(() => {
      setImageLoading(true); // 画像切り替え時にローディング表示
      setCurrentImageIndex(
        prevIndex => (prevIndex + 1) % jobData.images.length
      );
    }, 2500); // 2.5秒間隔

    return () => clearInterval(interval);
  }, [jobData]);

  const handleFavoriteToggle = async () => {
    if (favoriteToggleMutation.isPending) return; // 処理中は無効化

    // 楽観的更新: 即座にUIを更新
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      await favoriteToggleMutation.mutateAsync({
        jobPostingId: jobId,
        isFavorite: isFavorite,
      });
    } catch (error) {
      console.error('お気に入りの切り替えに失敗しました:', error);
      // エラーの場合は元の状態に戻す
      setIsFavorite(!newFavoriteState);
    }
  };

  const handleApply = () => {
    // confirmページでサーバーから求人データを再取得するため、jobIdのみを渡す
    router.push(`/candidate/search/setting/${params.id}/confirm`);
  };

  const handleBackToResults = () => {
    router.push('/candidate/search/setting');
  };

  if (!jobData) {
    return (
      <div className='bg-[#f9f9f9] min-h-screen pb-20 pt-6 px-4 lg:pt-10 lg:px-20'>
        <div className='max-w-[1280px] mx-auto overflow-hidden'>
          {/* バナー部分のスケルトン */}
          <div className='flex flex-col gap-6 items-start justify-start w-full mb-10'>
            {/* 求人タイトルのスケルトン */}
            <div className='h-6 lg:h-7 w-3/4 bg-gray-200 rounded animate-pulse' />

            {/* 企業情報のスケルトン */}
            <div className='flex flex-row gap-4 items-center justify-start w-full'>
              <div className='w-10 h-10 bg-gray-200 rounded-full animate-pulse' />
              <div className='h-5 w-48 bg-gray-200 rounded animate-pulse' />
            </div>
          </div>

          {/* メインコンテンツのスケルトン */}
          <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start w-full max-w-full'>
            {/* 求人詳細部分のスケルトン */}
            <div className='order-1 flex flex-col gap-10 items-start justify-start lg:flex-1 min-w-0 max-w-full overflow-hidden'>
              {/* 画像部分のスケルトン */}
              <div className='relative aspect-[300/200] rounded-[10px] md:rounded-3xl w-full bg-gray-200 animate-pulse' />

              {/* ポジション概要セクションのスケルトン */}
              <div className='flex flex-col gap-4 items-start justify-start w-full'>
                <div className='h-6 w-32 bg-gray-200 rounded animate-pulse' />
                <div className='space-y-2 w-full'>
                  <div className='h-4 w-full bg-gray-100 rounded animate-pulse' />
                  <div className='h-4 w-4/5 bg-gray-100 rounded animate-pulse' />
                  <div className='h-4 w-3/5 bg-gray-100 rounded animate-pulse' />
                </div>
              </div>

              {/* 条件・待遇セクションのスケルトン */}
              <div className='flex flex-col gap-4 w-full'>
                <div className='h-6 w-24 bg-gray-200 rounded animate-pulse' />
                <div className='bg-white rounded-[10px] p-6 space-y-4'>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className='flex flex-col gap-2'>
                      <div className='h-4 w-20 bg-gray-200 rounded animate-pulse' />
                      <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* サイドバー部分のスケルトン */}
            <div className='order-2 lg:order-1 w-full lg:w-[320px] bg-white rounded-[10px] p-6'>
              <div className='flex flex-col gap-6 items-start justify-start'>
                <div className='h-5 w-32 bg-gray-200 rounded animate-pulse' />
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className='flex flex-col gap-2 w-full'>
                    <div className='h-4 w-16 bg-gray-200 rounded animate-pulse' />
                    <div className='h-4 w-3/4 bg-gray-100 rounded animate-pulse' />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* お気に入り・応募ボタンのスケルトン */}
          <div className='fixed left-2 right-2 lg:left-10 lg:right-10 bottom-4 lg:bottom-[20px] z-50'>
            <div className='bg-white/90 rounded-[24px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-4 lg:px-16 py-4 lg:py-5'>
              <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-center'>
                <div className='h-12 lg:h-14 w-full lg:w-40 bg-gray-200 rounded-[32px] animate-pulse' />
                <div className='h-12 lg:h-14 w-full lg:w-56 bg-gradient-to-r from-gray-300 to-gray-400 rounded-[32px] animate-pulse' />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className='bg-[#f9f9f9] min-h-screen pb-20 pt-6 px-4 lg:pt-10 lg:px-20'>
        <div className='max-w-[1280px] mx-auto overflow-hidden'>
          {/* ヘッダー部分 */}
          <div className='flex flex-col gap-6 items-start justify-start w-full mb-10'>
            {/* 求人タイトル */}
            <h1 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
              {jobData.title}
            </h1>

            {/* 企業情報 */}
            <div className='flex flex-row gap-4 items-center justify-start w-full'>
              <div
                className='relative rounded-full shrink-0 w-10 h-10 overflow-hidden cursor-pointer'
                onClick={() => {
                  if (companyId) {
                    router.push(`/candidate/company/${companyId}`);
                  }
                }}
              >
                {companyDataLoading ? (
                  <div className='w-full h-full bg-gray-200 animate-pulse rounded-full flex items-center justify-center'>
                    <div className='text-gray-400 text-xs'>...</div>
                  </div>
                ) : (
                  <Image
                    src={companyData?.companyLogo || '/company.jpg'}
                    alt={companyData?.companyName || '企業ロゴ'}
                    fill
                    sizes='40px'
                    priority
                    className='object-cover'
                    onError={e => {
                      (e.target as HTMLImageElement).src = '/company.jpg';
                    }}
                  />
                )}
              </div>
              <div className='flex-1'>
                <span className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#0f9058] break-words overflow-wrap-break-word line-break-auto max-w-full">
                  {companyDataLoading ? (
                    <div className='animate-pulse'>
                      <div className='h-5 bg-gray-200 rounded w-32'></div>
                    </div>
                  ) : (
                    companyData?.companyName || '企業名未設定'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* メインコンテンツ */}
          <div className='flex flex-col gap-8 min-w-0 max-w-full overflow-hidden'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start w-full max-w-full'>
              {/* 求人詳細 - スマホ時は最初に表示 */}
              <div className='order-1 flex flex-col gap-10 items-start justify-start lg:flex-1 min-w-0 max-w-full overflow-hidden'>
                {/* 画像・プログレス・タグセクション */}
                <div className='flex flex-col gap-4 items-start justify-start w-full'>
                  {/* 画像 */}
                  <div className='relative aspect-[300/200] rounded-[10px] md:rounded-3xl w-full overflow-hidden'>
                    {/* スケルトンローディング */}
                    {imageLoading && (
                      <div className='absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center z-10'>
                        <div className='text-gray-400 text-sm'>
                          画像を読み込み中...
                        </div>
                      </div>
                    )}
                    <Image
                      src={jobData.images[currentImageIndex] || '/company.jpg'}
                      alt={`${jobData.title} - 画像${currentImageIndex + 1}`}
                      fill
                      className='object-cover transition-all ease-in-out'
                      style={{ transitionDuration: '0.6s' }}
                      onLoad={() => setImageLoading(false)}
                      onError={() => setImageLoading(false)}
                    />
                  </div>

                  {/* プログレスバー */}
                  {jobData.images && jobData.images.length > 1 && (
                    <div className='flex flex-row gap-1 h-2 items-center justify-start w-full'>
                      {jobData.images.map((_, index) => (
                        <div
                          key={index}
                          className={`flex-1 h-full rounded-[5px] transition-colors ease-in-out ${
                            index === currentImageIndex
                              ? 'bg-[#0f9058]'
                              : 'bg-[#dcdcdc]'
                          }`}
                          style={{ transitionDuration: '0.6s' }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* ポジション概要セクション */}
                <div className='flex flex-col gap-4 items-start justify-start w-full'>
                  <div className='flex flex-row gap-3 h-10 items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                    <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                      ポジション概要
                    </h2>
                  </div>

                  {/* 業務内容 */}
                  <div className='flex flex-col items-start justify-start w-full'>
                    <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                      ■業務内容
                    </h3>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {jobData.jobDescription}
                    </div>
                  </div>

                  {/* 当ポジションの魅力 */}
                  <div className='flex flex-col items-start justify-start w-full'>
                    <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                      ■当ポジションの魅力
                    </h3>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {jobData.positionSummary}
                    </div>
                  </div>
                </div>

                {/* 求める人物像セクション */}
                <div className='flex flex-col gap-4 items-start justify-start w-full'>
                  <div className='flex flex-row gap-3 h-10 items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                    <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                      求める人物像
                    </h2>
                  </div>

                  {/* スキル・経験 */}
                  <div className='flex flex-col items-start justify-start w-full'>
                    <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                      ■スキル・経験
                    </h3>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {jobData.skills}
                    </div>
                  </div>

                  {/* その他・求める人物像など */}
                  <div className='flex flex-col items-start justify-start w-full'>
                    <h3 className="font-['Noto_Sans_JP'] font-bold text-[18px] leading-[1.6] tracking-[1.8px] text-[#323232] mb-2">
                      ■その他・求める人物像など
                    </h3>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {jobData.otherRequirements}
                    </div>
                  </div>
                </div>

                {/* 職種から下のセクション群 */}
                <div className='flex flex-col gap-2 items-start justify-start w-full overflow-hidden'>
                  {/* 職種 */}
                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          職種
                        </div>
                      </div>
                      <div className='bg-white p-6 w-full rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        <TagDisplay
                          items={jobData.jobTypes}
                          borderRadius='5px'
                        />
                      </div>
                    </div>
                  </div>

                  {/* 業種 */}
                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          業種
                        </div>
                      </div>
                      <div className='bg-white p-6 w-full rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        <TagDisplay
                          items={jobData.industries}
                          borderRadius='5px'
                        />
                      </div>
                    </div>
                  </div>

                  {/* 条件・待遇 */}
                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          条件・待遇
                        </div>
                      </div>
                      <div className='bg-white flex flex-col gap-6 w-full items-start justify-start p-6 rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        {/* 想定年収 */}
                        <div className='flex flex-col gap-2 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            想定年収
                          </div>
                          <div className='box-border content-stretch flex flex-row gap-6 items-center justify-start p-0 relative shrink-0'>
                            <div className='box-border content-stretch flex flex-row gap-2 items-center justify-start leading-[0] not-italic p-0 relative shrink-0 text-[#323232] text-[16px] text-left text-nowrap tracking-[1.6px]'>
                              <>
                                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                                  {jobData.salaryMin
                                    ? `${jobData.salaryMin}万`
                                    : '選択済項目が入ります'}
                                </div>
                                <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                                  〜
                                </div>
                                <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                                  {jobData.salaryMax
                                    ? `${jobData.salaryMax}万`
                                    : '選択済項目が入ります'}
                                </div>
                              </>
                            </div>
                            <div className='box-border content-stretch flex flex-row gap-2 items-start justify-start p-0 relative shrink-0'>
                              <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                                応相談
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* 年収補足 */}
                        <div className='flex flex-col gap-2 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] flex items-center font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            年収補足
                          </div>
                          <div className='box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full'>
                            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full break-words overflow-wrap-break-word line-break-auto max-w-full">
                              {jobData.salaryNote}
                            </div>
                          </div>
                        </div>

                        {/* 仕切り線 */}
                        <div className='h-0 relative shrink-0 w-full'>
                          <div className='absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]'>
                            <svg
                              className='block size-full'
                              fill='none'
                              preserveAspectRatio='none'
                              viewBox='0 0 628 2'
                            >
                              <path d='M0 1H628' stroke='#EFEFEF' />
                            </svg>
                          </div>
                        </div>

                        {/* 勤務地 */}
                        <div className='flex flex-row items-center justify-center min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] mr-[10px] shrink-0 font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-nowrap">
                            勤務地
                          </div>
                          <div className='min-w-0 flex-1 gap-2'>
                            <SingleRowLocationTags
                              locations={jobData.locations}
                            />
                          </div>
                        </div>

                        {/* 勤務地補足 */}
                        <div className='flex flex-col gap-2 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            勤務地補足
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word min-w-0 max-w-full">
                            {jobData.locationNote}
                          </div>
                        </div>

                        {/* 仕切り線 */}
                        <div className='h-0 relative shrink-0 w-full'>
                          <div className='absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]'>
                            <svg
                              className='block size-full'
                              fill='none'
                              preserveAspectRatio='none'
                              viewBox='0 0 628 2'
                            >
                              <path d='M0 1H628' stroke='#EFEFEF' />
                            </svg>
                          </div>
                        </div>

                        {/* 雇用形態 */}
                        <div className='flex flex-col gap-2 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            雇用形態
                          </div>
                          <div className='box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0 w-full'>
                            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full break-words overflow-wrap-break-word line-break-auto max-w-full">
                              {getEmploymentTypeInJapanese(
                                jobData.employmentType
                              )}
                            </div>
                          </div>
                        </div>

                        {/* 雇用形態補足 */}
                        <div className='flex flex-col gap-2 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            雇用形態補足
                          </div>
                          <div className='box-border content-stretch flex flex-col gap-1 items-start justify-start p-0 relative shrink-0'>
                            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full break-words overflow-wrap-break-word line-break-auto max-w-full">
                              {jobData.employmentTypeNote}
                            </div>
                          </div>
                        </div>

                        {/* 仕切り線 */}
                        <div className='h-0 relative shrink-0 w-full'>
                          <div className='absolute bottom-[-0.5px] left-0 right-0 top-[-0.5px]'>
                            <svg
                              className='block size-full'
                              fill='none'
                              preserveAspectRatio='none'
                              viewBox='0 0 628 2'
                            >
                              <path d='M0 1H628' stroke='#EFEFEF' />
                            </svg>
                          </div>
                        </div>

                        {/* 就業時間 */}
                        <div className='flex flex-col md:flex-col gap-2 md:gap-2.5 items-start justify-start w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] md:min-w-[80px]">
                            就業時間
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                            {jobData.workingHours}
                          </div>
                        </div>

                        {/* 所定外労働の有無 */}
                        <div className='flex flex-col gap-2 items-start justify-start w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            所定外労働の有無
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full break-words overflow-wrap-break-word line-break-auto max-w-full">
                            {jobData.overtime
                              ? jobData.overtime.trim() === ''
                                ? 'あり'
                                : jobData.overtime
                              : 'あり'}
                          </div>
                        </div>

                        {/* 備考 */}
                        {jobData.overtimeMemo && (
                          <div className='flex flex-col gap-2 items-start justify-start w-full'>
                            <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                              備考
                            </div>
                            <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full break-words overflow-wrap-break-word line-break-auto max-w-full">
                              {jobData.overtimeMemo}
                            </div>
                          </div>
                        )}

                        {/* 休日・休暇 */}
                        <div className='flex flex-col md:flex-col gap-2 md:gap-2.5 items-start justify-start w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232] md:min-w-[80px]">
                            休日・休暇
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] w-full whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                            {jobData.holidays}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 選考情報 */}
                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          選考情報
                        </div>
                      </div>
                      <div className='bg-white p-6 w-full rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word w-full max-w-full">
                          {jobData.selectionProcess}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* アピールポイント */}
                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          アピールポイント
                        </div>
                      </div>
                      <div className='bg-white flex flex-col gap-3 w-full items-start justify-start p-6 rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        {/* 業務・ポジション */}
                        <div className='flex flex-col flex items-center gap-1 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            業務・ポジション
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word min-w-0 max-w-full">
                            {jobData.appealPoints.business.join('、')}
                          </div>
                        </div>

                        {/* 企業・組織 */}
                        <div className='flex flex-col flex items-center gap-1 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            企業・組織
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word min-w-0 max-w-full">
                            {jobData.appealPoints.company.join('、')}
                          </div>
                        </div>

                        {/* チーム・文化 */}
                        <div className='flex flex-col flex items-center gap-1 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            チーム・文化
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word min-w-0 max-w-full">
                            {jobData.appealPoints.team.join('、')}
                          </div>
                        </div>

                        {/* 働き方・制度 */}
                        <div className='flex flex-col flex items-center gap-1 items-start justify-start min-w-0 max-w-full'>
                          <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                            働き方・制度
                          </div>
                          <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word min-w-0 max-w-full">
                            {jobData.appealPoints.workstyle.join('、')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      {/* ラベル部分（左側） */}
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          受動喫煙防止措置
                        </div>
                      </div>

                      {/* 内容部分（右側） */}
                      <div className='bg-white p-6 w-full rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word w-full max-w-full">
                          {jobData.smoke}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 応募時のレジュメ提出 */}
                  <div className='flex flex-col gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                    <div className='flex flex-col lg:flex-row gap-0 items-stretch justify-start w-full max-w-full overflow-hidden rounded-[10px]'>
                      <div className='bg-[#efefef] px-6 py-3 flex items-center w-full lg:w-[200px] lg:flex-shrink-0 rounded-t-[10px] lg:rounded-l-[10px] lg:rounded-tr-none'>
                        <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                          応募時のレジュメ提出
                        </div>
                      </div>
                      <div className='bg-white p-6 w-full rounded-b-[10px] lg:rounded-r-[10px] lg:rounded-bl-none overflow-hidden'>
                        <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word w-full max-w-full">
                          {(() => {
                            const resumeRequired = jobData.resumeRequired;
                            return resumeRequired && resumeRequired.length > 0
                              ? resumeRequired.join('、')
                              : '提出書類の指定なし';
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* スマホ時は記事の下に移動、PC時は右側サイドバー */}
              <div className='order-2 lg:order-1'>
                <Suspense
                  fallback={
                    <div className='w-full lg:w-[320px] bg-white rounded-[10px] p-6 max-w-full overflow-hidden'>
                      <div className='flex flex-col gap-6 items-start justify-start max-w-full overflow-hidden'>
                        <div className='animate-pulse'>
                          <div className='h-6 bg-gray-200 rounded w-32 mb-6'></div>
                          {Array.from({ length: 8 }).map((_, index) => (
                            <div
                              key={index}
                              className='flex flex-col gap-2 mb-6'
                            >
                              <div className='h-4 bg-gray-200 rounded w-20 mb-2'></div>
                              <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  }
                >
                  {companyId && (
                    <CompanyDetailsSidebar
                      companyId={companyId}
                      fallbackData={{
                        companyName:
                          companyData?.companyName || jobData?.companyName,
                        representative:
                          companyData?.representative ||
                          jobData?.representative,
                        industry: companyData?.industry || jobData?.industry,
                        businessContent:
                          companyData?.businessContent ||
                          jobData?.businessContent,
                        address: companyData?.address || jobData?.address,
                      }}
                    />
                  )}
                </Suspense>
              </div>
            </div>

            {/* お気に入り・応募ボタン - スマホ時は企業情報の後に表示 */}
            <div
              className='order-3 rounded-[24px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] px-3 sm:px-4 lg:px-16 py-3 sm:py-4 lg:py-5 fixed left-2 right-2 sm:left-4 sm:right-4 lg:left-10 lg:right-10 bottom-4 lg:bottom-[20px] z-50'
              style={{
                background: 'rgba(255,255,255,0.9)',
              }}
            >
              <div className='flex flex-col lg:flex-row gap-2 lg:gap-4 items-center justify-center w-full'>
                <button
                  onClick={handleFavoriteToggle}
                  disabled={favoriteToggleMutation.isPending}
                  className={`flex flex-row gap-1 sm:gap-1.5 lg:gap-2 items-center justify-center w-full lg:w-auto lg:min-w-40 px-3 sm:px-4 lg:px-10 py-3 lg:py-3.5 rounded-[32px] transition-all duration-200 ease-in-out min-h-[44px] sm:min-h-[50px] lg:min-h-[56px] ${
                    favoriteToggleMutation.isPending
                      ? 'opacity-70 cursor-not-allowed'
                      : ''
                  } ${
                    isFavorite
                      ? 'bg-[#FFDA5F] hover:bg-[#E5C54F] text-[#323232]'
                      : 'bg-white hover:bg-[#f5f5f5] text-[#999] border border-[#999]'
                  }`}
                >
                  <Star
                    size={12}
                    className={`${
                      isFavorite
                        ? 'fill-[#323232] text-[#323232]'
                        : 'text-[#999]'
                    } flex-shrink-0 sm:w-[14px] sm:h-[14px]`}
                  />
                  <span
                    className={`font-['Noto_Sans_JP'] font-bold text-[16px] leading-[1.4] sm:leading-[1.6] lg:leading-[2] tracking-[0.6px] sm:tracking-[0.8px] lg:tracking-[1.6px] ${
                      isFavorite ? 'text-[#323232]' : 'text-[#999]'
                    } whitespace-nowrap`}
                  >
                    {favoriteToggleMutation.isPending
                      ? '処理中...'
                      : isFavorite
                        ? 'お気に入り解除'
                        : 'お気に入りに登録'}
                  </span>
                </button>

                <button
                  onClick={handleApply}
                  className='bg-gradient-to-r from-[#26AF94] to-[#3A93CB] flex flex-row gap-1 sm:gap-1.5 lg:gap-2 items-center justify-center w-full lg:w-[228px] px-3 sm:px-4 lg:px-10 py-3 lg:py-3.5 rounded-[32px] transition-all duration-200 ease-in-out min-h-[44px] sm:min-h-[50px] lg:min-h-[56px]'
                  style={{
                    background:
                      'linear-gradient(263deg, #26AF94 0%, #3A93CB 100%)',
                    boxShadow: '0 5px 10px 0 rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background =
                      'linear-gradient(to right, #249881, #27668D)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background =
                      'linear-gradient(to right, #26AF94, #3A93CB)';
                  }}
                >
                  <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[1.4] sm:leading-[1.6] lg:leading-[2] tracking-[0.6px] sm:tracking-[0.8px] lg:tracking-[1.6px] text-white whitespace-nowrap">
                    応募する
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        {/* 検索結果に戻るセクション */}
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] flex flex-col gap-6 sm:gap-10 items-center justify-start px-4 sm:px-8 lg:px-20 py-8 sm:py-10 w-full'>
          <button
            onClick={handleBackToResults}
            className='flex flex-row gap-2.5 items-center justify-center min-w-32 sm:min-w-40 px-6 sm:px-10 py-3 sm:py-3.5 relative rounded-[32px] border-2 border-white cursor-pointer transition-all duration-200'
            onMouseEnter={e => {
              e.currentTarget.style.backgroundColor =
                'rgba(255, 255, 255, 0.30)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div className="font-['Noto_Sans_JP'] font-bold text-[14px] sm:text-[16px] leading-[1.8] sm:leading-[2] tracking-[1.4px] sm:tracking-[1.6px] text-white">
              検索結果に戻る
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
