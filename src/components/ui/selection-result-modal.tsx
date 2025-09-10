import React from 'react';
import { Modal } from './mo-dal';
import { Button } from './button';

interface SelectionResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidateName?: string;
  selectionStage?: string;
  onPass?: () => void;
  onReject?: () => void;
}

/**
 * 選考結果の合否登録モーダル
 */
export const SelectionResultModal: React.FC<SelectionResultModalProps> = ({
  isOpen,
  onClose,
  candidateName = '候補者テキスト',
  selectionStage = '書類選考',
  onPass,
  onReject,
}) => {
  return (
    <Modal
      title="選考結果の登録"
      isOpen={isOpen}
      onClose={onClose}
      width="640px"
      height="auto"
      overlayBgColor="rgba(0,0,0,0.4)"
      primaryButtonText=""
      secondaryButtonText=""
      hideFooter={true}
    >
      <div className="flex flex-col items-center justify-center min-h-60 w-full">
        <div className="font-['Noto_Sans_JP'] text-[18px] font-medium text-[#323232] text-center tracking-[1.8px] leading-[1.6] mb-10">
          選考結果の合否を登録してください。
        </div>
        
        <div className="flex items-center gap-2 mb-10">
          <div className="font-['Noto_Sans_JP'] text-[18px] font-medium text-[#0f9058] text-center tracking-[1.8px] leading-[1.6] whitespace-nowrap">
            {candidateName}
          </div>
          <div className="bg-[#0f9058] px-4 py-0 rounded-[5px] flex items-center justify-center">
            <div className="font-['Noto_Sans_JP'] text-[16px] font-medium text-white text-center tracking-[1.6px] leading-[2] whitespace-nowrap">
              {selectionStage}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Button
            variant="green-gradient"
            size="figma-default"
            className="min-w-40 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onPass?.();
            }}
          >
            通過
          </Button>
          <Button
            variant="destructive"
            size="figma-default"
            className="bg-[#ff5b5b] hover:bg-[#e54949] min-w-40 shadow-[0px_5px_10px_0px_rgba(0,0,0,0.15)] font-bold"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onReject?.();
            }}
          >
            見送り
          </Button>
        </div>
      </div>
    </Modal>
  );
};