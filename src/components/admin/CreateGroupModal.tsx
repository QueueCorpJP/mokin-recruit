'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/mo-dal';
import { Input } from '../ui/input';
import { SelectInput } from '../ui/select-input';
import { Button } from '../ui/button';
import { X, Plus } from 'lucide-react';

interface MemberInvitation {
  email: string;
  role: 'admin' | 'recruiter' | 'scout';
}

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { groupName: string; members: MemberInvitation[] }) => void;
}

const roleOptions = [
  { value: 'admin', label: '管理者' },
  { value: 'recruiter', label: '採用担当者' },
  { value: 'scout', label: 'スカウト担当者' },
];

export function CreateGroupModal({
  isOpen,
  onClose,
  onSubmit,
}: CreateGroupModalProps) {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState<MemberInvitation[]>([
    { email: '', role: 'admin' },
  ]);

  const handleAddMember = () => {
    setMembers([...members, { email: '', role: 'admin' }]);
  };

  const handleRemoveMember = (index: number) => {
    if (members.length > 1) {
      setMembers(members.filter((_, i) => i !== index));
    }
  };

  const handleMemberChange = (
    index: number,
    field: 'email' | 'role',
    value: string
  ) => {
    const updatedMembers = [...members];
    if (field === 'role') {
      updatedMembers[index][field] = value as 'admin' | 'recruiter' | 'scout';
    } else {
      updatedMembers[index][field] = value;
    }
    setMembers(updatedMembers);
  };

  const handleSubmit = () => {
    if (
      groupName.trim() &&
      members.some(member => member.email.trim() && member.role)
    ) {
      onSubmit({
        groupName: groupName.trim(),
        members: members.filter(m => m.email.trim() && m.role),
      });
    }
  };

  return (
    <Modal
      title='グループ新規作成'
      isOpen={isOpen}
      onClose={onClose}
      primaryButtonText='招待を送信'
      onPrimaryAction={handleSubmit}
      secondaryButtonText='キャンセル'
      onSecondaryAction={onClose}
      width='760px'
      height='auto'
    >
      <div className='flex flex-col gap-10 w-full'>
        {/* 説明文 */}
        <div className='text-center'>
          <div className="font-['Noto_Sans_JP'] text-[16px] font-medium leading-[2] tracking-[1.6px] text-[#323232] mb-6">
            <p className='mb-0'>通知や管理の負担を減らすため、</p>
            <p className='mb-0'>
              グループは部署単位などでの作成をおすすめします。
            </p>
          </div>

          {/* グループ名入力 */}
          <div className='flex flex-col gap-2 max-w-[400px] mx-auto'>
            <Input
              placeholder='グループ名を入力'
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="!bg-white !border !border-[#999999] !rounded-[5px] !px-[11px] !py-0 !h-[42px] !w-full font-['Noto_Sans_JP'] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999]"
            />
            <p className="text-[#999999]  w-full flex justify-start items-start text-[14px] font-['Noto_Sans_JP'] font-medium tracking-[1.4px] leading-[1.6] text-center">
              グループ名は候補者にも公開されます。
            </p>
          </div>
        </div>

        {/* メンバー招待セクション */}
        <div className='flex flex-col gap-4 items-center'>
          <h3 className="font-['Noto_Sans_JP'] text-[18px] font-bold tracking-[1.8px] text-[#323232] leading-[1.6] text-center">
            招待するメンバー
          </h3>

          <div className='flex flex-col gap-2 w-[400px]'>
            {members.map((member, index) => (
              <div key={index} className='flex gap-2 items-start'>
                <Input
                  placeholder='name@example.com'
                  value={member.email}
                  onChange={e =>
                    handleMemberChange(index, 'email', e.target.value)
                  }
                  type='email'
                  className="!flex-1 !bg-white !border !border-[#999999] !rounded-[5px] !px-[11px] !py-0 !h-[42px] !w-auto !min-w-0 font-['Noto_Sans_JP'] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999]"
                />
                <div className='w-[120px] flex-shrink-0'>
                  <SelectInput
                    options={roleOptions}
                    value={member.role}
                    placeholder='権限を選択'
                    radius={5}
                    className='!w-full'
                    onChange={value => handleMemberChange(index, 'role', value)}
                  />
                </div>
                {members.length > 1 && (
                  <button
                    onClick={() => handleRemoveMember(index)}
                    className='p-2 text-[#999999] hover:text-[#323232] transition-colors'
                  >
                    <X size={24} />
                  </button>
                )}
              </div>
            ))}

            {/* さらに追加ボタン */}
            <div className='flex justify-center mt-2'>
              <Button
                variant='green-outline'
                size='figma-small'
                onClick={handleAddMember}
                className="flex items-center gap-2.5 px-6 py-2.5 min-w-[120px] rounded-[32px] border border-[#0f9058] bg-transparent text-[#0f9058] font-['Noto_Sans_JP'] text-[14px] font-bold tracking-[1.4px]"
              >
                <Plus size={16} />
                さらに追加
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
