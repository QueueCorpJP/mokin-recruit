'use client';

import React, { useState } from 'react';
import { Modal } from './mo-dal';
import { Button } from './button';
import { SelectInput } from './select-input';
import { 
  FigmaModalProps, 
  FormData, 
  DEFAULT_CATEGORY_OPTIONS, 
  DEFAULT_SUBCATEGORY_OPTIONS_MAP 
} from './figma-modal.types';

/**
 * Figmaデザインに基づくモーダルコンポーネント
 * 既存のmo-dal.tsx、button.tsx、select-input.tsxを使用
 */
export const FigmaModal: React.FC<FigmaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title = "設定",
  description = "以下の項目を設定してください。",
  categoryOptions = DEFAULT_CATEGORY_OPTIONS,
  subcategoryOptionsMap = DEFAULT_SUBCATEGORY_OPTIONS_MAP,
  required = { category: true, subcategory: true, details: false },
  validation
}) => {
  const [formData, setFormData] = useState<FormData>({
    category: '',
    subcategory: '',
    details: ''
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  // サブカテゴリー選択肢（カテゴリーに応じて動的に変更）
  const getSubcategoryOptions = (category: string) => {
    return subcategoryOptionsMap[category] || [{ value: '', label: 'サブカテゴリーを選択' }];
  };

  // バリデーション関数
  const validateField = (field: keyof FormData, value: string): string | null => {
    // カスタムバリデーションがある場合
    if (validation?.[field]) {
      return validation[field]!(value);
    }

    // デフォルトバリデーション
    if (required[field] && !value.trim()) {
      const fieldNames = {
        category: 'カテゴリー',
        subcategory: 'サブカテゴリー',
        details: '詳細情報'
      };
      return `${fieldNames[field]}は必須項目です`;
    }

    return null;
  };

  const handleCategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      category: value,
      subcategory: '' // カテゴリー変更時にサブカテゴリーをリセット
    }));
    
    // エラーをクリア
    setErrors(prev => ({ ...prev, category: undefined, subcategory: undefined }));
  };

  const handleSubcategoryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      subcategory: value
    }));
    
    // エラーをクリア
    setErrors(prev => ({ ...prev, subcategory: undefined }));
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      details: value
    }));
    
    // エラーをクリア
    setErrors(prev => ({ ...prev, details: undefined }));
  };

  const handleSubmit = () => {
    // バリデーション実行
    const newErrors: Partial<FormData> = {};
    
    (Object.keys(formData) as Array<keyof FormData>).forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit?.(formData);
    onClose();
  };

  const handleCancel = () => {
    // フォームをリセット
    setFormData({
      category: '',
      subcategory: '',
      details: ''
    });
    setErrors({});
    onClose();
  };

  const isFormValid = Object.keys(formData).every(field => {
    const key = field as keyof FormData;
    return !validateField(key, formData[key]);
  });

  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      width="640px"
      height="auto"
      overlayBgColor="rgba(0,0,0,0.4)"
      hideFooter={true}
    >
      <div className="flex flex-col gap-6 w-full">
        {/* 説明文 */}
        <div className="text-center">
          <p className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px]">
            {description}
          </p>
        </div>

        {/* フォーム項目 */}
        <div className="flex flex-col gap-6">
          {/* カテゴリー選択 */}
          <div className="flex flex-col gap-2">
            <label className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] tracking-[1.4px]">
              カテゴリー {required.category && <span className="text-[#F56C6C]">*</span>}
            </label>
            <SelectInput
              options={categoryOptions}
              value={formData.category}
              placeholder="カテゴリーを選択してください"
              onChange={handleCategoryChange}
              error={!!errors.category}
              errorMessage={errors.category}
              className="w-full"
            />
          </div>

          {/* サブカテゴリー選択 */}
          <div className="flex flex-col gap-2">
            <label className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] tracking-[1.4px]">
              サブカテゴリー {required.subcategory && <span className="text-[#F56C6C]">*</span>}
            </label>
            <SelectInput
              options={getSubcategoryOptions(formData.category)}
              value={formData.subcategory}
              placeholder="サブカテゴリーを選択してください"
              onChange={handleSubcategoryChange}
              disabled={!formData.category}
              error={!!errors.subcategory}
              errorMessage={errors.subcategory}
              className="w-full"
            />
          </div>

          {/* 詳細入力 */}
          <div className="flex flex-col gap-2">
            <label className="font-['Noto_Sans_JP'] text-[14px] font-bold text-[#323232] tracking-[1.4px]">
              詳細情報 {required.details && <span className="text-[#F56C6C]">*</span>}
            </label>
            <textarea
              value={formData.details}
              onChange={handleDetailsChange}
              placeholder={required.details ? "詳細情報を入力してください" : "詳細情報を入力してください（任意）"}
              className={`w-full px-3 py-3 bg-white border rounded-[8px] resize-none outline-none transition-all duration-200 font-['Noto_Sans_JP'] text-[16px] text-[#323232] tracking-[1.6px] placeholder:text-[#999999] ${
                errors.details 
                  ? 'border-[#F56C6C] focus:border-[#F56C6C] focus:shadow-[0_0_0_2px_rgba(245,108,108,0.2)]' 
                  : 'border-[#999999] focus:border-[#4FC3A1] focus:shadow-[0_0_0_2px_rgba(79,195,161,0.2)]'
              }`}
              rows={4}
              style={{
                minHeight: '120px'
              }}
            />
            {errors.details && (
              <div className="text-[#F56C6C] text-[14px] font-['Noto_Sans_JP'] font-normal leading-[1.4] tracking-[0.025em]">
                {errors.details}
              </div>
            )}
          </div>
        </div>

        {/* ボタン */}
        <div className="flex gap-4 justify-center pt-4">
          <Button
            variant="green-outline"
            size="figma-default"
            onClick={handleCancel}
            className="min-w-[140px]"
          >
            キャンセル
          </Button>
          <Button
            variant="green-gradient"
            size="figma-default"
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="min-w-[140px]"
          >
            確定
          </Button>
        </div>
      </div>
    </Modal>
  );
};
