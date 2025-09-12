'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/mo-dal';
import { Input } from '../ui/input';
import { SelectInput } from '../ui/select-input';
import { Button } from '../ui/button';
import { Plus, X, Trash2 } from 'lucide-react';

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
      width="760px"
      height="auto"
    >
      <div className="px-0 py-10 w-full justify-center items-center">
        {/* グループ名（中央・グリーン） */}
        <div className="text-center mb-[24px]">
          <h3 className="font-['Noto_Sans_JP'] text-[18px] font-bold tracking-[1.8px] text-[#0f9058] leading-[1.6]">
            {groupName || 'グループ名テキスト'}
          </h3>
        </div>

        {/* 招待するメンバー */}
        <div className="mb-0">
         
          <div className="space-y-2 w-[560px] mx-auto">
            {members.map((member, index) => (
              <div key={member.id} className="flex items-center gap-2">
                {/* メールアドレス入力 */}
                <div className="flex-1 w-[400px]">
                  <Input
                    type="email"
                    value={member.email}
                    onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                    placeholder={index === 0 ? 'name@gmail.com' : 'メールアドレス'}
                    className="bg-white border border-[#999999] rounded-[5px] px-[11px] py-0 h-[42px] font-['Noto_Sans_JP'] text-[16px] font-medium tracking-[1.6px] placeholder:text-[#999999] text-[#323232]"
                  />
                </div>

                {/* 権限選択 */}
                <div className="w-[120px]">
                  <SelectInput
                    options={roleOptions}
                    value={member.role}
                    placeholder="権限を選択"
                    radius={5}
                    onChange={(value) => handleMemberChange(member.id, 'role', value)}
                  />
                </div>

                {/* 行削除 */}
                {members.length > 1 && (
                  <Button
                    onClick={() => handleRemoveMember(member.id)}
                    variant="ghost"
                    className="p-2 w-8 h-8 text-[#999999] hover:text-[#323232]"
                    aria-label="remove-row"
                  >
                    <svg 
                      className="size-6"
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </Button>
                )}
              </div>
            ))}

            {/* さらに追加ボタン */}
            <div className="text-center mt-4 w-full flex justify-center items-center">
              <Button
                onClick={handleAddMember}
                variant="green-outline"
                size="figma-small"
                className="flex items-center gap-2.5 px-6 py-2.5 min-w-[120px] rounded-[32px] border border-[#0f9058] bg-transparent text-[#0f9058] font-['Noto_Sans_JP'] text-[14px] font-bold tracking-[1.4px]"
                aria-label="add-row"
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


