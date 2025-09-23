'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { sendScout, type ScoutSendFormData } from '../actions';
import { useScoutSendStore } from '@/stores/scoutSendStore';

interface ScoutConfirmFormProps {
  candidateId: string;
}

// Right Arrow Icon Component
const RightArrowIcon = () => (
  <svg
    width='8'
    height='8'
    viewBox='0 0 8 8'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M6.11804 3.59656C6.34118 3.8197 6.34118 4.18208 6.11804 4.40522L2.69061 7.83264C2.46747 8.05579 2.10509 8.05579 1.88195 7.83264C1.65881 7.60951 1.65881 7.24713 1.88195 7.02399L4.90594 4L1.88374 0.976012C1.6606 0.752873 1.6606 0.390494 1.88374 0.167355C2.10688 -0.0557849 2.46926 -0.0557849 2.6924 0.167355L6.11982 3.59478L6.11804 3.59656Z'
      fill='white'
    />
  </svg>
);

// Mail Icon Component
const MailIcon = () => (
  <svg
    width='32'
    height='32'
    viewBox='0 0 32 32'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      d='M13.4625 6H9H6.7375H6V6.55V9V11.525V17.0875L0.0125 12.6563C0.1125 11.525 0.69375 10.475 1.61875 9.79375L3 8.76875V6C3 4.34375 4.34375 3 6 3H10.7875L13.9063 0.69375C14.5125 0.24375 15.2438 0 16 0C16.7563 0 17.4875 0.24375 18.0938 0.6875L21.2125 3H26C27.6563 3 29 4.34375 29 6V8.76875L30.3813 9.79375C31.3063 10.475 31.8875 11.525 31.9875 12.6563L26 17.0875V11.525V9V6.55V6H25.2625H23H18.5375H13.4563H13.4625ZM0 28V15.1313L13.6 25.2063C14.2938 25.7188 15.1375 26 16 26C16.8625 26 17.7063 25.725 18.4 25.2063L32 15.1313V28C32 30.2063 30.2063 32 28 32H4C1.79375 32 0 30.2063 0 28ZM11 10H21C21.55 10 22 10.45 22 11C22 11.55 21.55 12 21 12H11C10.45 12 10 11.55 10 11C10 10.45 10.45 10 11 10ZM11 14H21C21.55 14 22 14.45 22 15C22 15.55 21.55 16 21 16H11C10.45 16 10 15.55 10 15C10 14.45 10.45 14 11 14Z'
      fill='white'
    />
  </svg>
);

