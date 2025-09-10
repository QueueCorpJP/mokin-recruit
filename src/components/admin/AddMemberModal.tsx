'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';

interface Member {
  id: string;
  email: string;
  role: string;
}

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (members: Member[]) => void;
  groupName: string;
}

const roleOptions = [
  { value: 'admin', label: '管理者' },
  { value: 'scout', label: 'スカウト担当者' },
  { value: 'recruiter', label: '採用担当者' }
];

export default function AddMemberModal({
  isOpen,
  onClose,
  onConfirm,
  groupName,
}: AddMemberModalProps) {
  const [members, setMembers] = useState<Member[]>([
    { id: '1', email: '', role: '' }
  ]);

  const handleAddMember = () => {
    const newMember: Member = {
      id: Date.now().toString(),
      email: '',
      role: ''
    };
    setMembers([...members, newMember]);
  };

  const handleRemoveMember = (id: string) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id));
    }
  };

  const handleMemberChange = (id: string, field: keyof Member, value: string) => {
    setMembers(members.map(member =>
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  const handleConfirm = () => {
    // バリデーション：メンバーのメールアドレスと権限が入力されているかチェック
    const validMembers = members.filter(member =>
      member.email.trim() && member.role
    );

    if (validMembers.length === 0) {
      alert('少なくとも1人のメンバーを追加してください');
      return;
    }

    // メールアドレスの形式チェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = validMembers.filter(member => !emailRegex.test(member.email));
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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
    >
      <div
        className="bg-white border border-[#BABABA] rounded-none"
        style={{
          width: '812px',
          borderRadius: '0px'
        }}
      >
        {/* ヘッダー */}
        <div className="flex justify-between items-center px-10 py-6 border-b border-[#BABABA]">
          <h2 className="text-2xl font-bold text-black">
            グループへのメンバー招待
          </h2>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="icon"
            className="w-6 h-6 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </Button>
        </div>

        {/* メインコンテンツ */}
        <div className="px-10 py-20">
          {/* グループ名表示 */}
          <div className="flex items-center justify-center gap-10 mb-10">
            <label className="text-base font-bold text-black">
              グループ名
            </label>
            <span className="text-base font-bold text-black">
              {groupName}
            </span>
          </div>

          {/* 招待するメンバー */}
          <div className="mb-10">
            <h3 className="text-2xl font-bold text-black text-center mb-6">
              招待するメンバー
            </h3>

            <div className="space-y-2">
              {members.map((member, index) => (
                <div key={member.id} className="flex items-center gap-2">
                  {/* メールアドレス入力 */}
                  <div className="flex items-center gap-2.5 px-3.5 py-3 bg-white border border-black flex-1">
                    <input
                      type="email"
                      value={member.email}
                      onChange={(e) => handleMemberChange(member.id, 'email', e.target.value)}
                      placeholder={index === 0 ? "name@gmail.com" : "メールアドレス"}
                      className="flex-1 text-base font-bold text-black outline-none"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    {members.length > 1 && (
                      <Button
                        onClick={() => handleRemoveMember(member.id)}
                        variant="ghost"
                        size="icon"
                        className="text-2xl font-bold text-black hover:text-gray-600 w-8 h-8"
                      >
                        ×
                      </Button>
                    )}
                  </div>

                  {/* 権限選択 */}
                  <div className="w-40">
                    <SelectInput
                      options={roleOptions}
                      value={member.role}
                      placeholder="権限を選択"
                      onChange={(value) => handleMemberChange(member.id, 'role', value)}
                      className="w-full"
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* さらに追加ボタン */}
            <div className="text-center mt-4">
              <Button
                onClick={handleAddMember}
                variant="ghost"
                size="figma-default"
                className="text-base font-bold text-black hover:text-gray-600"
              >
                ＋さらに追加
              </Button>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-center gap-4 px-10 py-6 border-t border-[#BABABA]">
          <Button
            onClick={handleClose}
            variant="outline"
            size="figma-default"
            className="px-10"
          >
            キャンセル
          </Button>
          <Button
            onClick={handleConfirm}
            variant="green-gradient"
            size="figma-default"
            className="px-10"
          >
            招待を送信
          </Button>
        </div>
      </div>
    </div>
  );
}
