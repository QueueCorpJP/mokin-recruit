'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/mo-dal';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { Checkbox } from '@/components/ui/checkbox';

interface WorkStyle {
  id: string;
  name: string;
}

const workStyles: WorkStyle[] = [
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
  maxSelections = workStyles.length,
}: WorkStyleSelectModalProps) {
  const [selectedStyles, setSelectedStyles] = useState<WorkStyle[]>(initialSelected);
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    setSelectedStyles(initialSelected);
  }, [initialSelected]);

  const handleCheckboxChange = (style: WorkStyle) => {
    const isSelected = selectedStyles.some(s => s.id === style.id);
    if (isSelected) {
      setSelectedStyles(selectedStyles.filter(s => s.id !== style.id));
    } else {
      if (selectedStyles.length < maxSelections) {
        setSelectedStyles([...selectedStyles, style]);
      }
    }
  };

  const handleConfirm = () => {
    onConfirm(selectedStyles);
    onClose();
  };

  return (
    <Modal
      title="興味のある働き方を選択"
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText="決定"
      onPrimaryAction={handleConfirm}
      width={isDesktop ? "800px" : "100%"}
      height={isDesktop ? "680px" : "90vh"}
      selectedCount={selectedStyles.length}
      totalCount={maxSelections}
    >
      <div className="space-y-6">
        {maxSelections < workStyles.length && selectedStyles.length >= maxSelections && (
          <div className="p-3 bg-[#FFF3CD] border border-[#FFEAA7] rounded-md">
            <p className="font-['Noto_Sans_JP'] text-[14px] text-[#856404]">
              最大{maxSelections}個まで選択できます。他の項目を選択する場合は、既存の選択を解除してください。
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {workStyles.map((style) => {
            const isSelected = selectedStyles.some(s => s.id === style.id);
            const isDisabled = !isSelected && selectedStyles.length >= maxSelections;

            return (
              <div key={style.id} className="flex items-center">
                <Checkbox
                  label={style.name}
                  checked={isSelected}
                  onChange={() => handleCheckboxChange(style)}
                  disabled={isDisabled}
                />
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
}