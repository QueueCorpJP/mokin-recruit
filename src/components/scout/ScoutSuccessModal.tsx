'use client';

import React, { useEffect } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Button } from '@/components/ui/button';

interface ScoutSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTicket?: () => void;
}

export const ScoutSuccessModal: React.FC<ScoutSuccessModalProps> = ({
  isOpen,
  onClose,
  onAddTicket,
}) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  // モーダル表示中はスクロールを禁止
  useEffect(() => {
    if (isOpen) {
      // 現在のスクロール位置を保存
      const scrollY = window.scrollY;
      // bodyにスタイルを適用
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.style.overflow = 'hidden';

      return () => {
        // クリーンアップ時にスタイルを元に戻す
        const savedScrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.overflow = '';
        // スクロール位置を復元
        window.scrollTo(0, parseInt(savedScrollY || '0') * -1);
      };
    }
    return undefined;
  }, [isOpen]);

  if (!isOpen) return null;

  // デスクトップ版
  if (isDesktop) {
    return (
      <>
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-[#323232] opacity-50 z-40"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[10px] w-[800px] h-[430px] flex flex-col">
            {/* Header - Fixed */}
            <div className="flex items-center justify-between px-10 py-6 border-b border-[#DCDCDC]">
              <h2 className="text-[24px] font-bold text-[#323232] tracking-[2.4px]">
                スカウト送信ができません
              </h2>
              <button
                onClick={onClose}
                className="w-6 h-6 flex items-center justify-center"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
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

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-10 py-10 bg-[#F9F9F9] flex flex-col items-center justify-center">
              <div className="text-center">
                <p className="text-[18px] bold text-[#323232] tracking-[1.6px]">
                  スカウト送信可能数の上限に達したため、スカウトを送信できません。
                  <br />
                  引き続きスカウトを送信するには、追加チケットをご購入ください。
                </p>
              </div>
            </div>

            {/* Footer - Fixed */}
            <div className="relative px-10 py-4 border-t border-[#DCDCDC]">
              <div className="flex justify-center">
                <Button
                  variant="green-gradient"
                  size="figma-default"
                  onClick={() => {
                    onAddTicket?.();
                    onClose();
                  }}
                  className="min-w-[240px]"
                >
                  チケットを追加購入する
                </Button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  // モバイル版
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#323232] opacity-50 z-40"
        onClick={onClose}
      />

      {/* Mobile Modal */}
      <div className="fixed inset-x-0 bottom-0 z-50">
        <div className="bg-white rounded-t-[20px] max-h-[90vh] flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#DCDCDC]">
            <h2 className="text-[18px] font-bold text-[#323232]">
              スカウト送信ができません
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 flex items-center justify-center"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
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

          {/* Mobile Content */}
          <div className="flex-1 overflow-y-auto px-6 py-8 bg-[#F9F9F9] flex flex-col items-center justify-center">
            <div className="text-center">
              <p className="text-[14px] text-[#323232] mb-6">
                スカウト送信可能数の上限に達したため、スカウトを送信できません。
                <br />
                引き続きスカウトを送信するには、追加チケットをご購入ください。
              </p>
            </div>
          </div>

          {/* Mobile Footer - Fixed */}
          <div className="relative px-6 py-4 border-t border-[#DCDCDC]">
            <div className="flex justify-center">
              <Button
                variant="green-gradient"
                size="figma-default"
                onClick={() => {
                  onAddTicket?.();
                  onClose();
                }}
                className="min-w-[200px]"
              >
                チケットを追加購入する
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
