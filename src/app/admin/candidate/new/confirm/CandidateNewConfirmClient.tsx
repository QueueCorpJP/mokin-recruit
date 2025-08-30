'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { createCandidateData } from '../actions';

export default function CandidateNewConfirmClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    const data = searchParams.get('data');
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing form data:', error);
        router.push('/admin/candidate/new');
      }
    } else {
      router.push('/admin/candidate/new');
    }
  }, [searchParams, router]);

  // Calculate age from formData birth_date
  const age = formData?.updateData?.birth_date 
    ? new Date().getFullYear() - new Date(formData.updateData.birth_date).getFullYear()
    : null;

  const handleConfirmSave = async () => {
    if (isSubmitting || !formData) return;
    
    setIsSubmitting(true);
    
    try {
      // Call the create candidate server action
      const result = await createCandidateData(
        formData.updateData,
        formData.education,
        formData.workExperience,
        formData.jobTypeExperience,
        formData.skills,
        formData.expectations || {},
        formData.selectionEntries
      );

      console.log('Create candidate result:', result);
      
      if (result.success) {
        console.log('Setting candidateId:', result.candidateId);
        console.log('Setting showModal to true');
        setCandidateId(result.candidateId);
        setShowModal(true);
      } else {
        console.error('Creation failed:', result.error);
        alert('候補者の作成に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('Error creating candidate:', error);
      alert('候補者の作成に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCandidate = () => {
    setShowModal(false);
    if (candidateId) {
      router.push(`/admin/candidate/${candidateId}`);
    } else {
      router.push('/admin/candidate');
    }
  };

  const handleBackToAdmin = () => {
    setShowModal(false);
    router.push('/admin');
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  console.log('Render - showModal:', showModal, 'candidateId:', candidateId);

  return (
    <>
      <div className="min-h-screen">

        <div className="p-8">
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

          {/* Selection Entries */}
          {formData.selectionEntries && formData.selectionEntries.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300">
                経験企業名
              </h3>
              <div className="px-4 py-4 space-y-4">
                {formData.selectionEntries.map((entry: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-[5px] p-4">
                    <div className="text-gray-700 mb-2">
                      <span className="font-semibold">会社名: </span>
                      {entry.companyName}
                    </div>
                    <div className="text-gray-700 mb-2">
                      <span className="font-semibold">業界: </span>
                      {entry.industries.join(', ') || 'なし'}
                    </div>
                    <div className="text-gray-700">
                      <span className="font-semibold">職種: </span>
                      {entry.jobTypes.join(', ') || 'なし'}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

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
                <span className="font-semibold">業界: </span>
                {formData.updateData?.recent_job_industries?.join(', ') || 'なし'}
              </div>
              <div className="text-gray-700">
                <span className="font-semibold">職種: </span>
                {formData.updateData?.recent_job_types?.join(', ') || 'なし'}
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
                <span className="font-semibold">スキル: </span>
                {formData.skills?.skills_tags?.length > 0 ? 
                  formData.skills.skills_tags.join(', ') : 'なし'}
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

          {/* 保存するボタン */}
          <div className="flex justify-center pt-8">
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
        title="新規候補者の登録完了"
        description="新規候補者の登録が完了しました。"
        confirmText="管理者トップ画面に戻る"
        secondaryText="候補者情報を確認"
        onConfirm={handleBackToAdmin}
        onSecondaryAction={handleViewCandidate}
      />
    </>
  );
}