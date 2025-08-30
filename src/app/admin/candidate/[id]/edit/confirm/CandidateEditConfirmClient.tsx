'use client';

import React, { useState } from 'react';
import { CandidateDetailData } from '../../page';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { updateCandidateData } from '../actions';

interface Props {
  candidate: CandidateDetailData;
  formData: any;
}

export default function CandidateEditConfirmClient({ candidate, formData }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Safe fallback for scout_stats if undefined
  const scoutStats = candidate.scout_stats || {
    scout_received_7days: 0,
    scout_opened_7days: 0,
    scout_replied_7days: 0,
    applications_7days: 0,
    scout_received_30days: 0,
    scout_opened_30days: 0,
    scout_replied_30days: 0,
    applications_30days: 0,
    scout_received_total: 0,
    scout_opened_total: 0,
    scout_replied_total: 0,
    applications_total: 0,
  };

  // Calculate age from formData birth_date
  const age = formData.birth_date 
    ? new Date().getFullYear() - new Date(formData.birth_date).getFullYear()
    : null;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const handleConfirmSave = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const result = await updateCandidateData(
        candidate.id,
        formData.updateData,
        formData.education,
        formData.workExperience,
        formData.jobTypeExperience,
        formData.skills
      );

      if (result.success) {
        setShowModal(true);
      } else {
        alert('更新に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('Error updating candidate:', error);
      alert('更新に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    router.push(`/admin/candidate/${candidate.id}`);
  };

  return (
    <>
      <div className="min-h-screen">
        <div className="p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            候補者情報編集確認
          </h1>
          <p className="text-gray-600">
            ユーザーID: {candidate.id}
          </p>
        </div>

        <div className="p-8">
          {/* 候補者分析 */}
          <section className="mb-12">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              候補者分析
            </h2>
            <div className="bg-white relative rounded-[4px] w-full">
              <div className="content-stretch flex flex-col items-start justify-start overflow-clip relative w-full">
                {/* ヘッダー行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">&nbsp;</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">スカウト受信数</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">開封数（開封率）</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">返信数（返信率）</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(0,0,0,0.06)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-semibold grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">応募数（応募率）</p>
                      </div>
                    </div>
                  </div>
                </div>
                {/* 過去7日合計行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">過去7日合計</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">{scoutStats.scout_received_7days}</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_opened_7days}
                          {scoutStats.scout_received_7days > 0 ? ` (${Math.round(scoutStats.scout_opened_7days / scoutStats.scout_received_7days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_replied_7days}
                          {scoutStats.scout_received_7days > 0 ? ` (${Math.round(scoutStats.scout_replied_7days / scoutStats.scout_received_7days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                        <p className="leading-[1.3] whitespace-pre">
                          {scoutStats.applications_7days}
                          {scoutStats.scout_received_7days > 0 ? ` (${Math.round(scoutStats.applications_7days / scoutStats.scout_received_7days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 過去30日間合計行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">過去30日間合計</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">{scoutStats.scout_received_30days}</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_opened_30days}
                          {scoutStats.scout_received_30days > 0 ? ` (${Math.round(scoutStats.scout_opened_30days / scoutStats.scout_received_30days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_replied_30days}
                          {scoutStats.scout_received_30days > 0 ? ` (${Math.round(scoutStats.scout_replied_30days / scoutStats.scout_received_30days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                        <p className="leading-[1.3] whitespace-pre">
                          {scoutStats.applications_30days}
                          {scoutStats.scout_received_30days > 0 ? ` (${Math.round(scoutStats.applications_30days / scoutStats.scout_received_30days * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 累計行 */}
                <div className="bg-[rgba(255,255,255,0)] content-stretch flex items-start justify-start overflow-clip relative shrink-0 w-full">
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">累計</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">{scoutStats.scout_received_total}</p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_opened_total}
                          {scoutStats.scout_received_total > 0 ? ` (${Math.round(scoutStats.scout_opened_total / scoutStats.scout_received_total * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="basis-0 font-normal grow leading-[0] min-h-px min-w-px not-italic relative shrink-0 text-[12px] text-black">
                        <p className="leading-[1.3]">
                          {scoutStats.scout_replied_total}
                          {scoutStats.scout_received_total > 0 ? ` (${Math.round(scoutStats.scout_replied_total / scoutStats.scout_received_total * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="basis-0 bg-[rgba(255,255,255,0)] content-stretch flex flex-col grow items-start justify-start min-h-px min-w-px relative self-stretch shrink-0">
                    <div aria-hidden="true" className="absolute border-[#b9b9b9] border-[1px_0px_0px_1px] border-solid inset-0 pointer-events-none" />
                    <div className="box-border content-stretch flex items-start justify-start overflow-clip px-3 py-2.5 relative shrink-0 w-full">
                      <div className="font-normal leading-[0] not-italic relative shrink-0 text-[12px] text-black text-nowrap">
                        <p className="leading-[1.3] whitespace-pre">
                          {scoutStats.applications_total}
                          {scoutStats.scout_received_total > 0 ? ` (${Math.round(scoutStats.applications_total / scoutStats.scout_received_total * 100)}%)` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* メールアドレス */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              メールアドレス
            </h3>
            <div className="px-4 py-4">
              <div className="text-gray-700">
                <span className="font-semibold">メールアドレス: </span>
                {formData.updateData?.email || 'なし'}
              </div>
            </div>
          </section>

          {/* 基本情報 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              基本情報
            </h3>
            <div className="px-4 py-4 space-y-4">
              <div className="text-gray-700">
                <span className="font-semibold">氏名: </span>
                {formData.updateData?.last_name} {formData.updateData?.first_name}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">フリガナ: </span>
                {formData.updateData?.last_name_kana} {formData.updateData?.first_name_kana}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">性別: </span>
                {formData.updateData?.gender === 'male' ? '男性' : 
                 formData.updateData?.gender === 'female' ? '女性' : '回答しない'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">生年月日: </span>
                {formData.updateData?.birth_date || 'なし'} {age && `(${age}歳)`}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">現在の住まい: </span>
                {formData.updateData?.prefecture || 'なし'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">電話番号: </span>
                {formData.updateData?.phone_number || 'なし'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">現在の年収: </span>
                {formData.updateData?.current_income || 'なし'}
              </div>
            </div>
          </section>

          {/* 転職活動状況 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              転職活動状況
            </h3>
            <div className="px-4 py-4 space-y-4">
              <div className="text-gray-700">
                <span className="font-semibold">転職経験: </span>
                {formData.updateData?.has_career_change === 'yes' ? 'あり' : 
                 formData.updateData?.has_career_change === 'no' ? 'なし' : 'なし'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">転職希望時期: </span>
                {formData.updateData?.job_change_timing === 'immediately' ? 'すぐにでも' :
                 formData.updateData?.job_change_timing === 'within_3months' ? '3ヶ月以内' :
                 formData.updateData?.job_change_timing === 'within_6months' ? '6ヶ月以内' :
                 formData.updateData?.job_change_timing === 'within_1year' ? '1年以内' :
                 formData.updateData?.job_change_timing === 'undecided' ? '未定' : '未選択'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">現在の活動状況: </span>
                {formData.updateData?.current_activity_status === 'active' ? '積極的に活動中' :
                 formData.updateData?.current_activity_status === 'passive' ? '良い求人があれば' :
                 formData.updateData?.current_activity_status === 'not_active' ? '活動していない' : '未選択'}
              </div>
            </div>
          </section>

          {/* 職務経歴 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務経歴
            </h3>
            <div className="px-4 py-4 space-y-4">
              <div className="text-gray-700">
                <span className="font-semibold">会社名: </span>
                {formData.updateData?.recent_job_company_name || 'なし'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">部署・役職: </span>
                {formData.updateData?.recent_job_department_position || 'なし'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">在籍期間: </span>
                {formData.updateData?.recent_job_start_year && formData.updateData?.recent_job_start_month ? 
                  `${formData.updateData.recent_job_start_year}年${formData.updateData.recent_job_start_month}月` : ''
                }
                {!formData.updateData?.recent_job_is_currently_working && 
                 formData.updateData?.recent_job_end_year && formData.updateData?.recent_job_end_month ? 
                  ` 〜 ${formData.updateData.recent_job_end_year}年${formData.updateData.recent_job_end_month}月` : 
                  formData.updateData?.recent_job_is_currently_working ? ' 〜 現在' : ''
                }
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">職務内容: </span>
                <div className="mt-2 whitespace-pre-wrap">
                  {formData.updateData?.recent_job_description || 'なし'}
                </div>
              </div>
            </div>
          </section>

          {/* 学歴・経験業種/職種 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              学歴・経験業種/職種
            </h3>
            <div className="px-4 py-4 space-y-6">
              {/* 学歴 */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">学歴</h4>
                <div className="pl-4 space-y-2">
                  <div className="text-gray-700">
                    <span className="font-semibold">最終学歴: </span>
                    {formData.education?.final_education === 'high_school' ? '高校卒' :
                     formData.education?.final_education === 'vocational' ? '専門学校卒' :
                     formData.education?.final_education === 'junior_college' ? '短大卒' :
                     formData.education?.final_education === 'university' ? '大学卒' :
                     formData.education?.final_education === 'graduate' ? '大学院卒' : 'なし'}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">学校名: </span>
                    {formData.education?.school_name || 'なし'}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">学部・学科: </span>
                    {formData.education?.department || 'なし'}
                  </div>
                  <div className="text-gray-700">
                    <span className="font-semibold">卒業年月: </span>
                    {formData.education?.graduation_year && formData.education?.graduation_month ? 
                      `${formData.education.graduation_year}年${formData.education.graduation_month}月` : 'なし'}
                  </div>
                </div>
              </div>

              {/* 業種経験 */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">業種経験</h4>
                <div className="pl-4">
                  {formData.workExperience && formData.workExperience.length > 0 ? (
                    formData.workExperience.map((exp: any, index: number) => (
                      <div key={index} className="text-gray-700 mb-2">
                        {exp.industry_name}: {exp.experience_years}年
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-700">なし</div>
                  )}
                </div>
              </div>

              {/* 職種経験 */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">職種経験</h4>
                <div className="pl-4">
                  {formData.jobTypeExperience && formData.jobTypeExperience.length > 0 ? (
                    formData.jobTypeExperience.map((exp: any, index: number) => (
                      <div key={index} className="text-gray-700 mb-2">
                        {exp.job_type_name}: {exp.experience_years}年
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-700">なし</div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* 資格・語学・スキル */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              資格・語学・スキル
            </h3>
            <div className="px-4 py-4 space-y-4">
              <div className="text-gray-700">
                <span className="font-semibold">英語レベル: </span>
                {formData.skills?.english_level === 'none' ? 'なし' :
                 formData.skills?.english_level === 'basic' ? '日常会話レベル' :
                 formData.skills?.english_level === 'business' ? 'ビジネスレベル' :
                 formData.skills?.english_level === 'native' ? 'ネイティブレベル' : '未設定'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">保有資格: </span>
                <div className="mt-2 whitespace-pre-wrap">
                  {formData.skills?.qualifications || 'なし'}
                </div>
              </div>
            </div>
          </section>

          {/* 職務要約 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務要約
            </h3>
            <div className="px-4 py-4 space-y-4">
              <div className="text-gray-700">
                <span className="font-semibold">職務要約: </span>
                <div className="mt-2 whitespace-pre-wrap">
                  {formData.updateData?.job_summary || 'なし'}
                </div>
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">自己PR・その他: </span>
                <div className="mt-2 whitespace-pre-wrap">
                  {formData.updateData?.self_pr || 'なし'}
                </div>
              </div>
            </div>
          </section>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-8">
           
            <AdminButton 
              text={isSubmitting ? "保存中..." : "保存する"} 
              variant="green-gradient" 
              size="figma-default"
              onClick={handleConfirmSave}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AdminNotificationModal
        isOpen={showModal}
        title="候補者情報の変更完了"
        description="候補者情報の変更が完了しました。"
        confirmText="候補者情報に戻る"
        onConfirm={handleModalClose}
      />
    </>
  );
}