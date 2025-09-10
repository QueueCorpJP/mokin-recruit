'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';
import { type GroupOption, type MessageTemplateData } from '../new/actions';
import { updateMessageTemplate, deleteMessageTemplate } from '../actions';

interface TemplateEditClientProps {
  initialGroupOptions: GroupOption[];
  templateData: MessageTemplateData | null;
  templateId: string;
}

export default function TemplateEditClient({ initialGroupOptions, templateData, templateId }: TemplateEditClientProps) {
  const router = useRouter();

  // フォームの状態管理
  const [group, setGroup] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [body, setBody] = useState('');

  // 初期値を設定
  useEffect(() => {
    if (templateData) {
      setGroup(templateData.groupId || '');
      setTemplateName(templateData.templateName || '');
      setBody(templateData.body || '');
    }
  }, [templateData]);

  // エラー状態管理
  const [errors, setErrors] = useState({
    group: '',
    templateName: '',
    body: '',
  });

  // タッチされたフィールドの管理
  const [touched, setTouched] = useState({
    group: false,
    templateName: false,
    body: false,
  });

  // 保存中の状態管理
  const [isSaving, setIsSaving] = useState(false);

  // 削除中の状態管理
  const [isDeleting, setIsDeleting] = useState(false);

  // テキストエリアへの参照
  const bodyTextareaRef = useRef<HTMLTextAreaElement>(null);

  // バリデーション
  const validateField = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'group':
        return value === '' ? 'グループを選択してください。' : '';
      case 'templateName':
        return value === '' ? 'テンプレート名を入力してください。' : '';
      case 'body':
        return value === '' ? '本文を入力してください。' : '';
      default:
        return '';
    }
  };

  // フィールド変更ハンドラー
  const handleFieldChange = (fieldName: string, value: string) => {
    switch (fieldName) {
      case 'group':
        setGroup(value);
        break;
      case 'templateName':
        setTemplateName(value);
        break;
      case 'body':
        setBody(value);
        break;
    }

    // バリデーション実行
    if (touched[fieldName as keyof typeof touched]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: validateField(fieldName, value),
      }));
    }
  };

  // フィールドのブラー処理
  const handleFieldBlur = (fieldName: string) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    const value = {
      group,
      templateName,
      body,
    }[fieldName];

    setErrors((prev) => ({
      ...prev,
      [fieldName]: validateField(fieldName, value || ''),
    }));
  };

  // 関数挿入処理
  const insertFunction = (functionText: string) => {
    if (!bodyTextareaRef.current) return;

    const textarea = bodyTextareaRef.current;
    const startPos = textarea.selectionStart;
    const endPos = textarea.selectionEnd;
    const beforeText = body.substring(0, startPos);
    const afterText = body.substring(endPos);

    const newBody = beforeText + functionText + afterText;
    setBody(newBody);

    // カーソル位置を挿入した関数の後に設定
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = startPos + functionText.length;
      textarea.selectionEnd = startPos + functionText.length;
    }, 0);
  };

  // キャンセルハンドラー
  const handleCancel = () => {
    router.push('/company/template');
  };

  // 保存ハンドラー
  const handleSave = async () => {
    // 保存中の場合は処理を中断
    if (isSaving) {
      return;
    }

    // 全フィールドをタッチ済みに
    setTouched({
      group: true,
      templateName: true,
      body: true,
    });

    // 全フィールドのバリデーション
    const newErrors = {
      group: validateField('group', group),
      templateName: validateField('templateName', templateName),
      body: validateField('body', body),
    };

    setErrors(newErrors);

    // エラーがあれば処理を中断
    if (Object.values(newErrors).some((error) => error !== '')) {
      return;
    }

    try {
      // 保存開始
      setIsSaving(true);

      // メッセージテンプレートを更新
      const result = await updateMessageTemplate(templateId, {
        groupId: group,
        templateName,
        body,
      });

      if (result.success) {
        // 成功後、一覧画面へ遷移
        router.push('/company/template');
      } else {
        // エラーメッセージを表示
        console.error('Failed to update message template:', result.error);
        alert(result.error || 'テンプレートの更新に失敗しました');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('予期しないエラーが発生しました');
    } finally {
      // 保存終了
      setIsSaving(false);
    }
  };

  // 削除ハンドラー
  const handleDelete = async () => {
    // 削除中の場合は処理を中断
    if (isDeleting) {
      return;
    }

    try {
      // 削除開始
      setIsDeleting(true);

      // メッセージテンプレートを削除
      const result = await deleteMessageTemplate(templateId);

      if (result.success) {
        // 成功後、一覧画面へ遷移
        router.push('/company/template');
      } else {
        // エラーメッセージを表示
        console.error('Failed to delete message template:', result.error);
        alert(result.error || 'テンプレートの削除に失敗しました');
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      alert('予期しないエラーが発生しました');
    } finally {
      // 削除終了
      setIsDeleting(false);
    }
  };

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

  // グループオプションは親コンポーネントから受け取る
  const groupOptions = initialGroupOptions;

  // フォームの全フィールドが有効かチェック
  const isFormValid = group !== '' && templateName !== '' && body !== '';

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
              href="/company/template"
              className="text-white text-[14px] font-bold tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              メッセージテンプレート一覧
            </Link>
            <RightArrowIcon />
            <span
              className="text-white text-[14px] font-bold tracking-[1.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              メッセージテンプレート編集
            </span>
          </div>

          {/* Page Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MailIcon />
              <h1
                className="text-white text-[24px] font-bold tracking-[2.4px]"
                style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
              >
                メッセージテンプレート編集
              </h1>
            </div>
                       
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-[#f9f9f9] flex-1 px-20 pt-10 pb-20">
        <div className="flex justify-end  pb-10">
      <Button
              variant="destructive"
              size="figma-default"
              onClick={handleDelete}
              className="min-w-[120px]"
              disabled={isDeleting}
            >
              {isDeleting ? '削除中...' : '削除する'}
            </Button>
            </div>
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
                  <div className="max-w-[400px]">
                    <SelectInput
                      options={groupOptions}
                      value={group}
                      placeholder="未選択"
                      onChange={(value) => handleFieldChange('group', value)}
                      onBlur={() => handleFieldBlur('group')}
                      className="w-full"
                    />
                    {touched.group && errors.group && (
                      <div
                        className="text-red-500 text-[14px] mt-2 font-medium"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {errors.group}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* テンプレート名 */}
              <div className="flex gap-6 items-center">
                <div className="w-[201px] bg-[#f9f9f9] rounded-[5px] px-6 py-0 flex items-center justify-start min-h-[102px]">
                  <span
                    className="text-[#323232] text-[16px] font-bold tracking-[1.6px] leading-[32px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    テンプレート名
                  </span>
                </div>
                <div className="flex-1">
                  <div className="max-w-[400px]">
                    <input
                      type="text"
                      value={templateName}
                      onChange={(e) =>
                        handleFieldChange('templateName', e.target.value)
                      }
                      onBlur={() => handleFieldBlur('templateName')}
                      placeholder="テンプレート名を入力"
                      className="w-full bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999] focus:outline-none focus:border-[#4FC3A1] focus:shadow-[0_0_0_2px_rgba(79,195,161,0.2)]"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    />
                    <div
                      className="text-[#999999] text-[14px] mt-2 font-medium"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      テンプレート名は候補者に共有されません。
                    </div>
                    {touched.templateName && errors.templateName && (
                      <div
                        className="text-red-500 text-[14px] mt-2 font-medium"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {errors.templateName}
                      </div>
                    )}
                  </div>
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
                <div className="flex-1 py-6">
                  <div>
                    <div className="border border-[#999999] rounded-[5px] p-3 bg-white">
                      {/* 関数挿入ボタン */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        <button
                          type="button"
                          onClick={() => insertFunction('{{候補者名}}')}
                          className="px-4 py-1 border border-[#0f9058] text-[#0f9058] rounded-full text-[14px] font-bold hover:bg-green-50 transition-colors"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          候補者名を挿入
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFunction('{{候補者在籍企業名}}')}
                          className="px-4 py-1 border border-[#0f9058] text-[#0f9058] rounded-full text-[14px] font-bold hover:bg-green-50 transition-colors"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          候補者の在籍企業名を挿入
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFunction('{{自社名}}')}
                          className="px-4 py-1 border border-[#0f9058] text-[#0f9058] rounded-full text-[14px] font-bold hover:bg-green-50 transition-colors"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          自社の企業名を挿入
                        </button>
                        <button
                          type="button"
                          onClick={() => insertFunction('{{送信担当者名}}')}
                          className="px-4 py-1 border border-[#0f9058] text-[#0f9058] rounded-full text-[14px] font-bold hover:bg-green-50 transition-colors"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          送信担当者名を挿入
                        </button>
                      </div>
                      <textarea
                        ref={bodyTextareaRef}
                        value={body}
                        onChange={(e) =>
                          handleFieldChange('body', e.target.value)
                        }
                        onBlur={() => handleFieldBlur('body')}
                        placeholder="本文を入力"
                        className="w-full h-[300px] bg-white text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999] resize-none focus:outline-none"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      />
                    </div>
                    {touched.body && errors.body && (
                      <div
                        className="text-red-500 text-[14px] mt-2 font-medium"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {errors.body}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Submit Buttons */}
          <div className="flex justify-center gap-4 m-10">
            <Button
              variant="green-outline"
              size="figma-outline"
              onClick={handleCancel}
              className="min-w-[160px]"
            >
              キャンセル
            </Button>
            <Button
              variant="green-gradient"
              size="figma-default"
              onClick={handleSave}
              className="min-w-[160px]"
              disabled={!isFormValid || isSaving}
            >
              {isSaving ? '更新中...' : '更新する'}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
