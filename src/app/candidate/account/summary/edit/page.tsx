'use client';

import ActionButtons from '@/app/candidate/account/_shared/ui/ActionButtons';
import { FormField } from '@/app/candidate/account/_shared/fields/FormField';
import { useSummaryForm } from '../../_shared/hooks/useSummaryForm';
import Breadcrumb from '@/components/candidate/account/Breadcrumb';

// 候補者_職務要約編集ページ
export default function CandidateSummaryEditPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    handleCancel,
    onSubmit,
    isLoading,
    isDesktop,
    isAuthenticated,
    candidateUser,
  } = useSummaryForm();

  // const router = useRouter();
  // const isDesktop = useMediaQuery('(min-width: 1024px)');
  // const [isSubmitting, setIsSubmitting] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // useEffect ... 認証チェックや初期データ取得もカスタムフックに集約済みなので削除

  if (!isAuthenticated || !candidateUser) {
    return null;
  }

  return (
    <>
      {/* メインコンテンツ */}
      <main className='flex-1 relative z-[2]'>
        {/* 緑のグラデーション背景のヘッダー部分 */}
        <div className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 lg:px-20 py-6 lg:py-10'>
          {/* パンくずリスト */}
          <Breadcrumb
            items={[
              { label: 'プロフィール確認・編集', href: '/candidate/mypage' },
              { label: '職務要約', href: '/candidate/account/summary' },
              { label: '職務要約編集' },
            ]}
          />

          {/* タイトル */}
          <div className='flex items-center gap-2 lg:gap-4'>
            <div className='w-6 h-6 lg:w-8 lg:h-8 flex items-center justify-center'>
              {/* プロフィールアイコン */}
              <svg
                width='32'
                height='32'
                viewBox='0 0 32 32'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M8.34868 0H18.9813H19.8047L20.3871 0.581312L28.4372 8.63138L29.0186 9.21319V10.0366V26.6313C29.0186 29.5911 26.6102 32 23.6498 32H8.34862C5.38936 32 2.98099 29.5911 2.98099 26.6313V5.36763C2.98105 2.40775 5.38937 0 8.34868 0ZM4.96874 26.6313C4.96874 28.4984 6.48199 30.0123 8.34862 30.0123H23.6498C25.517 30.0123 27.0308 28.4984 27.0308 26.6313V10.0367H21.7984C20.2432 10.0367 18.9813 8.77525 18.9813 7.21956V1.98763H8.34862C6.48199 1.98763 4.96874 3.5015 4.96874 5.36756V26.6313Z'
                  fill='white'
                />
                <path
                  d='M10.5803 9.96484C11.0595 10.3003 11.643 10.4984 12.271 10.4984C12.8995 10.4984 13.4825 10.3003 13.9624 9.96484C14.801 10.3258 15.3161 10.9587 15.6304 11.5178C16.0478 12.2593 15.7205 13.309 14.9996 13.309C14.2777 13.309 12.271 13.309 12.271 13.309C12.271 13.309 10.2649 13.309 9.54298 13.309C8.8216 13.309 8.49379 12.2593 8.91173 11.5178C9.22604 10.9587 9.74117 10.3258 10.5803 9.96484Z'
                  fill='white'
                />
                <path
                  d='M12.2711 9.79659C11.0384 9.79659 10.0402 8.79841 10.0402 7.56628V7.03166C10.0402 5.80066 11.0384 4.80078 12.2711 4.80078C13.5032 4.80078 14.5024 5.80066 14.5024 7.03166V7.56628C14.5024 8.79841 13.5031 9.79659 12.2711 9.79659Z'
                  fill='white'
                />
                <path
                  d='M8.87283 16.2734H23.2725V17.6716H8.87283V16.2734Z'
                  fill='white'
                />
                <path
                  d='M8.80008 20.4688H23.1997V21.8675H8.80008V20.4688Z'
                  fill='white'
                />
                <path
                  d='M8.85304 24.6641H18.9331V26.0618H8.85304V24.6641Z'
                  fill='white'
                />
              </svg>
            </div>
            <h1 className='text-white text-[20px] lg:text-[24px] font-bold tracking-[2px] lg:tracking-[2.4px]'>
              職務要約編集
            </h1>
          </div>
        </div>

        {/* フォーム部分 */}
        <div className='bg-[#f9f9f9] px-4 lg:px-20 py-6 lg:py-10 min-h-[730px]'>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col items-center gap-6 lg:gap-10'
          >
            <div className='bg-white rounded-3xl lg:rounded-[40px] shadow-[0px_0px_20px_0px_rgba(0,0,0,0.05)] p-6 pb-6 pt-10 lg:p-10 w-full max-w-[728px]'>
              {/* 説明文セクション */}
              <div className='mb-6'>
                <p className='text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-8'>
                  職務内容や自己PRを編集できます。
                  <br />
                  変更した内容は職務経歴書にも反映されます。
                </p>
              </div>

              {/* 職務要約入力セクション */}
              <div className='space-y-6 lg:space-y-2'>
                {/* 職務要約 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0'>
                      職務要約
                    </div>
                  </div>
                  {/* 職務要約フィールド */}
                  <div className='flex-1 lg:py-6'>
                    <FormField
                      label='職務要約'
                      htmlFor='jobSummary'
                      error={errors.jobSummary?.message ?? null}
                      hideLabel={true}
                    >
                      <div className='border border-[#999999] rounded-[5px] p-1'>
                        <textarea
                          id='jobSummary'
                          {...register('jobSummary')}
                          placeholder={
                            isDesktop
                              ? '例）大手メーカーにて事業企画を担当。国内外の市場調査や新規事業の事業性評価、既存事業のKPI分析・改善提案などを行ってきました。その後、経営企画部門に異動し、中期経営計画の策定や全社横断の施策推進にも携わっています。'
                              : '例）大手メーカーにて事業企画を担当。国内外の市場調査や新規事業の事業性評価、既存事業のKPI分析・改善提案などを行ってきました。その後、経営企画部門に異動し、中期経営計画の策定や全社横断の施策推進にも携わっています。'
                          }
                          className='w-full bg-white border-0 rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] focus:outline-none resize-none min-h-[147px] leading-8'
                        />
                      </div>
                    </FormField>
                  </div>
                </div>

                {/* 自己PR・その他 */}
                <div className='flex flex-col lg:flex-row lg:gap-6'>
                  <div className='bg-[#f9f9f9] rounded-[5px] px-4 lg:px-6 py-2 lg:py-0 lg:min-h-[50px] lg:w-[200px] flex items-start lg:items-center mb-2 lg:mb-0'>
                    <div className='font-bold text-[16px] text-[#323232] tracking-[1.6px] py-2 lg:py-0 whitespace-nowrap'>
                      自己PR・その他
                    </div>
                  </div>
                  {/* 自己PRフィールド */}
                  <div className='flex-1 lg:py-6'>
                    <FormField
                      label='自己PR・その他'
                      htmlFor='selfPr'
                      error={errors.selfPr?.message ?? null}
                      hideLabel={true}
                    >
                      <div className='border border-[#999999] rounded-[5px] p-1'>
                        <textarea
                          id='selfPr'
                          {...register('selfPr')}
                          placeholder={
                            isDesktop
                              ? '例）目標に向けて周囲を巻き込みながら推進するのが得意です。直近では〇〇プロジェクトで〜を達成しました。'
                              : '例）目標に向けて周囲を巻き込みながら推進するのが得意です。直近では〇〇プロジェクトで〜を達成しました。'
                          }
                          className='w-full bg-white border-0 rounded-[5px] px-4 py-[11px] text-[16px] text-[#323232] font-medium tracking-[1.6px] placeholder:text-[#999999] focus:outline-none resize-none min-h-[147px] leading-8'
                        />
                      </div>
                    </FormField>
                  </div>
                </div>
              </div>
            </div>

            {/* ボタン */}
            <div className='w-full lg:w-auto'>
              <ActionButtons
                isSubmitting={isSubmitting}
                handleCancel={handleCancel}
                isMobile={!isDesktop}
              />
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
