'use client';

import React, { useState } from 'react';
import { SelectInput } from '@/components/ui/select-input';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { AdminConfirmModal } from '@/components/admin/ui/AdminConfirmModal';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MessageApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (status: '承認' | '非承認', reason: string, comment: string) => void;
  isProcessing?: boolean;
  messageContent?: string;
  currentStatus?: '未対応' | '承認' | '非承認';
}

const reasonOptions = [
  { value: '', label: '理由を選択してください' },
  { value: 'content_appropriate', label: '内容が適切' },
  { value: 'minor_adjustments', label: '軽微な修正済み' },
  { value: 'user_verified', label: 'ユーザー情報確認済み' },
  { value: 'legal_compliant', label: '法令遵守確認済み' },
  { value: 'content_inappropriate', label: '内容が不適切' },
  { value: 'information_insufficient', label: '情報不足' },
  { value: 'legal_violation', label: '法令違反の可能性' },
  { value: 'user_verification_failed', label: 'ユーザー情報未確認' },
];

export default function MessageApprovalModal({
  isOpen,
  onClose,
  onStatusChange,
  isProcessing = false,
  messageContent = 'メッセージ',
  currentStatus = '未対応'
}: MessageApprovalModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [comment, setComment] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionStatus, setCompletionStatus] = useState<'承認' | '非承認' | null>(null);
  const router = useRouter();
  if (!isOpen) return null;

  const handleApprove = () => {
    onStatusChange('承認', selectedReason, comment);
    setCompletionStatus('承認');
    setShowCompletionModal(true);
  };

  const handleReject = () => {
    onStatusChange('非承認', selectedReason, comment);
    setCompletionStatus('非承認');
    setShowCompletionModal(true);
  };

  const handleClose = () => {
    if (!isProcessing) {
      onClose();
      resetForm();
    }
  };

  const handleCompletionModalClose = () => {
    setShowCompletionModal(false);
    setCompletionStatus(null);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedReason('');
    setComment('');
  };

  return (
    <>
      {/* メイン選択モーダル */}
      {!showCompletionModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
        >
          <div 
            className="bg-white border border-[#323232] flex flex-col"
            style={{
              width: '604px',
              height: 'auto',
              borderRadius: '16px',
              padding: '40px 80px 40px 80px'
            }}
          >
            {/* タイトル */}
            <div className="text-center mb-4">
              <h2 className="font-['Inter'] font-bold text-[24px] text-[#323232] leading-[1.6]">
              メッセージを承認しますか？</h2>
            </div>
            {/* 説明文 */}
            <div className="text-start mb-6 ">
              <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6] mb-2">
              メッセージの承認をした場合、即時送信が行われます。

              </p>
              <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6]">
              非承認の場合は該当メッセージ送信者に非承認通知が届きます

              </p>
            </div>

            <div className="text-start mb-6 ">
              <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6] mb-2">
              非承認の場合は、理由を選択の上、詳細をお書きください。
              </p>
              <p className="font-['Inter'] text-[16px] font-bold text-[#323232] leading-[1.6] mb-2">
              （承認の場合は、必要ありません）

              </p>
            </div>

            <div className="space-y-6">
              {/* 理由選択 */}
              <div>
                <SelectInput
                  options={reasonOptions}
                  value={selectedReason}
                  onChange={setSelectedReason}
                  placeholder="理由を選択してください"
                  className="w-[300px]"
                  disabled={isProcessing}
                />
              </div>

              {/* コメント入力 */}
              <div>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="詳細なコメントがあれば入力してください..."
                  className="w-full px-3 py-2 border border-[#999999] rounded-[8px] resize-none focus:outline-none focus:ring-2 focus:ring-[#0F9058] focus:border-transparent font-['Inter'] text-[16px] leading-[1.6]"
                  rows={4}
                  disabled={isProcessing}
                />
              </div>
            </div>

            {/* ボタン */}
            <div className="flex gap-4 justify-center mt-8">
              <Button   
                onClick={handleReject}
                disabled={!selectedReason || isProcessing || currentStatus === '非承認'}
                variant="green-outline"
                size="figma-default"
                className="w-[180px] font-bold"
              >
                {isProcessing ? "処理中..." : "非承認にする"}
              </Button>
              <Button
                onClick={handleApprove}
                disabled={!selectedReason || isProcessing || currentStatus === '承認'}
                variant="green-gradient"
                size="figma-default"
                className="w-[180px] font-bold"
              >
                {isProcessing ? "処理中..." : "承認する"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 完了通知モーダル */}
      {showCompletionModal && completionStatus && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div 
            className="bg-white border border-[#323232] flex flex-col"
            style={{
              width: '604px',
              height: 'auto',
              borderRadius: '16px',
              padding: '40px'
            }}
          >
            {/* タイトル */}
            <div className="text-center mb-4">
              <h2 className="font-['Inter'] font-bold text-[24px] text-[#323232] leading-[1.6]">
              メッセージ承認処理完了
              </h2>
            </div>

            {/* 説明文 */}
            <div className="text-center mb-8">
              <p className="font-['Inter'] text-[16px] text-[#323232] leading-[1.6]">
              メッセージの承認結果を確定しました。
              </p>
            </div>
            {/* ボタン */}
            <div className="flex justify-center gap-4">
            <Button
                onClick={() => router.push('/admin/message/pending')}
                variant="green-outline"
                size="figma-default"
                className="w-auto font-bold"
              >
               確認が必要なメッセージ一覧
              </Button>
              <Button
                onClick={() => router.push('/admin/message')}
                variant="green-gradient"
                size="figma-default"
                className="w-auto font-bold"
              >
                管理画面トップ
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
