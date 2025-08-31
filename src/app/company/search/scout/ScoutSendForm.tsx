'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import Link from 'next/link';

// Mail Icon Component
const MailIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.4625 6H9H6.7375H6V6.55V9V11.525V17.0875L0.0125 12.6563C0.1125 11.525 0.69375 10.475 1.61875 9.79375L3 8.76875V6C3 4.34375 4.34375 3 6 3H10.7875L13.9063 0.69375C14.5125 0.24375 15.2438 0 16 0C16.7563 0 17.4875 0.24375 18.0938 0.6875L21.2125 3H26C27.6563 3 29 4.34375 29 6V8.76875L30.3813 9.79375C31.3063 10.475 31.8875 11.525 31.9875 12.6563L26 17.0875V11.525V9V6.55V6H25.2625H23H18.5375H13.4563H13.4625ZM0 28V15.1313L13.6 25.2063C14.2938 25.7188 15.1375 26 16 26C16.8625 26 17.7063 25.725 18.4 25.2063L32 15.1313V28C32 30.2063 30.2063 32 28 32H4C1.79375 32 0 30.2063 0 28ZM11 10H21C21.55 10 22 10.45 22 11C22 11.55 21.55 12 21 12H11C10.45 12 10 11.55 10 11C10 10.45 10.45 10 11 10ZM11 14H21C21.55 14 22 14.45 22 15C22 15.55 21.55 16 21 16H11C10.45 16 10 15.55 10 15C10 14.45 10.45 14 11 14Z"
      fill="white"
    />
  </svg>
);

// Right Arrow Icon Component
const RightArrowIcon = () => (
  <svg
    width="8"
    height="8"
    viewBox="0 0 8 8"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6.11804 3.59656C6.34118 3.8197 6.34118 4.18208 6.11804 4.40522L2.69061 7.83264C2.46747 8.05579 2.10509 8.05579 1.88195 7.83264C1.65881 7.60951 1.65881 7.24713 1.88195 7.02399L4.90594 4L1.88374 0.976012C1.6606 0.752873 1.6606 0.390494 1.88374 0.167355C2.10688 -0.0557849 2.46926 -0.0557849 2.6924 0.167355L6.11982 3.59478L6.11804 3.59656Z"
      fill="white"
    />
  </svg>
);

