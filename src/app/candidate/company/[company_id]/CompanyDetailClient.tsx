'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
// import {
//   useFavoriteStatusQuery,
//   useFavoriteToggleMutation,
// } from '@/hooks/useFavoriteApi';
import { TagDisplay } from '@/components/ui/TagDisplay';
import { CompanyDetailData, JobPostingData } from './actions';
import { useCompanyDetail } from '@/hooks/useCompanyDetail';
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

    if (typeof window === 'undefined') {
      return;
    }

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

export default function CompanyDetailClient({
  initialCompanyData,
  jobPostings = [],
}: CompanyDetailClientProps) {
  const router = useRouter();
  const params = useParams();
  const companyId = params?.company_id as string;
  
  // クライアントサイドで企業データを非同期で取得
  const { data: asyncCompanyData, loading: companyDataLoading, error: companyDataError } = useCompanyDetail(companyId);
  
  // 初期データがある場合はそれを使用、なければ非同期で取得したデータを使用
  const companyData = initialCompanyData || asyncCompanyData;
  

  // 画像カルーセル用のstate
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  // TODO: 企業用のお気に入り機能のhookを実装
  // const { data: favoriteStatus } = useCompanyFavoriteStatusQuery([companyId]);
  // const favoriteToggleMutation = useCompanyFavoriteToggleMutation();

  // お気に入り状態をローカルステートで管理（即座の更新のため）
  const [isFavorite, setIsFavorite] = useState(false);
  // 求人のお気に入り状態（各求人に対応）
  const [jobFavorites, setJobFavorites] = useState<Record<number, boolean>>({});

  // favoriteStatusが更新されたらローカルステートも更新
  // useEffect(() => {
  //   if (favoriteStatus !== undefined && companyId) {
  //     setIsFavorite(favoriteStatus[companyId] || false);
  //   }
  // }, [favoriteStatus, companyId]);

  // 画像の自動切り替え
  useEffect(() => {
    if (!companyData || !companyData.images || companyData.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex(
        prevIndex => (prevIndex + 1) % companyData.images.length
      );
    }, 2500); // 2.5秒間隔

    return () => clearInterval(interval);
  }, [companyData]);

  const handleFavoriteToggle = async () => {
    // TODO: 企業用のお気に入り機能の実装
    // if (favoriteToggleMutation.isPending) return; // 処理中は無効化

    // 楽観的更新: 即座にUIを更新
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    try {
      // await favoriteToggleMutation.mutateAsync({
      //   companyId: companyId,
      //   isFavorite: isFavorite,
      // });
      if (process.env.NODE_ENV === 'development') console.log('企業お気に入り切り替え:', { companyId, newFavoriteState });
    } catch (error) {
      if (process.env.NODE_ENV === 'development') console.error('お気に入りの切り替えに失敗しました:', error);
      // エラーの場合は元の状態に戻す
      setIsFavorite(!newFavoriteState);
    }
  };

  const handleApply = () => {
    // 企業詳細ページから応募ページへの遷移
    if (params.company_id) {
      router.push(`/company/${params.company_id}/apply`);
    }
  };

  const handleBackToResults = () => {
    router.push('/company/search');
  };

  // エラー状態の場合はエラーメッセージを表示
  if (companyDataError && !initialCompanyData) {
    return (
      <div className='w-full h-screen flex items-center justify-center bg-[#f9f9f9]'>
        <div className='text-center'>
          <p className='text-gray-500'>企業情報を読み込めませんでした</p>
          <p className='text-sm text-gray-400 mt-2'>{companyDataError}</p>
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

  // データがないが読み込み中でもエラーでもない場合は、初期データなしでページを表示
  // サイドバーは読み込み状態を表示する

  return (
    <>
      <div className='bg-[#F9F9F9] min-h-screen pb-20 pt-6 px-4 lg:pt-10 lg:px-20'>
        <div className='max-w-[1280px] mx-auto overflow-hidden'>
          {/* ヘッダー部分 */}
            {/* 企業情報 */}
            <div className='flex flex-row gap-4 items-center justify-start w-full mb-10'>
              <div className='relative rounded-full shrink-0 w-10 h-10 overflow-hidden'>
                <Image
                  src={companyData?.companyLogo || '/company.jpg'}
                  alt={companyData?.companyName || '企業ロゴ'}
                  fill
                  sizes='40px'
                  priority
                  className='object-cover'
                />
              </div>
              <div className='flex-1'>
                <span className="font-['Noto_Sans_JP'] font-bold text-[20px] md:text-[32px] leading-[1.6] tracking-[2.4px] text-[#0f9058] break-words overflow-wrap-break-word line-break-auto max-w-full">
                  {companyDataLoading ? (
                    <div className="animate-pulse">
                      <div className="h-8 md:h-10 bg-gray-200 rounded w-48"></div>
                    </div>
                  ) : (
                    companyData?.companyName || '企業名未設定'
                  )}
                </span>
              </div>
            </div>

          {/* メインコンテンツ */}
          <div className='flex flex-col gap-8 min-w-0 max-w-full overflow-hidden'>
            <div className='flex flex-col lg:flex-row gap-8 lg:gap-16 items-start justify-start w-full max-w-full'>
              {/* 企業詳細 - スマホ時は最初に表示 */}
              <div className='order-1 lg:order-1 flex flex-col gap-10 items-start justify-start lg:flex-1 min-w-0 max-w-full overflow-hidden'>
                {/* 画像・プログレス・タグセクション */}
                <div className='flex flex-col gap-4 items-start justify-start w-full'>
                  {/* 画像 */}
                  <div className='relative aspect-[3/2] rounded-[10px] md:rounded-3xl w-full overflow-hidden'>
                    <Image
                      src={companyData?.images?.[currentImageIndex] || '/company.jpg'}
                      alt={`${companyData?.companyName || '企業'} - 画像${currentImageIndex + 1}`}
                      fill
                      className='object-cover transition-all ease-in-out'
                      style={{ transitionDuration: '0.6s' }}
                    />
                  </div>

                  {/* プログレスバー */}
                  {companyData?.images && companyData.images.length > 1 && (
                    <div className='flex flex-row gap-1 h-2 items-center justify-start w-full'>
                      {companyData.images.map((_, index) => (
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

                {/* アピールポイントタイトルテキスト */}
                <div className='flex flex-col gap-4 items-start justify-start w-full'>
                  <div className='flex flex-row gap-3 min-h-[40px] items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                    <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                      アピールポイントタイトルテキストが入ります
                    </h2>
                  </div>

                  {/* 業務内容 */}
                  <div className='flex flex-col items-start justify-start w-full'>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {companyData?.jobDescription || '企業説明文を読み込み中...'}
                    </div>
                  </div>
                </div>

                {/* アピールポイントタイトルテキスト */}
                <div className='flex flex-col gap-4 items-start justify-start w-full'>
                  <div className='flex flex-row gap-3 min-h-[40px] items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                    <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] lg:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                      アピールポイントタイトルテキストが入ります
                    </h2>
                  </div>

                  {/* 業務内容 */}
                  <div className='flex flex-col items-start justify-start w-full'>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {companyData?.positionSummary || 'ポジション説明を読み込み中...'}
                    </div>
                  </div>
                </div>

              </div>

              {/* スマホ時は掲載求人の上に配置、PC時は右側サイドバー */}
              <div className='order-2 lg:order-2 w-full lg:w-[320px] bg-white rounded-[10px] p-6 max-w-full overflow-hidden'>
                <div className='flex flex-col gap-6 items-start justify-start max-w-full overflow-hidden'>

                  {/* 代表者 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 15 16'
                      >
                        <path d='M7.11111 8C8.18882 8 9.22238 7.57857 9.98443 6.82843C10.7465 6.07828 11.1746 5.06087 11.1746 4C11.1746 2.93913 10.7465 1.92172 9.98443 1.17157C9.22238 0.421427 8.18882 0 7.11111 0C6.03341 0 4.99984 0.421427 4.23779 1.17157C3.47574 1.92172 3.04762 2.93913 3.04762 4C3.04762 5.06087 3.47574 6.07828 4.23779 6.82843C4.99984 7.57857 6.03341 8 7.11111 8ZM5.66032 9.5C2.53333 9.5 0 11.9937 0 15.0719C0 15.5844 0.422222 16 0.942857 16H13.2794C13.8 16 14.2222 15.5844 14.2222 15.0719C14.2222 11.9937 11.6889 9.5 8.5619 9.5H5.66032Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        代表者
                      </div>
                    </div>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                      {companyDataLoading ? (
                        <div className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        </div>
                      ) : (
                        companyData?.representative || '代表者名未設定'
                      )}
                    </div>
                  </div>

                  {/* 設立年 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 15 16'
                      >
                        <path d='M2.00353 1C2.00353 0.446875 1.55586 0 1.00176 0C0.447663 0 0 0.446875 0 1V2V11.5V15C0 15.5531 0.447663 16 1.00176 16C1.55586 16 2.00353 15.5531 2.00353 15V11L4.01645 10.4969C5.30309 10.175 6.66486 10.325 7.85132 10.9156C9.23501 11.6062 10.841 11.6906 12.2873 11.1469L13.3735 10.7406C13.7649 10.5938 14.0247 10.2219 14.0247 9.80313V2.0625C14.0247 1.34375 13.2671 0.875 12.6222 1.19687L12.3217 1.34687C10.8723 2.07187 9.16614 2.07187 7.71671 1.34687C6.6179 0.796875 5.3563 0.659375 4.16358 0.95625L2.00353 1.5V1Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        設立年
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 items-start justify-start'>
                      <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                        {companyDataLoading ? (
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-16"></div>
                          </div>
                        ) : (
                          companyData?.establishedYear || '未設定'
                        )}
                      </span>
                      <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        年
                      </span>
                    </div>
                  </div>

                  {/* 資本金 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 12 16'
                      >
                        <path d='M2.08516 0.510485C1.73659 -0.0180946 1.03235 -0.157382 0.505942 0.192623C-0.0204629 0.542628 -0.155621 1.24978 0.192944 1.77836L3.56478 6.85701H1.70814C1.07858 6.85701 0.569964 7.36773 0.569964 7.99988C0.569964 8.63203 1.07858 9.14276 1.70814 9.14276H4.55357V10.2856H1.70814C1.07858 10.2856 0.569964 10.7964 0.569964 11.4285C0.569964 12.0607 1.07858 12.5714 1.70814 12.5714H4.55357V14.8571C4.55357 15.4893 5.06219 16 5.69174 16C6.32129 16 6.82991 15.4893 6.82991 14.8571V12.5714H9.67534C10.3049 12.5714 10.8135 12.0607 10.8135 11.4285C10.8135 10.7964 10.3049 10.2856 9.67534 10.2856H6.82991V9.14276H9.67534C10.3049 9.14276 10.8135 8.63203 10.8135 7.99988C10.8135 7.36773 10.3049 6.85701 9.67534 6.85701H7.8187L11.1905 1.77836C11.5391 1.25335 11.3968 0.542628 10.874 0.192623C10.3511 -0.157382 9.64333 -0.0145231 9.29477 0.510485L5.69174 5.93914L2.08516 0.510485Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        資本金
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 items-start justify-start'>
                      <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                        {companyData.capital}
                      </span>
                      <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        万円
                      </span>
                    </div>
                  </div>

                  {/* 従業員数 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 16 13'
                      >
                        <path d='M3.6 0C4.13043 0 4.63914 0.208897 5.01421 0.580736C5.38929 0.952576 5.6 1.4569 5.6 1.98276C5.6 2.50862 5.38929 3.01294 5.01421 3.38478C4.63914 3.75662 4.13043 3.96552 3.6 3.96552C3.06957 3.96552 2.56086 3.75662 2.18579 3.38478C1.81071 3.01294 1.6 2.50862 1.6 1.98276C1.6 1.4569 1.81071 0.952576 2.18579 0.580736C2.56086 0.208897 3.06957 0 3.6 0ZM12.8 0C13.3304 0 13.8391 0.208897 14.2142 0.580736C14.5893 0.952576 14.8 1.4569 14.8 1.98276C14.8 2.50862 14.5893 3.01294 14.2142 3.38478C13.8391 3.75662 13.3304 3.96552 12.8 3.96552C12.2696 3.96552 11.7609 3.75662 11.3858 3.38478C11.0107 3.01294 10.8 2.50862 10.8 1.98276C10.8 1.4569 11.0107 0.952576 11.3858 0.580736C11.7609 0.208897 12.2696 0 12.8 0ZM0 7.40312C0 5.94332 1.195 4.75862 2.6675 4.75862H3.735C4.1325 4.75862 4.51 4.84537 4.85 4.99903C4.8175 5.17748 4.8025 5.36336 4.8025 5.55172C4.8025 6.49849 5.2225 7.3486 5.885 7.93103C5.88 7.93103 5.875 7.93103 5.8675 7.93103H0.5325C0.24 7.93103 0 7.6931 0 7.40312ZM10.1325 7.93103C10.1275 7.93103 10.1225 7.93103 10.115 7.93103C10.78 7.3486 11.1975 6.49849 11.1975 5.55172C11.1975 5.36336 11.18 5.17996 11.15 4.99903C11.49 4.84289 11.8675 4.75862 12.265 4.75862H13.3325C14.805 4.75862 16 5.94332 16 7.40312C16 7.69558 15.76 7.93103 15.4675 7.93103H10.135H10.1325ZM5.6 5.55172C5.6 4.92069 5.85286 4.3155 6.30294 3.8693C6.75303 3.42309 7.36348 3.17241 8 3.17241C8.63652 3.17241 9.24697 3.42309 9.69706 3.8693C10.1471 4.3155 10.4 4.92069 10.4 5.55172C10.4 6.18276 10.1471 6.78794 9.69706 7.23415C9.24697 7.68036 8.63652 7.93103 8 7.93103C7.36348 7.93103 6.75303 7.68036 6.30294 7.23415C5.85286 6.78794 5.6 6.18276 5.6 5.55172ZM3.2 12.0279C3.2 10.2038 4.6925 8.72414 6.5325 8.72414H9.465C11.3075 8.72414 12.8 10.2038 12.8 12.0279C12.8 12.3922 12.5025 12.6897 12.1325 12.6897H3.865C3.4975 12.6897 3.1975 12.3947 3.1975 12.0279H3.2Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        従業員数
                      </div>
                    </div>
                    <div className='flex flex-row gap-2 items-start justify-start'>
                      <span className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                        {companyData.employeeCount}
                      </span>
                      <span className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#323232]">
                        人
                      </span>
                    </div>
                  </div>

                  {/* 業種 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full overflow-hidden'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 12 16'
                      >
                        <path d='M1.48148 0C0.66358 0 0 0.671875 0 1.5V14.5C0 15.3281 0.66358 16 1.48148 16H4.44444V13.5C4.44444 12.6719 5.10803 12 5.92593 12C6.74383 12 7.40741 12.6719 7.40741 13.5V16H10.3704C11.1883 16 11.8519 15.3281 11.8519 14.5V1.5C11.8519 0.671875 11.1883 0 10.3704 0H1.48148ZM1.97531 7.5C1.97531 7.225 2.19753 7 2.46914 7H3.45679C3.7284 7 3.95062 7.225 3.95062 7.5V8.5C3.95062 8.775 3.7284 9 3.45679 9H2.46914C2.19753 9 1.97531 8.775 1.97531 8.5V7.5ZM5.4321 7H6.41975C6.69136 7 6.91358 7.225 6.91358 7.5V8.5C6.91358 8.775 6.69136 9 6.41975 9H5.4321C5.16049 9 4.93827 8.775 4.93827 8.5V7.5C4.93827 7.225 5.16049 7 5.4321 7ZM7.90124 7.5C7.90124 7.225 8.12346 7 8.39506 7H9.38272C9.65432 7 9.87654 7.225 9.87654 7.5V8.5C9.87654 8.775 9.65432 9 9.38272 9H8.39506C8.12346 9 7.90124 8.775 7.90124 8.5V7.5ZM2.46914 3H3.45679C3.7284 3 3.95062 3.225 3.95062 3.5V4.5C3.95062 4.775 3.7284 5 3.45679 5H2.46914C2.19753 5 1.97531 4.775 1.97531 4.5V3.5C1.97531 3.225 2.19753 3 2.46914 3ZM4.93827 3.5C4.93827 3.225 5.16049 3 5.4321 3H6.41975C6.69136 3 6.91358 3.225 6.91358 3.5V4.5C6.91358 4.775 6.69136 5 6.41975 5H5.4321C5.16049 5 4.93827 4.775 4.93827 4.5V3.5ZM8.39506 3H9.38272C9.65432 3 9.87654 3.225 9.87654 3.5V4.5C9.87654 4.775 9.65432 5 9.38272 5H8.39506C8.12346 5 7.90124 4.775 7.90124 4.5V3.5C7.90124 3.225 8.12346 3 8.39506 3Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        業種
                      </div>
                    </div>
                    <div className='flex flex-wrap gap-2 items-start justify-start w-full'>
                      {companyData.industry.split('、').slice(0, 3).map((industry, index) => (
                        <div
                          key={index}
                          className='bg-[#d2f1da] flex gap-2.5 items-center justify-center px-4 py-0 rounded-[5px] shrink-0'
                        >
                          <span className="font-['Noto_Sans_JP'] font-medium text-[#0f9058] text-[14px] text-center whitespace-nowrap tracking-[1.4px] leading-[2]">
                            {industry.trim()}
                          </span>
                        </div>
                      ))}
                      {companyData.industry.split('、').length > 3 && (
                        <div className='bg-[#d2f1da] flex gap-2.5 items-center justify-center px-4 py-0 rounded-[5px] shrink-0'>
                          <span className="font-['Noto_Sans_JP'] font-medium text-[#0f9058] text-[14px] text-center whitespace-nowrap tracking-[1.4px] leading-[2]">
                            ...
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 事業内容 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 16 15'
                      >
                        <path d='M5.75 1.5H10.25C10.3875 1.5 10.5 1.6125 10.5 1.75V3H5.5V1.75C5.5 1.6125 5.6125 1.5 5.75 1.5ZM4 1.75V3H2C0.896875 3 0 3.89688 0 5V8H6H10H16V5C16 3.89688 15.1031 3 14 3H12V1.75C12 0.784375 11.2156 0 10.25 0H5.75C4.78438 0 4 0.784375 4 1.75ZM16 9H10V10C10 10.5531 9.55313 11 9 11H7C6.44687 11 6 10.5531 6 10V9H0V13C0 14.1031 0.896875 15 2 15H14C15.1031 15 16 14.1031 16 13V9Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        事業内容
                      </div>
                    </div>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {companyDataLoading ? (
                        <div className="animate-pulse space-y-2">
                          <div className="h-4 bg-gray-200 rounded"></div>
                          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                      ) : (
                        companyData?.businessContent || '事業内容未設定'
                      )}
                    </div>
                  </div>

                  {/* 所在地 */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 13 16'
                      >
                        <path d='M6.78148 15.6405C8.39432 13.629 12.0727 8.7539 12.0727 6.01557C12.0727 2.69447 9.36894 0 6.03636 0C2.70379 0 0 2.69447 0 6.01557C0 8.7539 3.67841 13.629 5.29125 15.6405C5.67795 16.1198 6.39477 16.1198 6.78148 15.6405ZM6.03636 4.01038C6.57001 4.01038 7.0818 4.22164 7.45915 4.59768C7.83649 4.97373 8.04848 5.48376 8.04848 6.01557C8.04848 6.54738 7.83649 7.0574 7.45915 7.43345C7.0818 7.8095 6.57001 8.02076 6.03636 8.02076C5.50272 8.02076 4.99092 7.8095 4.61358 7.43345C4.23623 7.0574 4.02424 6.54738 4.02424 6.01557C4.02424 5.48376 4.23623 4.97373 4.61358 4.59768C4.99092 4.22164 5.50272 4.01038 6.03636 4.01038Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        所在地
                      </div>
                    </div>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] whitespace-pre-wrap break-words overflow-wrap-break-word max-w-full">
                      {companyDataLoading ? (
                        <div className="animate-pulse space-y-1">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                        </div>
                      ) : (
                        companyData?.address || '所在地未設定'
                      )}
                    </div>
                  </div>

                  {/* 企業フェーズ */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 10 16'
                      >
                        <path d='M4.93812 1.50007C4.93812 1.10223 5.09413 0.72068 5.37182 0.439361C5.64952 0.158043 6.02615 0 6.41887 0C6.81158 0 7.18822 0.158043 7.46591 0.439361C7.7436 0.72068 7.89961 1.10223 7.89961 1.50007C7.89961 1.89792 7.7436 2.27947 7.46591 2.56079C7.18822 2.8421 6.81158 3.00015 6.41887 3.00015C6.02615 3.00015 5.64952 2.8421 5.37182 2.56079C5.09413 2.27947 4.93812 1.89792 4.93812 1.50007ZM3.90469 6.22843C3.87384 6.24093 3.84607 6.25343 3.81523 6.26593L3.56844 6.37531C3.06252 6.60345 2.67382 7.03784 2.49798 7.56912L2.41778 7.81288C2.24502 8.33791 1.68666 8.61917 1.1684 8.44416C0.650139 8.26915 0.372499 7.7035 0.545253 7.17848L0.62546 6.93471C0.977136 5.86904 1.75453 5.00024 2.76637 4.54397L3.01316 4.43459C3.65481 4.14708 4.34891 3.99707 5.05226 3.99707C6.42812 3.99707 7.66824 4.83461 8.19576 6.11905L8.67083 7.27223L9.33099 7.60662C9.8184 7.85351 10.0158 8.45354 9.77213 8.94731C9.52843 9.44109 8.93613 9.6411 8.44872 9.39421L7.62197 8.97856C7.30423 8.81606 7.05435 8.54729 6.91862 8.2129L6.62247 7.49412L6.02709 9.54109L7.5541 11.2287C7.72069 11.4131 7.83791 11.6349 7.89961 11.8787L8.60913 14.757C8.74178 15.2914 8.42095 15.8351 7.89035 15.9695C7.35975 16.1039 6.82607 15.7789 6.69342 15.2414L6.01475 12.4881L3.83374 10.0786C3.37717 9.57547 3.2075 8.87231 3.38026 8.2129L3.9016 6.22843H3.90469ZM2.12163 12.4381L2.89285 10.488C2.95763 10.5818 3.03167 10.6693 3.10879 10.7568L4.36433 12.1443L3.91703 13.2756C3.84299 13.4632 3.73193 13.635 3.59003 13.7788L1.68666 15.707C1.30105 16.0977 0.674818 16.0977 0.289208 15.707C-0.0964025 15.3164 -0.0964025 14.682 0.289208 14.2913L2.12163 12.4381Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        企業フェーズ
                      </div>
                    </div>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                      {companyData.companyPhase}
                    </div>
                  </div>

                  {/* URL */}
                  <div className='flex flex-col gap-2 items-start justify-start w-full'>
                    <div className='flex flex-row gap-2 h-7 items-center justify-start pb-1 pt-0 px-0 w-full border-b border-[#dcdcdc]'>
                      <svg
                        className='w-4 h-4 text-[#0f9058]'
                        fill='currentColor'
                        viewBox='0 0 16 16'
                      >
                        <path d='M10.9979 0C10.5948 0 10.2293 0.24375 10.073 0.61875C9.91681 0.99375 10.0043 1.42188 10.2886 1.70938L11.5821 3L6.29252 8.29375C5.90197 8.68437 5.90197 9.31875 6.29252 9.70938C6.68307 10.1 7.31732 10.1 7.70787 9.70938L12.9975 4.41563L14.291 5.70937C14.5784 5.99687 15.0064 6.08125 15.3814 5.925C15.7563 5.76875 16 5.40625 16 5V1C16 0.446875 15.5532 0 15.0002 0L10.9979 0ZM2.49951 1C1.11853 1 0 2.11875 0 3.5V13.5C0 14.8813 1.11853 16 2.49951 16H12.4976C13.8785 16 14.9971 14.8813 14.9971 13.5V10C14.9971 9.44687 14.5503 9 13.9973 9C13.4443 9 12.9975 9.44687 12.9975 10V13.5C12.9975 13.775 12.7725 14 12.4976 14H2.49951C2.22457 14 1.99961 13.775 1.99961 13.5V3.5C1.99961 3.225 2.22457 3 2.49951 3H5.99883C6.55185 3 6.99863 2.55313 6.99863 2C6.99863 1.44687 6.55185 1 5.99883 1H2.49951Z' />
                      </svg>
                      <div className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[2] tracking-[1.6px] text-[#0f9058]">
                        URL
                      </div>
                    </div>
                    <div className="font-['Noto_Sans_JP'] font-medium text-[16px] leading-[2] tracking-[1.6px] text-[#323232] break-words overflow-wrap-break-word line-break-auto max-w-full">
                      {companyData.website}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 掲載求人セクション - スマホ時は一番下に配置 */}
            <div className='order-3 w-full'>
              <div className='flex flex-col gap-4 items-start justify-start w-full'>
                <div className='flex flex-row gap-3 h-10 items-center justify-start pb-2 pt-0 px-0 w-full border-b-2 border-[#dcdcdc]'>
                  <svg
                    className='w-5 h-5 text-[#0f9058]'
                    viewBox='0 0 32 32'
                    fill='currentColor'
                    xmlns='http://www.w3.org/2000/svg'
                  >
                    <path d='M15.9998 0C13.3525 0 11.0978 1.66875 10.2682 4H7.89318C5.65751 4 3.83984 5.79375 3.83984 8V28C3.83984 30.2062 5.65751 32 7.89318 32H24.1065C26.3422 32 28.1598 30.2062 28.1598 28V8C28.1598 5.79375 26.3422 4 24.1065 4H21.7315C20.9018 1.66875 18.6472 0 15.9998 0ZM15.9998 4C16.5374 4 17.0528 4.21071 17.4329 4.58579C17.813 4.96086 18.0265 5.46957 18.0265 6C18.0265 6.53043 17.813 7.03914 17.4329 7.41421C17.0528 7.78929 16.5374 8 15.9998 8C15.4623 8 14.9468 7.78929 14.5668 7.41421C14.1867 7.03914 13.9732 6.53043 13.9732 6C13.9732 5.46957 14.1867 4.96086 14.5668 4.58579C14.9468 4.21071 15.4623 4 15.9998 4ZM8.39984 17C8.39984 16.6022 8.55999 16.2206 8.84504 15.9393C9.1301 15.658 9.51672 15.5 9.91984 15.5C10.323 15.5 10.7096 15.658 10.9946 15.9393C11.2797 16.2206 11.4398 16.6022 11.4398 17C11.4398 17.3978 11.2797 17.7794 10.9946 18.0607C10.7096 18.342 10.323 18.5 9.91984 18.5C9.51672 18.5 9.1301 18.342 8.84504 18.0607C8.55999 17.7794 8.39984 17.3978 8.39984 17ZM14.9865 16H23.0932C23.6505 16 24.1065 16.45 24.1065 17C24.1065 17.55 23.6505 18 23.0932 18H14.9865C14.4292 18 13.9732 17.55 13.9732 17C13.9732 16.45 14.4292 16 14.9865 16ZM8.39984 23C8.39984 22.6022 8.55999 22.2206 8.84504 21.9393C9.1301 21.658 9.51672 21.5 9.91984 21.5C10.323 21.5 10.7096 21.658 10.9946 21.9393C11.2797 22.2206 11.4398 22.6022 11.4398 23C11.4398 23.3978 11.2797 23.7794 10.9946 24.0607C10.7096 24.342 10.323 24.5 9.91984 24.5C9.51672 24.5 9.1301 24.342 8.84504 24.0607C8.55999 23.7794 8.39984 23.3978 8.39984 23ZM13.9732 23C13.9732 22.45 14.4292 22 14.9865 22H23.0932C23.6505 22 24.1065 22.45 24.1065 23C24.1065 23.55 23.6505 24 23.0932 24H14.9865C14.4292 24 13.9732 23.55 13.9732 23Z' />
                  </svg>

                  <h2 className="font-['Noto_Sans_JP'] font-bold text-[20px] md:text-[24px] leading-[1.6] tracking-[2.4px] text-[#323232]">
                    掲載求人
                  </h2>
                </div>

                {/* 採用情報一覧 */}
                <div className='flex flex-col gap-2 items-start justify-start w-full'>
                  {/* 実際の求人データまたはサンプルデータを表示 */}
                  {(jobPostings.length > 0 ? jobPostings : Array(6).fill(null)).map((job, index) => (
                    <div key={job?.id || index} className='bg-[#fff] flex md:flex-row flex-col gap-4 items-start justify-start w-full cursor-pointer hover:bg-[#E9E9E9] p-[24px] rounded-[10px] transition-colors border border-gray-100 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)]'
                         onClick={() => {
                           if (job?.id) {
                             // 実際の求人IDがある場合は求人詳細ページへ遷移
                             router.push(`/candidate/search/setting/${job.id}`);
                           } else {
                             // サンプルデータの場合はアラートを表示
                             alert('この求人は現在データベースに存在しません。サンプル表示です。');
                           }
                         }}>
                      {/* 左側の画像 */}
                      <div className='relative md:w-20 md:h-[53px] w-full h-[208px] overflow-hidden bg-gray-200 rounded-[5px] flex-shrink-0'>
                        {(job?.image_urls?.[0] || companyData.images?.[0]) ? (
                          <Image
                            src={job?.image_urls?.[0] || companyData.images[0]}
                            alt={job?.title || `求人${index + 1}`}
                            fill
                            className='object-cover'
                          />
                        ) : (
                          <div className='w-full h-full bg-gray-300 flex items-center justify-center'>
                            <div className='md:w-8 md:h-8 w-16 h-16 bg-gray-400 rounded'></div>
                          </div>
                        )}
                      </div>
                      
                      {/* 中央のコンテンツ */}
                      <div className='flex flex-col flex-1 min-w-0'>
                        {/* スマホ画面時：タグが先、PC画面時：タイトルが先 */}
                        <div className='md:hidden'>
                          {/* スマホ：タグと星を同じ行に配置 */}
                          <div className='flex flex-row justify-between items-start gap-2'>
                            <div className='flex flex-row gap-2 items-start flex-wrap flex-1'>
                              {/* 実際の求人データがある場合はその情報を使用 */}
                              {(job ? [
                                getEmploymentTypeInJapanese(job.employment_type),
                                ...(job.work_location?.slice(0, 2) || [])
                              ] : ['正社員', 'リモート', 'フレックス']).map((tag, tagIndex) => (
                                <span
                                  key={`${index}-${tagIndex}`}
                                  className='py-0.5 px-3 bg-[#d2f1da] rounded-[5px] text-[#0f9058] font-medium text-[12px] whitespace-nowrap'
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                            {/* スマホ：星をタグと同じ行の右端に配置 */}
                            <button
                              type='button'
                              className='flex-shrink-0 items-start'
                              onClick={(e) => {
                                e.stopPropagation();
                                setJobFavorites(prev => ({
                                  ...prev,
                                  [index]: !prev[index]
                                }));
                              }}
                              aria-label='お気に入り'
                            >
                              <svg
                                width='24'
                                height='24'
                                viewBox='0 0 32 32'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                              >
                                <path
                                  d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                                  fill={jobFavorites[index] ? '#FFDA5F' : '#DCDCDC'}
                                />
                              </svg>
                            </button>
                          </div>
                          {/* スマホ：タイトル */}
                          <h3 className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[1.6] tracking-[1.6px] text-[#0f9058] break-words overflow-wrap-break-word mt-2">
                            {job?.title || '求人テキストが入ります | 求人テキストが入ります'}
                          </h3>
                        </div>

                        {/* PC画面時：タグが先 */}
                        <div className='hidden md:block'>
                          {/* PC：タグ */}
                          <div className='flex flex-col gap-1'>
                            <div className='flex flex-row gap-2 items-start flex-wrap'>
                              {(job ? [
                                getEmploymentTypeInJapanese(job.employment_type),
                                ...(job.work_location?.slice(0, 2) || [])
                              ] : ['正社員', 'リモート', 'フレックス']).map((tag, tagIndex) => (
                                <span
                                  key={`${index}-${tagIndex}`}
                                  className='py-0.5 px-3 bg-[#d2f1da] rounded-[5px] text-[#0f9058] font-medium text-[12px] whitespace-nowrap'
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* PC：タイトル */}
                          <h3 className="font-['Noto_Sans_JP'] font-bold text-[16px] leading-[1.6] tracking-[1.6px] text-[#0f9058] break-words overflow-wrap-break-word mt-1">
                            {job?.title || '求人テキストが入ります | 求人テキストが入ります'}
                          </h3>
                        </div>
                      </div>
                      
                      {/* PC画面時の右側の星アイコン */}
                      <div className='hidden md:flex flex-col items-center justify-start pt-1'>
                        <button
                          type='button'
                          className='p-1'
                          onClick={(e) => {
                            e.stopPropagation();
                            // お気に入り機能の実装
                            setJobFavorites(prev => ({
                              ...prev,
                              [index]: !prev[index]
                            }));
                          }}
                          aria-label='お気に入り'
                        >
                          <svg
                            width='24'
                            height='24'
                            viewBox='0 0 32 32'
                            fill='none'
                            xmlns='http://www.w3.org/2000/svg'
                          >
                            <path
                              d='M17.7409 1.4809C17.4197 0.809848 16.741 0.382812 15.9956 0.382812C15.2503 0.382812 14.5776 0.809848 14.2504 1.4809L10.3538 9.55188L1.65173 10.8452C0.924534 10.955 0.318538 11.4674 0.0943199 12.169C-0.129899 12.8706 0.0519 13.6453 0.573056 14.1639L6.88753 20.4535L5.39678 29.3419C5.27558 30.074 5.57858 30.8182 6.17852 31.2514C6.77845 31.6845 7.57231 31.7394 8.22678 31.3917L16.0017 27.2128L23.7766 31.3917C24.4311 31.7394 25.225 31.6906 25.8249 31.2514C26.4248 30.8121 26.7278 30.074 26.6066 29.3419L25.1098 20.4535L31.4243 14.1639C31.9455 13.6453 32.1333 12.8706 31.903 12.169C31.6728 11.4674 31.0728 10.955 30.3456 10.8452L21.6375 9.55188L17.7409 1.4809Z'
                              fill={jobFavorites[index] ? '#FFDA5F' : '#DCDCDC'}
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
          </div>
        </div>
     
     
    </>
  );
}