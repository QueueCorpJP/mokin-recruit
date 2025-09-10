'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { acceptInvitation } from '@/app/admin/company/[id]/actions';

interface InvitationHandlerProps {
  token: string;
}

export default function InvitationHandler({ token }: InvitationHandlerProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [invitationData, setInvitationData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // 招待情報を検証（一時的な実装）
    const verifyInvitation = async () => {
      try {
        // トークンの形式チェック
        if (!token.startsWith('invite_')) {
          setError('無効な招待リンクです');
          setIsLoading(false);
          return;
        }

        // 一時的なモックデータ
        const mockData = {
          companyName: '株式会社サンプル',
          groupName: '営業チーム',
          role: 'scout',
          email: 'user@example.com',
          roleText: 'スカウト担当者'
        };

        setInvitationData(mockData);
        setIsLoading(false);
      } catch (err) {
        console.error('招待検証エラー:', err);
        setError('招待リンクの検証に失敗しました');
        setIsLoading(false);
      }
    };

    verifyInvitation();
  }, [token]);

  const handleAcceptInvitation = async () => {
    if (!invitationData) return;

    setIsProcessing(true);
    setError(null);

    try {
      // 実際の招待受け入れ処理
      const result = await acceptInvitation(token, 'current-user-id'); // TODO: 実際のユーザーIDを取得

      if (result.success) {
        setIsRedirecting(true);
        // 成功メッセージを表示
        if (result.alreadyMember) {
          // 既にメンバーの場合
          setSuccessMessage('既にこのグループのメンバーです。ダッシュボードに移動します...');
          setTimeout(() => {
            router.push('/company/dashboard?message=already_member');
          }, 2000);
        } else {
          // 新規メンバーの場合
          setSuccessMessage('グループへの参加が完了しました。ダッシュボードに移動します...');
          setTimeout(() => {
            router.push('/company/dashboard?message=invitation_accepted');
          }, 2000);
        }
      } else {
        setError(result.error || '招待の受け入れに失敗しました');
      }
    } catch (err) {
      console.error('招待受け入れエラー:', err);
      setError('招待の受け入れ中にエラーが発生しました');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeclineInvitation = () => {
    router.push('/auth/login?message=invitation_declined');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">招待情報を確認中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <div className="text-red-600 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">招待リンクが無効です</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              ログインに戻る
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md">
        {/* ヘッダー */}
        <div className="bg-green-600 text-white p-6 rounded-t-lg">
          <h1 className="text-2xl font-bold text-center">グループへの招待</h1>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {invitationData.companyName}
            </h2>
            <p className="text-gray-600">
              からグループへの招待が届いています
            </p>
          </div>

          {/* 招待情報 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">グループ名:</span>
                <span className="font-medium">{invitationData.groupName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">権限:</span>
                <span className="font-medium">{invitationData.roleText}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">メールアドレス:</span>
                <span className="font-medium text-sm">{invitationData.email}</span>
              </div>
            </div>
          </div>

          {/* 成功メッセージ */}
          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                {successMessage}
              </div>
            </div>
          )}

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {/* ボタン */}
          <div className="space-y-3">
            <button
              onClick={handleAcceptInvitation}
              disabled={isProcessing || isRedirecting}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRedirecting ? '移動中...' : isProcessing ? '処理中...' : '招待を受け入れる'}
            </button>

            <button
              onClick={handleDeclineInvitation}
              disabled={isProcessing || isRedirecting}
              className="w-full bg-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              辞退する
            </button>
          </div>

          {/* 注意書き */}
          <div className="mt-6 text-sm text-gray-500 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-700 font-medium">💡 ご注意</p>
              <p className="text-blue-600 text-xs mt-1">
                招待メール送信時に既にグループメンバーとして追加されています。<br />
                この招待を受け入れることで、正式にグループ活動を開始できます。
              </p>
            </div>
            <p>この招待リンクは7日間有効です。</p>
            <p>招待を受け入れると、グループメンバーとして活動できるようになります。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
