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
        formData.skills,
        formData.expectations || {}
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

          {/* パスワード */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              パスワード
            </h3>
            <div className="px-4 py-4">
              <div className="text-gray-700">
                <span className="font-semibold">パスワード: </span>
                {formData.updateData?.password ? '変更あり' : '変更なし'}
              </div>
            </div>
          </section>

          {/* 基本情報 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              基本情報
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      お名前
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.last_name} {formData.updateData?.first_name}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">
                      フリガナ
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.last_name_kana} {formData.updateData?.first_name_kana}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">
                      性別
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.gender === 'male' ? '男性' : 
                       formData.updateData?.gender === 'female' ? '女性' : '回答しない'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">
                      生年月日
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.birth_date || 'なし'} {age && `(${age}歳)`}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">
                      現在の住まい
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.prefecture || 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">
                      連絡先電話番号
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.phone_number || 'なし'}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700">
                      現在の年収
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.current_income || 'なし'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 転職経験 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              転職経験
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      転職経験
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.has_career_change === 'yes' ? 'あり' : 
                       formData.updateData?.has_career_change === 'no' ? 'なし' : 'なし'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 転職活動状況 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              転職活動状況
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      転職希望時期
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.job_change_timing === 'immediately' ? 'すぐにでも' :
                       formData.updateData?.job_change_timing === 'within_3months' ? '3ヶ月以内' :
                       formData.updateData?.job_change_timing === 'within_6months' ? '6ヶ月以内' :
                       formData.updateData?.job_change_timing === 'within_1year' ? '1年以内' :
                       formData.updateData?.job_change_timing === 'undecided' ? '未定' : '未選択'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      現在の活動状況
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.current_activity_status === 'active' ? '積極的に活動中' :
                       formData.updateData?.current_activity_status === 'passive' ? '良い求人があれば' :
                       formData.updateData?.current_activity_status === 'not_active' ? '活動していない' : '未選択'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 職務経歴 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              職務経歴
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      会社名
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.recent_job_company_name || 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      部署・役職
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.recent_job_department_position || 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      業種
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.recent_job_industries?.length > 0 
                        ? formData.updateData.recent_job_industries.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      職種
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.recent_job_types?.length > 0 
                        ? formData.updateData.recent_job_types.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      在籍期間
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.recent_job_start_year && formData.updateData?.recent_job_start_month ? 
                        `${formData.updateData.recent_job_start_year}年${formData.updateData.recent_job_start_month}月` : ''
                      }
                      {!formData.updateData?.recent_job_is_currently_working && 
                       formData.updateData?.recent_job_end_year && formData.updateData?.recent_job_end_month ? 
                        ` 〜 ${formData.updateData.recent_job_end_year}年${formData.updateData.recent_job_end_month}月` : 
                        formData.updateData?.recent_job_is_currently_working ? ' 〜 現在' : ''
                      }
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      業務内容
                    </td>
                    <td className="px-4 py-3">
                      <div className="whitespace-pre-wrap">
                        {formData.updateData?.recent_job_description || 'なし'}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 最終学歴 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              最終学歴
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      最終学歴
                    </td>
                    <td className="px-4 py-3">
                      {formData.education?.final_education === 'high_school' ? '高校卒' :
                       formData.education?.final_education === 'vocational' ? '専門学校卒' :
                       formData.education?.final_education === 'junior_college' ? '短大卒' :
                       formData.education?.final_education === 'university' ? '大学卒' :
                       formData.education?.final_education === 'graduate' ? '大学院卒' : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      学校名
                    </td>
                    <td className="px-4 py-3">
                      {formData.education?.school_name || 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      学部・学科
                    </td>
                    <td className="px-4 py-3">
                      {formData.education?.department || 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      卒業年月
                    </td>
                    <td className="px-4 py-3">
                      {formData.education?.graduation_year && formData.education?.graduation_month ? 
                        `${formData.education.graduation_year}年${formData.education.graduation_month}月` : 'なし'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 今までに経験した業種職種 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              今までに経験した業種職種
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      業種経験
                    </td>
                    <td className="px-4 py-3">
                      {formData.workExperience && formData.workExperience.length > 0 ? (
                        <div className="space-y-1">
                          {formData.workExperience.map((exp: any, index: number) => (
                            <div key={index} className="text-gray-700">
                              {exp.industry_name}: {exp.experience_years}年
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-700">なし</div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      職種経験
                    </td>
                    <td className="px-4 py-3">
                      {formData.jobTypeExperience && formData.jobTypeExperience.length > 0 ? (
                        <div className="space-y-1">
                          {formData.jobTypeExperience.map((exp: any, index: number) => (
                            <div key={index} className="text-gray-700">
                              {exp.job_type_name}: {exp.experience_years}年
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-700">なし</div>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 語学 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              語学
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      英語レベル
                    </td>
                    <td className="px-4 py-3">
                      {formData.skills?.english_level === 'none' ? 'なし' :
                       formData.skills?.english_level === 'basic' ? '日常会話レベル' :
                       formData.skills?.english_level === 'business' ? 'ビジネスレベル' :
                       formData.skills?.english_level === 'native' ? 'ネイティブレベル' : '未設定'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      その他言語
                    </td>
                    <td className="px-4 py-3">
                      {formData.skills?.other_languages || 'なし'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* スキル */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              スキル
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      スキル
                    </td>
                    <td className="px-4 py-3">
                      {formData.skills?.skills_list?.length > 0 
                        ? formData.skills.skills_list.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      保有資格
                    </td>
                    <td className="px-4 py-3">
                      <div className="whitespace-pre-wrap">
                        {formData.skills?.qualifications || 'なし'}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 希望条件 */}
          <section className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
              希望条件
            </h3>
            <div className="bg-white border rounded-lg">
              <table className="w-full">
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48">
                      希望年収
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.desired_salary || 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      希望業種
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.desired_industries?.length > 0 
                        ? formData.updateData.desired_industries.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      希望職種
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.desired_job_types?.length > 0 
                        ? formData.updateData.desired_job_types.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      希望勤務地
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.desired_locations?.length > 0 
                        ? formData.updateData.desired_locations.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 bg-gray-50 font-semibold text-gray-700 w-48 align-top">
                      希望働き方
                    </td>
                    <td className="px-4 py-3">
                      {formData.updateData?.interested_work_styles?.length > 0 
                        ? formData.updateData.interested_work_styles.join(', ')
                        : 'なし'}
                    </td>
                  </tr>
                </tbody>
              </table>
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