export function ScoutConfirmForm({ candidateId }: ScoutConfirmFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setDraft = useScoutSendStore(s => s.setDraft);
  const resetDraft = useScoutSendStore(s => s.resetDraft);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ScoutSendFormData | null>(null);
  const [groupLabel, setGroupLabel] = useState<string>('');
  const [recruitmentTargetLabel, setRecruitmentTargetLabel] =
    useState<string>('');
  const [scoutTemplateLabel, setScoutTemplateLabel] = useState<string>('');
  const [candidateName, setCandidateName] = useState<string>('');

  // URLSearchParamsからフォームデータを復元
  useEffect(() => {
    const group = searchParams.get('group') || '';
    const groupLabelParam = searchParams.get('groupLabel') || '';
    const recruitmentTarget = searchParams.get('recruitmentTarget') || '';
    const recruitmentTargetLabelParam =
      searchParams.get('recruitmentTargetLabel') || '';
    const scoutSenderName = searchParams.get('scoutSenderName') || '';
    const scoutTemplate = searchParams.get('scoutTemplate') || '';
    const scoutTemplateLabelParam =
      searchParams.get('scoutTemplateLabel') || '';
    const title = searchParams.get('title') || '';
    const message = searchParams.get('message') || '';
    const searchQuery = searchParams.get('searchQuery') || '';
    const candidateNameParam = searchParams.get('candidateName') || '';

    setGroupLabel(groupLabelParam);
    setRecruitmentTargetLabel(recruitmentTargetLabelParam);
    setScoutTemplateLabel(scoutTemplateLabelParam);
    setCandidateName(candidateNameParam);

    const restored = {
      group,
      recruitmentTarget,
      scoutSenderName,
      candidateId: candidateId,
      scoutTemplate,
      title,
      message,
      searchQuery,
    } as ScoutSendFormData;
    setFormData(restored);
    // 確認画面に直接アクセスした場合でもドラフトへ反映
    setDraft(candidateId, restored);
  }, [candidateId, searchParams, setDraft]);

  const handleSend = async () => {
    if (!formData) return;

    try {
      setIsLoading(true);

      const result = await sendScout(formData);

      if (result.success) {
        // 送信完了時はドラフトを破棄
        resetDraft(candidateId);
        // メッセージルームに直接遷移
        if (result.roomId) {
          router.push(`/company/message?room=${result.roomId}`);
        } else {
          // roomIdが取得できない場合はメッセージ一覧へ
          router.push('/company/message');
        }
      } else {
        alert((result as any).error || 'スカウト送信に失敗しました');
      }
    } catch (error) {
      console.error('スカウト送信エラー:', error);
      alert('スカウト送信中にエラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div
        className='bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10'
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className='w-full max-w-[1200px] mx-auto'>
          {/* Breadcrumb */}
          <div className='flex items-center gap-2 mb-4'>
            <Link
              href='/company/search'
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              候補者検索
            </Link>
            <RightArrowIcon />
            <Link
              href='/company/search/result'
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              検索結果
            </Link>
            <RightArrowIcon />
            <Link
              href={`/company/search/${candidateId}/scout`}
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウト送信
            </Link>
            <RightArrowIcon />
            <span
              className='text-white text-[14px] font-bold tracking-[1.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              送信内容の確認
            </span>
          </div>

          {/* Page Title */}
          <div className='flex items-center gap-4'>
            <MailIcon />
            <h1
              className='text-white text-[24px] font-bold tracking-[2.4px]'
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウト送信
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className='bg-[#f9f9f9] flex-1 px-20 pt-10 pb-20'>
        <div className='w-full max-w-[1200px] mx-auto'>
          {/* Confirmation Card */}
          <div className='bg-white rounded-[10px] p-10'>
            <div className='flex flex-col gap-2'>
              {/* グループ */}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
                  <span
                    className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    グループ
                  </span>
                </div>
                <div className='flex-1 flex items-center'>
                  <span
                    className='text-[#323232] text-[16px] tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {groupLabel || formData.group}
                  </span>
                </div>
              </div>

              {/* 添付する求人 */}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
                  <span
                    className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    添付する求人
                  </span>
                </div>
                <div className='flex-1 flex items-center'>
                  <span
                    className='text-[#323232] text-[16px] tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {recruitmentTargetLabel || formData.recruitmentTarget}
                  </span>
                </div>
              </div>

              {/* スカウト送信者名 */}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
                  <span
                    className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    スカウト送信者名
                  </span>
                </div>
                <div className='flex-1 flex items-center'>
                  <span
                    className='text-[#323232] text-[16px] tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {formData.scoutSenderName}
                  </span>
                </div>
              </div>

              {/* 送信先候補者ID */}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
                  <span
                    className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    送信先候補者
                  </span>
                </div>
                <div className='flex-1 flex items-center'>
                  <span
                    className='text-[#323232] text-[16px] tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {candidateName ||
                      formData.searchQuery ||
                      formData.candidateId}
                  </span>
                </div>
              </div>

              {/* スカウトテンプレート */}
              {(scoutTemplateLabel || formData.scoutTemplate) && (
                <div className='flex gap-6'>
                  <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
                    <span
                      className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      スカウトテンプレート
                    </span>
                  </div>
                  <div className='flex-1 flex items-center'>
                    <span
                      className='text-[#323232] text-[16px] tracking-[1.6px]'
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      {scoutTemplateLabel || formData.scoutTemplate}
                    </span>
                  </div>
                </div>
              )}

              {/* 件名 */}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]'>
                  <span
                    className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    件名
                  </span>
                </div>
                <div className='flex-1 flex items-center'>
                  <span
                    className='text-[#323232] text-[16px] tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {formData.title}
                  </span>
                </div>
              </div>

              {/* 本文 */}
              <div className='flex gap-6'>
                <div className='w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start self-stretch'>
                  <span
                    className='text-[#323232] text-[16px] font-bold tracking-[1.6px]'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    本文
                  </span>
                </div>
                <div className='flex-1'>
                  {/* <div className="p-4 min-h-[200px]"> */}
                  <pre
                    className='text-[#323232] text-[16px] tracking-[1.6px] whitespace-pre-wrap'
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {formData.message}
                  </pre>
                  {/* </div> */}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex justify-center gap-6 mt-10'>
            <Button
              onClick={handleBack}
              variant='green-outline'
              size='figma-default'
              className='min-w-[160px]'
              disabled={isLoading}
            >
              編集画面に戻る
            </Button>
            <Button
              onClick={handleSend}
              variant='green-gradient'
              size='figma-default'
              className='min-w-[160px]'
              disabled={isLoading}
            >
              {isLoading ? '送信中...' : 'この内容で送信'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
