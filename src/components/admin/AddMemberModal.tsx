'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';

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
  { value: 'scout', label: 'スカウト担当者' }
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
          <button
            onClick={handleClose}
            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
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
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="text-2xl font-bold text-black hover:text-gray-600"
                      >
                        ×
                      </button>
                    )}
                  </div>

                  {/* 権限選択 */}
                  <div className="flex items-center gap-2 px-3.5 py-3 bg-white border border-black">
                    <select
                      value={member.role}
                      onChange={(e) => handleMemberChange(member.id, 'role', e.target.value)}
                      className="text-base font-bold text-black outline-none bg-transparent"
                      style={{ fontFamily: 'Inter, sans-serif', minWidth: '112px' }}
                    >
                      <option value="">権限を選択</option>
                      {roleOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="flex-shrink-0">
                      <path d="M1 1L10 10L19 1" stroke="black" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
              ))}
            </div>

            {/* さらに追加ボタン */}
            <div className="text-center mt-4">
              <button
                onClick={handleAddMember}
                className="text-base font-bold text-black hover:text-gray-600"
              >
                ＋さらに追加
              </button>
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-center px-10 py-6 border-t border-[#BABABA]">
          <button
            onClick={handleConfirm}
            className="px-10 py-3.5 bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors"
            style={{ borderRadius: '32px' }}
          >
            招待を送信
          </button>
        </div>
      </div>
    </div>
  );
}
