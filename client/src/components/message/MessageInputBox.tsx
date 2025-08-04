import React, { useState } from 'react';
import { SelectInput } from '@/components/ui/select-input';

/**
 * [MessageInputBox]
 * メッセージ詳細画面の一番下に配置される入力エリア用のコンテナdiv。
 * - 横幅: 100%（親要素にフィット）
 * - padding: 上下16px, 左右24px
 * - 今後、入力欄やボタン等をこの中に追加予定
 */
export const MessageInputBox: React.FC = () => {
  // 仮のセレクト用オプション
  const templateOptions = [
    { value: '', label: 'テンプレート未選択' },
    { value: '1', label: '面談日程調整テンプレート' },
    { value: '2', label: '合否連絡テンプレート' },
  ];
  const [template, setTemplate] = useState('');

  return (
    <div
      className='w-full px-6 py-4 bg-white border-t border-[#efefef]'
      // px-6: 左右24px, py-4: 上下16px
    >
      {/* セレクトコンポーネント（左上配置） */}
      <div className='w-full flex flex-row items-start'>
        <SelectInput
          options={templateOptions}
          value={template}
          onChange={setTemplate}
          placeholder='テンプレート未選択'
          className='w-[240px] font-bold text-[16px]'
        />
      </div>
      {/* ここにメッセージ入力UIを追加していく */}
    </div>
  );
};
