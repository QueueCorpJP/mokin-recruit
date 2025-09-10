'use client';

import React from 'react';
import { X } from 'lucide-react';

interface InvitedMember {
  email: string;
  role: string;
  status: string;
  emailSent?: boolean;
}

interface InvitationCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  invitedMembersCount: number;
  invitedMembers?: InvitedMember[];
}

export default function InvitationCompleteModal({
  isOpen,
  onClose,
  invitedMembersCount,
  invitedMembers = [],
}: InvitationCompleteModalProps) {
  if (!isOpen) return null;

  // メール送信結果を集計
  const emailSentCount = invitedMembers.filter(member => member.emailSent === true).length;
  const emailFailedCount = invitedMembers.filter(member => member.emailSent === false).length;

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
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-6 h-6 text-gray-400 hover:text-gray-600" />
          </button>
        </div>

        {/* メインコンテンツ */}
        <div className="px-10 py-8">
          <div className="text-center mb-6">
            <p className="text-base font-bold text-black leading-relaxed">
              グループへの招待処理が完了しました。
            </p>
          </div>

          {/* 処理結果サマリー */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-black mb-4">処理結果</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">招待したメンバー:</span>
                <span className="font-medium">{invitedMembersCount}名</span>
              </div>
              {invitedMembers.length > 0 && (
                <>
                  <div className="flex justify-between">
                    <span className="text-green-600">✓ メール送信成功:</span>
                    <span className="font-medium text-green-600">{emailSentCount}名</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">⚠ メール送信失敗:</span>
                    <span className="font-medium text-orange-600">{emailFailedCount}名</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* メール送信失敗時の注意 */}
          {emailFailedCount > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h4 className="text-yellow-800 font-bold mb-2">注意</h4>
              <p className="text-yellow-700 text-sm">
                一部のメンバーにメールが送信されませんでしたが、ユーザーの作成とグループへの参加権限付与は完了しています。
                メール送信に失敗したメンバーには、招待URLを直接共有してください。
              </p>
            </div>
          )}

          {/* 招待メンバー詳細 */}
          {invitedMembers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="text-base font-bold text-black mb-3">招待メンバー詳細</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {invitedMembers.map((member, index) => (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-sm text-gray-700">{member.email}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">({member.role === 'admin' ? '管理者' : 'スカウト担当者'})</span>
                      {member.emailSent ? (
                        <span className="text-xs text-green-600 font-medium">✓ メール送信済</span>
                      ) : (
                        <span className="text-xs text-orange-600 font-medium">⚠ メール未送信</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center text-sm text-gray-600">
            <p>招待されたメンバーは、メール内のリンクからグループに参加できます。</p>
            {emailFailedCount > 0 && (
              <p className="mt-2 text-orange-600">
                ※ メール送信に失敗したメンバーには、招待URLを直接お知らせください。
              </p>
            )}
          </div>
        </div>

        {/* フッター */}
        <div className="flex justify-center px-10 py-6 border-t border-[#BABABA]">
          <button
            onClick={onClose}
            className="px-10 py-3.5 bg-black text-white text-base font-bold hover:bg-gray-800 transition-colors"
            style={{ borderRadius: '32px' }}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
