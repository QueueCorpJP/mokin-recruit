'use client';

import React, { useState } from 'react';
import { Button } from './button';
import { SelectInput } from './select-input';
import {
  JoiningDateModalProps,
  JoiningDateFormData,
  JoiningDateErrors,
  generateYearOptions,
  generateMonthOptions,
  generateDayOptions,
  validateJoiningDate,
  formatJoiningDate,
} from './joining-date-modal.types';

export const JoiningDateModal: React.FC<JoiningDateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  candidateName = '候補者テキスト',
  title = '入社予定日の登録',
}) => {
  const [formData, setFormData] = useState<JoiningDateFormData>({
    year: '',
    month: '',
    day: '',
    joiningDate: '',
  });

  const [errors, setErrors] = useState<JoiningDateErrors>({});

  const yearOptions = generateYearOptions();
  const monthOptions = generateMonthOptions();

  const handleYearChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      year: value,
      month: '', // Reset month when year changes
      day: '', // Reset day when year changes
    }));

    if (errors.year) {
      setErrors(prev => ({ ...prev, year: undefined }));
    }
  };

  const handleMonthChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      month: value,
      day: '', // Reset day when month changes
    }));

    if (errors.month) {
      setErrors(prev => ({ ...prev, month: undefined }));
    }
  };

  const handleDayChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      day: value,
    }));

    if (errors.day) {
      setErrors(prev => ({ ...prev, day: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = validateJoiningDate(
      formData.year,
      formData.month,
      formData.day
    );
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!validateForm()) {
      return;
    }

    const joiningDate = formatJoiningDate(
      formData.year,
      formData.month,
      formData.day
    );
    const submitData: JoiningDateFormData = {
      ...formData,
      joiningDate,
    };

    onSubmit?.(submitData);
    handleCancel();
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setFormData({
      year: '',
      month: '',
      day: '',
      joiningDate: '',
    });
    setErrors({});
    onClose();
  };

  const dayOptions = generateDayOptions(formData.year, formData.month);
  const isFormValid =
    formData.year &&
    formData.month &&
    formData.day &&
    Object.keys(errors).length === 0;

  if (!isOpen) return null;

  return (
    <div
      className='fixed inset-0 flex z-50 items-center justify-center p-4'
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      onClick={handleCancel}
    >
      <div
        className='flex flex-col items-start bg-white overflow-hidden shadow-lg w-auto rounded-[10px] max-w-[95vw] max-h-[90vh]'
        style={{
          width: '880px',
          height: 'auto',
          maxHeight: '90vh',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <header className='flex w-full items-center justify-between gap-4 md:gap-6 px-4 md:px-6 py-4 md:py-6 relative bg-white border-b border-[#E5E7EB] flex-shrink-0'>
          <h2 className="text-[#323232] text-lg md:text-[20px] tracking-[0.05em] leading-[1.6] font-bold font-['Noto_Sans_JP'] truncate">
            {title}
          </h2>
          <button
            className='flex w-8 h-8 items-center justify-center hover:bg-gray-100 rounded transition-colors flex-shrink-0'
            onClick={handleCancel}
          >
            <svg
              className='w-5 h-5 md:w-6 md:h-6 text-gray-400 hover:text-gray-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          </button>
        </header>

        {/* Main content */}
        <div
          className='flex flex-col w-full items-start gap-4 md:gap-6 p-4 md:p-6 bg-[#F9F9F9] overflow-y-auto overflow-x-hidden relative modal-content'
          style={{ flex: '1 1 auto' }}
        >
          <div className='flex flex-col items-center w-full py-8'>
            <div className='text-center mb-6'>
              <span className="font-['Noto_Sans_JP'] text-[18px] font-medium text-[#0f9058] tracking-[1.8px] leading-[1.6]">
                {candidateName}
              </span>
            </div>

            <div className='w-full max-w-[560px]'>
              <div className='mb-6'>
                <div className='flex gap-4 items-start'>
                  <div className='flex items-center pt-[11px] pb-0 pr-0 pl-0 whitespace-nowrap'>
                    <span className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] tracking-[1.6px] leading-[2]">
                      入社予定日
                    </span>
                  </div>

                  <div className='flex flex-col gap-2 items-start'>
                    <div className='flex gap-2 items-center'>
                      <div className='bg-white border border-[#999999] rounded-[5px] flex gap-4 items-center justify-start pl-[11px] pr-4 py-[11px] relative'>
                        <SelectInput
                          options={yearOptions}
                          value={formData.year}
                          placeholder='未選択'
                          onChange={handleYearChange}
                          onFocus={() => {}}
                          onOpen={() => {}}
                          error={!!errors.year}
                          errorMessage={errors.year || ''}
                          className='border-none bg-transparent p-0'
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            minWidth: '80px',
                          }}
                        />
                      </div>
                      <span className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] tracking-[1.6px] leading-[2]">
                        年
                      </span>

                      <div className='bg-white border border-[#999999] rounded-[5px] flex gap-4 items-center justify-start pl-[11px] pr-4 py-[11px] relative'>
                        <SelectInput
                          options={monthOptions}
                          value={formData.month}
                          placeholder='未選択'
                          onChange={handleMonthChange}
                          disabled={!formData.year}
                          onFocus={() => {}}
                          onOpen={() => {}}
                          error={!!errors.month}
                          errorMessage={errors.month || ''}
                          className='border-none bg-transparent p-0'
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            minWidth: '60px',
                          }}
                        />
                      </div>
                      <span className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] tracking-[1.6px] leading-[2]">
                        月
                      </span>

                      <div className='bg-white border border-[#999999] rounded-[5px] flex gap-4 items-center justify-start pl-[11px] pr-4 py-[11px] relative'>
                        <SelectInput
                          options={dayOptions}
                          value={formData.day}
                          placeholder='未選択'
                          onChange={handleDayChange}
                          disabled={!formData.year || !formData.month}
                          onFocus={() => {}}
                          onOpen={() => {}}
                          error={!!errors.day}
                          errorMessage={errors.day || ''}
                          className='border-none bg-transparent p-0'
                          style={{
                            border: 'none',
                            background: 'transparent',
                            padding: 0,
                            minWidth: '60px',
                          }}
                        />
                      </div>
                      <span className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] tracking-[1.6px] leading-[2]">
                        日
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer
          className='w-full flex flex-col md:flex-row items-stretch md:items-center justify-center px-4 md:px-6 py-4 md:py-0 bg-white border-t border-[#E5E7EB] flex-shrink-0 gap-3 md:gap-4'
          style={{
            height: 'auto',
            minHeight: '108px',
            maxHeight: 'none',
          }}
        >
          <div className='flex justify-center gap-4'>
            <Button
              variant='green-outline'
              size='figma-default'
              className='min-w-40'
              onClick={handleCancel}
            >
              キャンセル
            </Button>
            <Button
              variant={isFormValid ? 'green-gradient' : 'green-outline'}
              size='figma-default'
              className='min-w-40'
              disabled={!isFormValid}
              onClick={handleSubmit}
            >
              登録
            </Button>
          </div>
        </footer>
      </div>
    </div>
  );
};
