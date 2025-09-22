'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminNotificationModal } from '@/components/admin/ui/AdminNotificationModal';
import { createCandidateData } from '../actions';

export default function CandidateNewConfirmClient() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [candidateId, setCandidateId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    try {
      const data = sessionStorage.getItem('candidateConfirmData');
      if (data) {
        const parsedData = JSON.parse(data);
        setFormData(parsedData);
      } else {
        router.push('/admin/candidate/new');
      }
    } catch (error) {
      console.error('Error parsing form data:', error);
      router.push('/admin/candidate/new');
    }
  }, [router]);

  // Calculate age from formData birth fields
  const calculateAge = () => {
    if (
      !formData?.updateData?.birthYear ||
      !formData?.updateData?.birthMonth ||
      !formData?.updateData?.birthDay
    ) {
      return null;
    }
    const birthDate = new Date(
      parseInt(formData.updateData.birthYear),
      parseInt(formData.updateData.birthMonth) - 1,
      parseInt(formData.updateData.birthDay)
    );
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const age = calculateAge();

  const handleConfirmSave = async () => {
    if (isSubmitting || !formData) return;

    setIsSubmitting(true);

    try {
      // Call the create candidate server action
      const result = await createCandidateData(
        formData.updateData,
        formData.education,
        [],
        [],
        formData.skills,
        formData.expectations || {},
        formData.selectionEntries,
        formData.memo
      );

      console.log('Create candidate result:', result);

      if (result.success) {
        console.log('Setting candidateId:', result.candidateId);
        console.log('Setting showModal to true');
        // Clear sessionStorage after successful creation
        sessionStorage.removeItem('candidateConfirmData');
        setCandidateId(result.candidateId || '');
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
    sessionStorage.removeItem('candidateConfirmData');
    if (candidateId) {
      router.push(`/admin/candidate/${candidateId}`);
    } else {
      router.push('/admin/candidate');
    }
  };

  const handleBackToAdmin = () => {
    setShowModal(false);
    sessionStorage.removeItem('candidateConfirmData');
    router.push('/admin');
  };

  if (!formData) {
    return <div>Loading...</div>;
  }

  console.log('Render - showModal:', showModal, 'candidateId:', candidateId);

  return (
    <>
      <div className='min-h-screen'>
        <div className='p-8'>
          {/* メールアドレス */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              メールアドレス
            </h3>
            <div className='px-4 py-4 space-y-6'>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  メールアドレス
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.email || 'なし'}
                </span>
              </div>
            </div>
          </section>

          {/* 基本情報 */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              基本情報
            </h3>
            <div className='px-4 py-4 space-y-6'>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  氏名
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.lastName}{' '}
                  {formData.updateData?.firstName}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  フリガナ
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.lastNameKana}{' '}
                  {formData.updateData?.firstNameKana}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  性別
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.gender || '未選択'}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  生年月日
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.birthYear &&
                  formData.updateData?.birthMonth &&
                  formData.updateData?.birthDay
                    ? `${formData.updateData.birthYear}年${formData.updateData.birthMonth}月${formData.updateData.birthDay}日`
                    : 'なし'}{' '}
                  {age && `(${age}歳)`}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  現在の住まい
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.prefecture || 'なし'}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  電話番号
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.phoneNumber || 'なし'}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  現在の年収
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.currentIncome || 'なし'}
                </span>
              </div>
            </div>
          </section>

          {/* 転職活動状況 */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              転職活動状況
            </h3>
            <div className='px-4 py-4 space-y-6'>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  転職経験
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.hasCareerChange || 'なし'}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  転職希望時期
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.jobChangeTiming || '未選択'}
                </span>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  現在の活動状況
                </span>
                <span className='text-gray-900 flex-1'>
                  {formData.updateData?.currentActivityStatus || '未選択'}
                </span>
              </div>
            </div>
          </section>

          {/* Career Status Entries */}
          {formData.selectionEntries &&
            formData.selectionEntries.length > 0 && (
              <section className='mb-8'>
                <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
                  転職活動状況エントリ
                </h3>
                <div className='px-4 py-4 space-y-4'>
                  {formData.selectionEntries.map(
                    (entry: any, index: number) => (
                      <div
                        key={index}
                        className='border border-gray-200 rounded-[5px] p-4 space-y-6'
                      >
                        <div className='flex gap-8'>
                          <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                            会社名
                          </span>
                          <div className='flex-1'>
                            {entry.companyName || 'なし'}
                          </div>
                        </div>
                        <div className='flex gap-8'>
                          <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                            部署
                          </span>
                          <div className='flex-1'>
                            {entry.department || 'なし'}
                          </div>
                        </div>
                        <div className='flex gap-8'>
                          <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                            業界
                          </span>
                          <div className='flex-1'>
                            {entry.industries && entry.industries.length > 0
                              ? entry.industries.join(', ')
                              : 'なし'}
                          </div>
                        </div>
                        <div className='flex gap-8'>
                          <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                            進捗状況
                          </span>
                          <div className='flex-1'>
                            {entry.progressStatus || 'なし'}
                          </div>
                        </div>
                        {entry.progressStatus === '辞退' &&
                          entry.declineReason && (
                            <div className='flex gap-8'>
                              <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                                見送り理由
                              </span>
                              <div className='flex-1'>
                                {entry.declineReason}
                              </div>
                            </div>
                          )}
                        <div className='flex gap-8'>
                          <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                            非公開
                          </span>
                          <div className='flex-1'>
                            {entry.isPrivate ? 'はい' : 'いいえ'}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </section>
            )}

          {/* 職務経歴 */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              職務経歴
            </h3>
            {formData.workHistoryEntries &&
            formData.workHistoryEntries.length > 0 ? (
              <div className='space-y-6'>
                {formData.workHistoryEntries.map((entry, index) => (
                  <div
                    key={entry.id || index}
                    className='border border-gray-200 rounded-lg p-4'
                  >
                    <div className='space-y-4'>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          会社名
                        </span>
                        <div className='flex-1'>
                          {entry.companyName || 'なし'}
                        </div>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          部署・役職
                        </span>
                        <div className='flex-1'>
                          {entry.department || 'なし'}
                        </div>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          在籍期間
                        </span>
                        <div className='flex-1'>
                          {entry.startYear && entry.startMonth
                            ? `${entry.startYear}年${entry.startMonth}月`
                            : ''}
                          {entry.isCurrentlyWorking
                            ? ' 〜 現在'
                            : entry.endYear && entry.endMonth
                              ? ` 〜 ${entry.endYear}年${entry.endMonth}月`
                              : ''}
                        </div>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          業界
                        </span>
                        <div className='flex-1'>
                          {entry.industries && entry.industries.length > 0
                            ? entry.industries.join(', ')
                            : 'なし'}
                        </div>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          職種
                        </span>
                        <div className='flex-1'>
                          {entry.jobTypes && entry.jobTypes.length > 0
                            ? entry.jobTypes.join(', ')
                            : 'なし'}
                        </div>
                      </div>
                      <div className='flex gap-8'>
                        <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                          職務内容
                        </span>
                        <div className='flex-1'>
                          <div className='whitespace-pre-wrap'>
                            {entry.jobDescription || 'なし'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className='px-4 py-4'>
                <span className='text-gray-500'>
                  職務経歴が入力されていません
                </span>
              </div>
            )}
          </section>

          {/* 学歴・経験業種/職種 */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              学歴・経験業種/職種
            </h3>
            <div className='px-4 py-4 space-y-6'>
              {/* 学歴 */}
              <div className='space-y-6'>
                <h4 className='font-semibold text-gray-700'>学歴</h4>
                <div className='pl-4 space-y-6'>
                  <div className='flex gap-8'>
                    <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                      最終学歴
                    </span>
                    <div className='flex-1'>
                      {formData.education?.final_education || 'なし'}
                    </div>
                  </div>
                  <div className='flex gap-8'>
                    <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                      学校名
                    </span>
                    <div className='flex-1'>
                      {formData.education?.school_name || 'なし'}
                    </div>
                  </div>
                  <div className='flex gap-8'>
                    <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                      学部・学科
                    </span>
                    <div className='flex-1'>
                      {formData.education?.department || 'なし'}
                    </div>
                  </div>
                  <div className='flex gap-8'>
                    <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                      卒業年月
                    </span>
                    <div className='flex-1'>
                      {formData.education?.graduation_year &&
                      formData.education?.graduation_month
                        ? `${formData.education.graduation_year}年${formData.education.graduation_month}月`
                        : 'なし'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 最新職歴の業種 */}
              <div className='space-y-6'>
                <h4 className='font-semibold text-gray-700'>業種</h4>
                <div className='pl-4'>
                  <div className='flex gap-8'>
                    <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                      業種
                    </span>
                    <div className='flex-1'>
                      {formData.updateData?.recentJobIndustries &&
                      formData.updateData.recentJobIndustries.length > 0
                        ? formData.updateData.recentJobIndustries.join(', ')
                        : 'なし'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 最新職歴の職種 */}
              <div className='space-y-6'>
                <h4 className='font-semibold text-gray-700'>職種</h4>
                <div className='pl-4'>
                  <div className='flex gap-8'>
                    <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                      職種
                    </span>
                    <div className='flex-1'>
                      {formData.updateData?.recentJobTypes &&
                      formData.updateData.recentJobTypes.length > 0
                        ? formData.updateData.recentJobTypes.join(', ')
                        : 'なし'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 資格・語学・スキル */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              資格・語学・スキル
            </h3>
            <div className='px-4 py-4 space-y-6'>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  英語レベル
                </span>
                <div className='flex-1'>
                  {formData.skills?.english_level === 'native'
                    ? 'ネイティブ'
                    : formData.skills?.english_level === 'business'
                      ? 'ビジネスレベル'
                      : formData.skills?.english_level === 'conversation'
                        ? '日常会話'
                        : formData.skills?.english_level === 'basic'
                          ? '基礎会話'
                          : formData.skills?.english_level === 'none'
                            ? 'なし'
                            : 'レベルを選択'}
                </div>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  スキル
                </span>
                <div className='flex-1'>
                  {formData.skills?.skills_tags?.length > 0
                    ? formData.skills.skills_tags.join(', ')
                    : 'なし'}
                </div>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  保有資格
                </span>
                <div className='flex-1'>
                  <div className='whitespace-pre-wrap'>
                    {formData.skills?.qualifications || 'なし'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 職務要約 */}
          <section className='mb-8'>
            <h3 className='text-xl font-bold text-gray-800 mb-4 pb-2 border-b-2 border-gray-300'>
              職務要約
            </h3>
            <div className='px-4 py-4 space-y-6'>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  職務要約
                </span>
                <div className='flex-1'>
                  <div className='whitespace-pre-wrap'>
                    {formData.updateData?.jobSummary || 'なし'}
                  </div>
                </div>
              </div>
              <div className='flex gap-8'>
                <span className='text-sm font-medium text-gray-700 w-[120px] text-right'>
                  自己PR・その他
                </span>
                <div className='flex-1'>
                  <div className='whitespace-pre-wrap'>
                    {formData.updateData?.selfPr || 'なし'}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 保存するボタン */}
          <div className='flex justify-center pt-8'>
            <AdminButton
              text={isSubmitting ? '保存中...' : '保存する'}
              variant='green-gradient'
              size='figma-default'
              onClick={handleConfirmSave}
              disabled={isSubmitting}
            />
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      <AdminNotificationModal
        isOpen={showModal}
        title='新規候補者の登録完了'
        description='新規候補者の登録が完了しました。'
        confirmText='管理者トップ画面に戻る'
        secondaryText='候補者情報を確認'
        onConfirm={handleBackToAdmin}
        onSecondaryAction={handleViewCandidate}
      />
    </>
  );
}
