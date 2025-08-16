'use client';

import React, { useState, useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface WorkStyle {
  id: string;
  name: string;
}

const WORK_STYLES: WorkStyle[] = [
  { id: 'business-leader', name: '事業責任者や事業部長を目指したい' },
  { id: 'management', name: '経営に近い立場で意思決定に関わりたい' },
  { id: 'product-innovation', name: '0→1のプロダクト／市場を開拓したい' },
  { id: 'interest-text1', name: '興味のある働き方テキストが入ります。' },
  { id: 'interest-text2', name: '興味のある働き方テキストが入ります。' },
  { id: 'interest-text3', name: '興味のある働き方テキストが入ります。' },
  { id: 'interest-text4', name: '興味のある働き方テキストが入ります。' },
  { id: 'interest-text5', name: '興味のある働き方テキストが入ります。' },
];

interface WorkStyleSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (_selectedStyles: WorkStyle[]) => void;
  initialSelected?: WorkStyle[];
  maxSelections?: number;
}

export default function WorkStyleSelectModal({
  isOpen,
  onClose,
  onConfirm,
  initialSelected = [],
  maxSelections = WORK_STYLES.length,
}: WorkStyleSelectModalProps) {
  const [selectedStyles, setSelectedStyles] =
    useState<WorkStyle[]>(initialSelected);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedStyles(initialSelected);
  }, [initialSelected]);

  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
      };
    }
    return undefined;
  }, [isOpen]);

  const handleStyleClick = (style: WorkStyle) => {
    setSelectedStyles((prev) => {
      const isSelected = prev.some((s) => s.id === style.id);
      if (isSelected) {
        return prev.filter((s) => s.id !== style.id);
      } else {
        // 最大選択数に達している場合は追加しない
        if (prev.length >= maxSelections) {
          return prev;
        }
        return [...prev, style];
      }
    });
  };

  const handleConfirm = () => {
    onConfirm(selectedStyles);
    onClose();
  };

  if (!isOpen) return null;

  if (isDesktop) {
    return (
      <>
        <div
          className="fixed inset-0 bg-[#323232] opacity-50 z-40"
          onClick={onClose}
        />

        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] w-[800px] h-[680px] flex flex-col">
            <div className="flex items-center justify-between px-10 py-6 border-b border-[#DCDCDC]">
              <h2 className="text-[24px] font-bold text-[#323232] tracking-[2.4px]">
                興味のある働き方を選択
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="#999999"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-10 py-10 bg-[#F9F9F9]">
              {/* サブタイトルと説明文 */}
              <div className="mb-6">
                <h3 className="text-[18px] font-bold text-[#323232] tracking-[1.8px] mb-2">
                  希望する役割・責任範囲
                </h3>
                <p className="text-[14px] text-[#666666] tracking-[1.4px] pb-2 border-b border-[#DCDCDC]">
                  どんな立場で、どのように価値を発揮したいか
                </p>
              </div>

              {/* 選択肢リスト */}
              <div className="space-y-4">
                {WORK_STYLES.map((style) => {
                  const isSelected = selectedStyles.some(
                    (s) => s.id === style.id,
                  );
                  const isDisabled =
                    !isSelected && selectedStyles.length >= maxSelections;
                  return (
                    <button
                      key={style.id}
                      onClick={() => handleStyleClick(style)}
                      disabled={isDisabled}
                      className={`flex items-center gap-3 w-full text-left ${
                        isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'cursor-pointer'
                      }`}
                    >
                      <div className="w-5 h-5 flex-shrink-0">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M2.85714 0C1.28125 0 0 1.28125 0 2.85714V17.1429C0 18.7188 1.28125 20 2.85714 20H17.1429C18.7188 20 20 18.7188 20 17.1429V2.85714C20 1.28125 18.7188 0 17.1429 0H2.85714ZM15.0446 7.90179L9.33036 13.6161C8.91071 14.0357 8.23214 14.0357 7.81696 13.6161L4.95982 10.7589C4.54018 10.3393 4.54018 9.66071 4.95982 9.24554C5.37946 8.83036 6.05804 8.82589 6.47321 9.24554L8.57143 11.3438L13.5268 6.38393C13.9464 5.96429 14.625 5.96429 15.0402 6.38393C15.4554 6.80357 15.4598 7.48214 15.0402 7.89732L15.0446 7.90179Z"
                            fill={isSelected ? '#0F9058' : '#DCDCDC'}
                          />
                        </svg>
                      </div>
                      <span
                        className={`text-[16px] tracking-[1.6px] ${
                          isSelected
                            ? 'text-[#323232] font-medium'
                            : isDisabled
                              ? 'text-[#999999] font-normal'
                              : 'text-[#323232] font-normal'
                        }`}
                      >
                        {style.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="relative px-10 py-4 border-t border-[#DCDCDC]">
              <span className="absolute left-10 top-1/2 -translate-y-1/2 text-[16px] font-medium text-[#323232] tracking-[1.4px]">
                {selectedStyles.length}/{maxSelections} 選択中
              </span>
              <div className="flex justify-center">
                <button
                  onClick={handleConfirm}
                  className="px-[60px] py-3 bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-[32px] text-white text-[16px] font-bold tracking-[1.6px] shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] hover:from-[#1e8544] hover:to-[#147362] transition-all"
                >
                  決定
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="bg-white rounded-t-[24px] max-h-[90vh] flex flex-col">
          <div className="flex items-center justify-between px-4 py-5 border-b border-[#EFEFEF]">
            <h2 className="text-[18px] font-bold text-[#323232] tracking-[1.8px]">
              興味のある働き方を選択
            </h2>
            <button
              onClick={onClose}
              className="w-5 h-5 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                  d="M15 5L5 15M5 5L15 15"
                  stroke="#999999"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F9F9F9] px-4 py-6">
            {/* サブタイトルと説明文 */}
            <div className="mb-5">
              <h3 className="text-[16px] font-bold text-[#323232] tracking-[1.6px] mb-1">
                希望する役割・責任範囲
              </h3>
              <p className="text-[12px] text-[#666666] tracking-[1.2px] pb-2 border-b border-[#DCDCDC]">
                どんな立場で、どのように価値を発揮したいか
              </p>
            </div>

            {/* 選択肢リスト */}
            <div className="space-y-4">
              {WORK_STYLES.map((style) => {
                const isSelected = selectedStyles.some(
                  (s) => s.id === style.id,
                );
                const isDisabled =
                  !isSelected && selectedStyles.length >= maxSelections;
                return (
                  <button
                    key={style.id}
                    onClick={() => handleStyleClick(style)}
                    disabled={isDisabled}
                    className={`flex items-center gap-3 w-full text-left ${
                      isDisabled ? 'opacity-50' : ''
                    }`}
                  >
                    <div className="w-4 h-4 flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                      >
                        <path
                          d="M2.28571 0C0.99999 0 0 1 0 2.28571V13.7143C0 15 0.99999 16 2.28571 16H13.7143C15 16 16 15 16 13.7143V2.28571C16 1 15 0 13.7143 0H2.28571ZM12.0357 6.32143L7.46429 10.8929C7.12857 11.2286 6.58571 11.2286 6.25357 10.8929L3.96786 8.60714C3.63214 8.27143 3.63214 7.72857 3.96786 7.39643C4.30357 7.06429 4.84643 7.06071 5.17857 7.39643L6.85714 9.075L10.8214 5.10714C11.1571 4.77143 11.7 4.77143 12.0321 5.10714C12.3643 5.44286 12.3679 5.98571 12.0321 6.31786L12.0357 6.32143Z"
                          fill={isSelected ? '#0F9058' : '#DCDCDC'}
                        />
                      </svg>
                    </div>
                    <span
                      className={`text-[14px] tracking-[1.4px] ${
                        isSelected
                          ? 'text-[#323232] font-normal'
                          : isDisabled
                            ? 'text-[#999999] font-normal'
                            : 'text-[#323232] font-normal'
                      }`}
                    >
                      {style.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-white px-4 py-4 border-t border-[#EFEFEF]">
            <div className="flex flex-col items-center gap-3">
              <span className="text-[14px] font-medium text-[#323232] tracking-[1.4px]">
                {selectedStyles.length}/{maxSelections} 選択中
              </span>
              <button
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-b from-[#229a4e] to-[#17856f] rounded-full text-white text-[16px] font-bold tracking-[1.4px] shadow-[0px_2px_6px_0px_rgba(0,0,0,0.15)]"
              >
                決定
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