export function ScoutSendForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    group: '',
    recruitmentTarget: '',
    scoutSenderName: '',
    candidateId: 'CND-2024-00123', // 候補者詳細画面から遷移した場合に自動設定される想定
    scoutTemplate: '',
    title: '',
    message: '',
  });

  // バリデーションエラー管理
  const [errors, setErrors] = useState({
    group: '',
    recruitmentTarget: '',
    scoutSenderName: '',
    title: '',
    message: '',
  });

  // タッチされたフィールドの管理
  const [touched, setTouched] = useState({
    group: false,
    recruitmentTarget: false,
    scoutSenderName: false,
    title: false,
    message: false,
  });

  // 現在のユーザー情報（実際はContextやAPIから取得）
  const currentUserName = '山田 太郎'; // デフォルトのユーザー名

  // サンプルのセレクト選択肢（実際はAPIから取得）
  const groupOptions = [
    { value: '', label: '未選択' },
    { value: 'group1', label: '新卒採用グループ' },
    { value: 'group2', label: '中途採用グループ' },
    { value: 'group3', label: 'エンジニア採用グループ' },
  ];

  // グループに応じた求人（実際はAPIから動的に取得）
  const getRecruitmentTargetOptions = (groupId: string) => {
    if (!groupId) return [{ value: '', label: '未選択' }];

    // グループごとの求人マッピング（実際のAPIレスポンスを想定）
    const recruitmentByGroup: Record<
      string,
      Array<{ value: string; label: string }>
    > = {
      group1: [
        { value: '', label: '未選択' },
        { value: 'job1', label: 'フロントエンドエンジニア（新卒）' },
        { value: 'job2', label: 'バックエンドエンジニア（新卒）' },
      ],
      group2: [
        { value: '', label: '未選択' },
        { value: 'job3', label: 'シニアエンジニア' },
        { value: 'job4', label: 'プロダクトマネージャー' },
      ],
      group3: [
        { value: '', label: '未選択' },
        { value: 'job5', label: 'テックリード' },
        { value: 'job6', label: 'SRE' },
      ],
    };

    return recruitmentByGroup[groupId] || [{ value: '', label: '未選択' }];
  };

  // グループに応じたユーザー（実際はAPIから動的に取得）
  const getScoutSenderOptions = (groupId: string) => {
    if (!groupId) return [{ value: currentUserName, label: currentUserName }];

    // グループごとのユーザーマッピング（実際のAPIレスポンスを想定）
    const usersByGroup: Record<
      string,
      Array<{ value: string; label: string }>
    > = {
      group1: [
        { value: currentUserName, label: currentUserName },
        { value: 'user1', label: '佐藤 花子' },
        { value: 'user2', label: '鈴木 一郎' },
      ],
      group2: [
        { value: currentUserName, label: currentUserName },
        { value: 'user3', label: '田中 美咲' },
        { value: 'user4', label: '高橋 健太' },
      ],
      group3: [
        { value: currentUserName, label: currentUserName },
        { value: 'user5', label: '伊藤 翔' },
        { value: 'user6', label: '渡辺 真理' },
      ],
    };

    return (
      usersByGroup[groupId] || [
        { value: currentUserName, label: currentUserName },
      ]
    );
  };

  // グループとユーザーに応じたテンプレート（実際はAPIから動的に取得）
  const getScoutTemplateOptions = (groupId: string, senderName: string) => {
    if (!groupId || !senderName) return [{ value: '', label: '未選択' }];

    // テンプレートのサンプルデータ
    return [
      { value: '', label: '未選択' },
      { value: 'template1', label: 'エンジニア向けカジュアル面談' },
      { value: 'template2', label: 'エンジニア向け本選考' },
      { value: 'template3', label: 'デザイナー向けテンプレート' },
    ];
  };

  // フィールド変更時の処理
  const handleSelectChange = (field: string) => (value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // グループ変更時は依存フィールドをリセット
      if (field === 'group') {
        newData.recruitmentTarget = '';
        newData.scoutSenderName = value ? currentUserName : '';
        newData.scoutTemplate = '';
      }

      // 送信者名変更時はテンプレートをリセット
      if (field === 'scoutSenderName') {
        newData.scoutTemplate = '';
      }

      return newData;
    });

    // バリデーションをクリア
    setErrors((prev) => ({ ...prev, [field]: '' }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleInputChange =
    (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: '' }));
      setTouched((prev) => ({ ...prev, [field]: true }));
    };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, message: e.target.value }));
    setErrors((prev) => ({ ...prev, message: '' }));
    setTouched((prev) => ({ ...prev, message: true }));
  };

  // バリデーション
  const validateForm = () => {
    const newErrors = {
      group: formData.group === '' ? 'グループを選択してください。' : '',
      recruitmentTarget:
        formData.recruitmentTarget === ''
          ? '添付する求人を選択してください。'
          : '',
      scoutSenderName:
        formData.scoutSenderName === ''
          ? 'スカウト送信者名を選択してください。'
          : '',
      title: formData.title === '' ? '件名を入力してください。' : '',
      message: formData.message === '' ? '本文を入力してください。' : '',
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  // フォーカスアウト時のバリデーション (入力フィールド用)
  const handleBlur = (field: string) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // タッチ済みで空の値の場合のみエラーを表示
    if (field === 'title' && formData.title === '') {
      setErrors((prev) => ({ ...prev, title: '件名を入力してください。' }));
    } else if (field === 'message' && formData.message === '') {
      setErrors((prev) => ({ ...prev, message: '本文を入力してください。' }));
    }
  };

  const handleSubmit = () => {
    // 全フィールドをタッチ済みにする
    setTouched({
      group: true,
      recruitmentTarget: true,
      scoutSenderName: true,
      title: true,
      message: true,
    });

    if (validateForm()) {
      // 確認画面へ遷移
      router.push('/company/search/scout/complete');
    }
  };

  // テンプレート選択時の処理
  useEffect(() => {
    if (formData.scoutTemplate) {
      // テンプレートが選択されたら、件名と本文を設定（実際はAPIから取得）
      const templates: Record<string, { title: string; message: string }> = {
        template1: {
          title: '【CuePoint】カジュアル面談のお誘い',
          message: `はじめまして。株式会社CuePointの採用担当です。
あなたのプロフィールを拝見させていただき、ぜひ当社についてお話しさせていただきたくご連絡いたしました。

まずはカジュアルにお話しできればと思います。
ご興味をお持ちいただけましたら、メッセージにてご返信ください。`,
        },
        template2: {
          title: '【CuePoint】エンジニア採用のご案内',
          message: `はじめまして。株式会社CuePointの採用担当です。
あなたのプロフィールを拝見させていただき、ぜひ当社のエンジニアポジションについてお話しさせていただきたくご連絡いたしました。

当社では、最新のWeb技術を活用した開発を行っており、あなたのスキルと経験が活かせる環境があります。
ぜひ一度、お話しできればと思います。`,
        },
        template3: {
          title: '【CuePoint】デザイナー募集のご案内',
          message: `はじめまして。株式会社CuePointの採用担当です。
あなたのポートフォリオを拝見させていただき、ぜひ当社のデザイナーポジションについてお話しさせていただきたくご連絡いたしました。

私たちのプロダクトチームで、あなたの創造性を発揮していただければと考えています。
ご興味をお持ちいただけましたら、ぜひご連絡ください。`,
        },
      };

      const template = templates[formData.scoutTemplate];
      if (template) {
        setFormData((prev) => ({
          ...prev,
          title: template.title,
          message: template.message,
        }));
        // テンプレート適用時はエラーをクリア
        setErrors((prev) => ({
          ...prev,
          title: '',
          message: '',
        }));
      }
    }
  }, [formData.scoutTemplate]);

  // グループ選択時に送信者名をデフォルト設定
  useEffect(() => {
    if (formData.group && !formData.scoutSenderName) {
      setFormData((prev) => ({
        ...prev,
        scoutSenderName: currentUserName,
      }));
    }
  }, [formData.group, formData.scoutSenderName, currentUserName]);

  // 送信ボタンの有効/無効判定
  const isSubmitDisabled =
    formData.group === '' ||
    formData.recruitmentTarget === '' ||
    formData.scoutSenderName === '' ||
    formData.title === '' ||
    formData.message === '';

  return (
    <>
      {/* Hero Section with Gradient Background */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/company/search"
              className="text-white text-[14px] font-bold tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              候補者検索
            </Link>
            <RightArrowIcon />
            <Link
              href="/company/search/result"
              className="text-white text-[14px] font-bold tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              検索結果
            </Link>
            <RightArrowIcon />
            <span
              className="text-white text-[14px] font-bold tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウト送信
            </span>
          </div>

          {/* Page Title */}
          <div className="flex items-center gap-4">
            <MailIcon />
            <h1
              className="text-white text-[24px] font-bold tracking-[2.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              スカウト送信
            </h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#f9f9f9] flex-1 px-20 pt-10 pb-20">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* Form Card */}
          <div className="bg-white rounded-[10px] p-10">
            <div className="flex flex-col gap-2">
              {/* グループ */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    グループ
                  </span>
                </div>
                <div className="flex-1">
                  <SelectInput
                    options={groupOptions}
                    value={formData.group}
                    placeholder="未選択"
                    onChange={handleSelectChange('group')}
                    className="max-w-[400px]"
                  />
                  {touched.group && errors.group && (
                    <p className="mt-2 text-red-500 text-sm">{errors.group}</p>
                  )}
                </div>
              </div>

              {/* 添付する求人 */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    添付する求人
                  </span>
                </div>
                <div className="flex-1">
                  <SelectInput
                    options={getRecruitmentTargetOptions(formData.group)}
                    value={formData.recruitmentTarget}
                    placeholder="未選択"
                    onChange={handleSelectChange('recruitmentTarget')}
                    onBlur={handleBlur('recruitmentTarget')}
                    disabled={!formData.group}
                    className="max-w-[400px]"
                  />
                  {touched.recruitmentTarget && errors.recruitmentTarget && (
                    <p className="mt-2 text-red-500 text-sm">
                      {errors.recruitmentTarget}
                    </p>
                  )}
                </div>
              </div>

              {/* スカウト送信者名 */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    スカウト送信者名
                  </span>
                </div>
                <div className="flex-1">
                  <SelectInput
                    options={getScoutSenderOptions(formData.group)}
                    value={formData.scoutSenderName}
                    placeholder="未選択"
                    onChange={handleSelectChange('scoutSenderName')}
                    onBlur={handleBlur('scoutSenderName')}
                    disabled={!formData.group}
                    className="max-w-[400px]"
                  />
                  {touched.scoutSenderName && errors.scoutSenderName && (
                    <p className="mt-2 text-red-500 text-sm">
                      {errors.scoutSenderName}
                    </p>
                  )}
                </div>
              </div>

              {/* 送信先候補者ID */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    送信先候補者ID
                  </span>
                </div>
                <div className="flex-1">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    {formData.candidateId}
                  </span>
                </div>
              </div>

              {/* スカウトテンプレート */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    スカウトテンプレート
                  </span>
                </div>
                <div className="flex-1">
                  <SelectInput
                    options={getScoutTemplateOptions(
                      formData.group,
                      formData.scoutSenderName,
                    )}
                    value={formData.scoutTemplate}
                    placeholder="未選択"
                    onChange={handleSelectChange('scoutTemplate')}
                    disabled={!formData.group || !formData.scoutSenderName}
                    className="max-w-[400px]"
                  />
                </div>
              </div>

              {/* 件名 */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    件名
                  </span>
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={handleInputChange('title')}
                    onBlur={handleBlur('title')}
                    placeholder="件名を入力"
                    className="w-full max-w-[400px] bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999] focus:outline-none focus:border-[#4FC3A1] focus:shadow-[0_0_0_2px_rgba(79,195,161,0.2)]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  />
                  {touched.title && errors.title && (
                    <p className="mt-2 text-red-500 text-sm">{errors.title}</p>
                  )}
                </div>
              </div>

              {/* 本文 */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start self-stretch">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    本文
                  </span>
                </div>
                <div className="flex-1">
                  <textarea
                    value={formData.message}
                    onChange={handleTextareaChange}
                    onBlur={handleBlur('message')}
                    placeholder="本文を入力"
                    className="w-full h-[300px] bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999] focus:outline-none focus:border-[#4FC3A1] focus:shadow-[0_0_0_2px_rgba(79,195,161,0.2)] resize-none"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  />
                  {touched.message && errors.message && (
                    <p className="mt-2 text-red-500 text-sm">
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-10">
            <Button
              onClick={handleSubmit}
              variant="green-gradient"
              size="figma-default"
              className="min-w-[160px]"
              disabled={isSubmitDisabled}
            >
              送信内容の確認
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
