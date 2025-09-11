'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/mo-dal';
import { Input } from '../ui/input';
import { SelectInput } from '../ui/select-input';
import { Button } from '../ui/button';

interface Member {
  id: string;
  email: string;
  role: string;
}

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (members: Member[]) => void;
  groupName: string;
}

const roleOptions = [
  { value: 'admin', label: '管理者' },
  { value: 'scout', label: 'スカウト担当者' },
  { value: 'recruiter', label: '採用担当者' },
];

export function InviteMemberModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
}: InviteMemberModalProps) {
  const [members, setMembers] = useState<Member[]>([
    { id: '1', email: '', role: '' },
  ]);

  const handleAddMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      email: '',
      role: '',
    };
    setMembers(prev => [...prev, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    setMembers(prev => (prev.length > 1 ? prev.filter(m => m.id !== id) : prev));
  };

  const handleMemberChange = (id: string, field: keyof Member, value: string) => {
    setMembers(prev => prev.map(m => (m.id === id ? { ...m, [field]: value } : m)));
  };

  const handleConfirm = () => {
    const validMembers = members.filter(m => m.email.trim() && m.role);
    if (validMembers.length === 0) {
      alert('少なくとも1人のメンバーを追加してください');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validMembers.filter(m => !emailRegex.test(m.email));
    if (invalidEmails.length > 0) {
      alert('正しいメールアドレスを入力してください');
      return;
    }

    onConfirm(validMembers);
    handleClose();
  };

  const handleClose = () => {
    setMembers([{ id: '1', email: '', role: '' }]);
    onClose();
  };

  return (
    <Modal
      title="グループへのメンバー招待"
      isOpen={isOpen}
      onClose={handleClose}
      primaryButtonText="招待を送信"
      onPrimaryAction={handleConfirm}
      secondaryButtonText="キャンセル"
      onSecondaryAction={handleClose}
      width="812px"
      height="auto"
    >
      <div className="px-2 md:px-4 py-6 md:py-10">
        {/* グループ名表示 */}
        <div className="flex items-center justify-center gap-10 mb-10">
          <label className="text-base font-bold text-[#323232]">グループ名</label>
          <span className="text-base font-bold text-[#323232]">{groupName}</span>
        </div>

        {/* 招待するメンバー */}
        <div className="mb-2 md:mb-10">
          <h3 className="text-[18px] md:text-2xl font-bold text-[#323232] text-center mb-6">
            招待するメンバー
          </h3>

          <div className="space-y-2 max-w-[812px] mx-auto">
            {members.map((member, index) => (
              <div key={member.id} className="flex items-center gap-2">
                {/* メールアドレス入力 */}
                <div className="flex-1">
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                    placeholder={index === 0 ? 'name@gmail.com' : 'メールアドレス'}
                    className="bg-white border border-[#999999] rounded-[5px] px-[11px] py-[11px] font-['Noto_Sans_JP'] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999] text-[#323232]"
                  />
                </div>

                {/* 権限選択 */}
                <div className="w-40">
                  <SelectInput
                    options={roleOptions}
                    value={member.role}
                    placeholder="権限を選択"
                    onChange={(value) => handleMemberChange(member.id, 'role', value)}
                    className="bg-white border border-[#999999] rounded-[5px] font-['Noto_Sans_JP'] text-[16px] font-bold tracking-[1.6px]"
                  />
                </div>

                {/* 行削除 */}
                {members.length > 1 && (
                  <Button
                    onClick={() => handleRemoveMember(member.id)}
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8 text-[#999999] hover:text-[#323232]"
                    aria-label="remove-row"
                  >
                    ×
                  </Button>
                )}
              </div>
            ))}

            {/* さらに追加ボタン */}
            <div className="text-center mt-4">
              <Button
                onClick={handleAddMember}
                variant="ghost"
                size="figma-default"
                className="text-base font-bold text-[#323232] hover:text-[#0f9058]"
              >
                ＋さらに追加
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}


