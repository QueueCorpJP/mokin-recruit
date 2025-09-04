'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEditData } from './edit/page';
import CompanyUserDeleteModal from '@/components/admin/CompanyUserDeleteModal';
import NewGroupModal from '@/components/admin/NewGroupModal';
import CompanyUserRoleChangeModal from '@/components/admin/CompanyUserRoleChangeModal';
import CompanyGroupNameChangeModal from '@/components/admin/CompanyGroupNameChangeModal';
import AddMemberModal from '@/components/admin/AddMemberModal';
import InvitationCompleteModal from '@/components/admin/InvitationCompleteModal';
import CompanyWithdrawalConfirmModal from '@/components/admin/CompanyWithdrawalConfirmModal';
import CompanyWithdrawalCompleteModal from '@/components/admin/CompanyWithdrawalCompleteModal';
import CompanyPlanChangeModal from '@/components/admin/CompanyPlanChangeModal';
import CompanyPlanChangeCompleteModal from '@/components/admin/CompanyPlanChangeCompleteModal';
import CompanyScoutLimitChangeModal from '@/components/admin/CompanyScoutLimitChangeModal';
import CompanyScoutLimitChangeCompleteModal from '@/components/admin/CompanyScoutLimitChangeCompleteModal';

interface CompanyDetailClientProps {
  company: CompanyEditData;
  onUserDeleteComplete?: () => void;
}

export default function CompanyDetailClient({ company, onUserDeleteComplete }: CompanyDetailClientProps) {
  const router = useRouter();
  const [memoText, setMemoText] = useState('自由にメモを記入できます。\n同一グループ内の方が閲覧可能です。');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{name: string, id: string} | null>(null);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState<{
    userName: string;
    userId: string;
    currentRole: string;
    newRole: string;
  } | null>(null);
  const [groupNameChangeModalOpen, setGroupNameChangeModalOpen] = useState(false);
  const [selectedGroupData, setSelectedGroupData] = useState<{
    groupId: string;
    currentName: string;
  } | null>(null);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedGroupForMember, setSelectedGroupForMember] = useState<{
    groupId: string;
    groupName: string;
  } | null>(null);
  const [invitationCompleteModalOpen, setInvitationCompleteModalOpen] = useState(false);
  const [invitedMembersCount, setInvitedMembersCount] = useState(0);
  const [withdrawalConfirmModalOpen, setWithdrawalConfirmModalOpen] = useState(false);
  const [withdrawalCompleteModalOpen, setWithdrawalCompleteModalOpen] = useState(false);
  const [planChangeModalOpen, setPlanChangeModalOpen] = useState(false);
  const [planChangeCompleteModalOpen, setPlanChangeCompleteModalOpen] = useState(false);
  const [newSelectedPlan, setNewSelectedPlan] = useState('');
  const [scoutLimitChangeModalOpen, setScoutLimitChangeModalOpen] = useState(false);
  const [scoutLimitChangeCompleteModalOpen, setScoutLimitChangeCompleteModalOpen] = useState(false);
  const [newSelectedScoutLimit, setNewSelectedScoutLimit] = useState(0);

  const handleEdit = () => {
    router.push(`/admin/company/${company.id}/edit`);
  };

  const handleDelete = () => {
    if (confirm('本当にこの企業を削除しますか？')) {
      // TODO: 実際の削除処理を実装
      console.log('Deleting company:', company.id);
      // 削除完了ページに遷移
      router.push('/admin/company/delete');
    }
  };

  const handleUserDeleteClick = (userName: string, userId: string) => {
    setSelectedUser({ name: userName, id: userId });
    setDeleteModalOpen(true);
  };

  const handleUserDeleteConfirm = () => {
    if (selectedUser) {
      // TODO: 実際の企業ユーザー削除処理を実装
      console.log('Deleting user:', selectedUser.id, selectedUser.name);
      setDeleteModalOpen(false);
      setSelectedUser(null);

      // デバッグページ用のコールバックがある場合はそれを実行
      if (onUserDeleteComplete) {
        onUserDeleteComplete();
      } else {
        // 通常の企業詳細ページでは削除完了ページに遷移
        router.push('/admin/company/user');
      }
    }
  };

  const handleUserDeleteCancel = () => {
    setDeleteModalOpen(false);
    setSelectedUser(null);
  };

  const handleNewGroupClick = () => {
    setNewGroupModalOpen(true);
  };

  const handleNewGroupConfirm = (groupName: string, members: any[]) => {
    // TODO: 実際のグループ作成処理を実装
    console.log('Creating new group:', groupName, 'with members:', members);
    alert(`グループ「${groupName}」を作成しました（デバッグモード）`);
    setNewGroupModalOpen(false);
  };

  const handleNewGroupCancel = () => {
    setNewGroupModalOpen(false);
  };

  const handleRoleChangeClick = (userName: string, userId: string, currentRole: string, newRole: string) => {
    setRoleChangeData({
      userName,
      userId,
      currentRole,
      newRole,
    });
    setRoleChangeModalOpen(true);
  };

  const handleRoleChangeConfirm = () => {
    if (roleChangeData) {
      // TODO: 実際の権限変更処理を実装
      console.log('Changing role for user:', roleChangeData.userId, 'from', roleChangeData.currentRole, 'to', roleChangeData.newRole);
      alert(`${roleChangeData.userName}さんの権限を${roleChangeData.newRole}に変更しました（デバッグモード）`);
      setRoleChangeModalOpen(false);
      setRoleChangeData(null);
    }
  };

  const handleRoleChangeCancel = () => {
    setRoleChangeModalOpen(false);
    setRoleChangeData(null);
  };

  const handleGroupNameChangeClick = (groupId: string, currentName: string) => {
    setSelectedGroupData({
      groupId,
      currentName,
    });
    setGroupNameChangeModalOpen(true);
  };

  const handleGroupNameChangeConfirm = (newGroupName: string) => {
    if (selectedGroupData) {
      // TODO: 実際のグループ名変更処理を実装
      console.log('Changing group name:', selectedGroupData.groupId, 'from', selectedGroupData.currentName, 'to', newGroupName);
      alert(`グループ名を「${newGroupName}」に変更しました（デバッグモード）`);
      setGroupNameChangeModalOpen(false);
      setSelectedGroupData(null);
    }
  };

  const handleGroupNameChangeCancel = () => {
    setGroupNameChangeModalOpen(false);
    setSelectedGroupData(null);
  };

  const handleAddMemberClick = (groupId: string, groupName: string) => {
    setSelectedGroupForMember({
      groupId,
      groupName,
    });
    setAddMemberModalOpen(true);
  };

  const handleAddMemberConfirm = (members: any[]) => {
    if (selectedGroupForMember) {
      // TODO: 実際のメンバー追加処理を実装
      console.log('Adding members to group:', selectedGroupForMember.groupId, 'members:', members);

      // 招待完了モーダルを開く
      setInvitedMembersCount(members.length);
      setAddMemberModalOpen(false);
      setInvitationCompleteModalOpen(true);
    }
  };

  const handleAddMemberCancel = () => {
    setAddMemberModalOpen(false);
    setSelectedGroupForMember(null);
  };

  const handleInvitationCompleteClose = () => {
    setInvitationCompleteModalOpen(false);
    setSelectedGroupForMember(null);
    setInvitedMembersCount(0);
  };

  const handleWithdrawalClick = () => {
    setWithdrawalConfirmModalOpen(true);
  };

  const handleWithdrawalConfirm = () => {
    // TODO: 実際の休会処理を実装
    console.log('Withdrawing company:', company.company_name);

    // 休会確認モーダルを閉じて、完了モーダルを表示
    setWithdrawalConfirmModalOpen(false);
    setWithdrawalCompleteModalOpen(true);
  };

  const handleWithdrawalCancel = () => {
    setWithdrawalConfirmModalOpen(false);
  };

  const handleWithdrawalCompleteClose = () => {
    setWithdrawalCompleteModalOpen(false);
    // 休会完了後にページ遷移
    router.push('/admin/company/withdraw');
  };

  const handlePlanChangeClick = () => {
    setPlanChangeModalOpen(true);
  };

  const handlePlanChangeConfirm = (newPlan: string) => {
    // TODO: 実際のプラン変更処理を実装
    console.log('Changing plan for company:', company.company_name, 'from', company.contract_plan?.plan_name, 'to', newPlan);

    // プラン変更確認モーダルを閉じて、完了モーダルを表示
    setNewSelectedPlan(newPlan);
    setPlanChangeModalOpen(false);
    setPlanChangeCompleteModalOpen(true);
  };

  const handlePlanChangeCancel = () => {
    setPlanChangeModalOpen(false);
  };

  const handlePlanChangeCompleteClose = () => {
    setPlanChangeCompleteModalOpen(false);
    setNewSelectedPlan('');
    // 完了後に現在のページに留まる（企業詳細ページ）
  };

  const handleScoutLimitChangeClick = () => {
    setScoutLimitChangeModalOpen(true);
  };

  const handleScoutLimitChangeConfirm = (newLimit: number) => {
    // TODO: 実際のスカウト上限数変更処理を実装
    console.log('Changing scout limit for company:', company.company_name, 'to', newLimit);

    // スカウト上限数変更確認モーダルを閉じて、完了モーダルを表示
    setNewSelectedScoutLimit(newLimit);
    setScoutLimitChangeModalOpen(false);
    setScoutLimitChangeCompleteModalOpen(true);
  };

  const handleScoutLimitChangeCancel = () => {
    setScoutLimitChangeModalOpen(false);
  };

  const handleScoutLimitChangeCompleteClose = () => {
    setScoutLimitChangeCompleteModalOpen(false);
    setNewSelectedScoutLimit(0);
    // 完了後に現在のページに留まる（企業詳細ページ）
  };

  return (
    <div className="bg-white min-h-screen">
      {/* ヘッダーボタン */}
      <div className="flex justify-end gap-4 p-6 pb-0">
        <button
          onClick={handleEdit}
          className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          企業情報を編集
        </button>
        <button
          onClick={handleDelete}
          className="px-8 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
        >
          企業を削除
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        
        {/* プラン情報 */}
        <div className="flex items-center gap-6 py-3">
          <label className="block text-base font-bold text-black w-40">プラン</label>
          <div className="text-base text-black">
            {company.contract_plan?.plan_name || 'プラン名が入ります'}
          </div>
        </div>

        <hr className="border-gray-300" />

        {/* 企業分析セクション */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-black">企業分析</h2>
          
          {/* 分析テーブル */}
          <div className="border border-gray-300 rounded">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300"></th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300">スカウト送信数</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300">開封数（開封率）</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black border-r border-gray-300">返信数（返信率）</th>
                  <th className="px-3 py-2 text-left text-xs font-semibold text-black">応募数（応募率）</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-300">
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">過去7日合計</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black">0</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">過去30日間合計</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black">0</td>
                </tr>
                <tr className="border-t border-gray-300">
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">累計</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black border-r border-gray-300">0</td>
                  <td className="px-3 py-2 text-xs text-black">0</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 運営メモ */}
          <div className="mt-8">
            <label className="block text-base font-bold text-black mb-2">運営メモ</label>
            <textarea
              value={memoText}
              onChange={(e) => setMemoText(e.target.value)}
              className="w-full h-32 p-3 border border-gray-300 rounded resize-none text-sm text-gray-600"
              placeholder="自由にメモを記入できます。同一グループ内の方が閲覧可能です。"
            />
          </div>
        </div>

        <hr className="border-black border-t-2" />

        {/* 企業情報セクション */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-black">企業情報</h2>
          
          {/* 企業ID */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">企業ID</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.id}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 企業名 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">企業名</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.company_name}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* URL */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">URL</label>
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-4">
                <div className="text-base text-black">タイトルテキストが入ります</div>
                <div className="text-base text-black">https://---------</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-base text-black">タイトルテキストが入ります</div>
                <div className="text-base text-black">https://---------</div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* アイコン画像 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">アイコン画像</label>
            <div className="w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm font-bold text-white">画像を</div>
                <div className="text-sm font-bold text-white">変更</div>
              </div>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 代表者 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">代表者</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.representative_name || '山田 太郎'}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 設立 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">設立</label>
            <div className="flex items-center gap-2">
              <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
                2020
              </div>
              <span className="text-base text-black">年</span>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 資本金 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">資本金</label>
            <div className="flex items-center gap-2">
              <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
                100
              </div>
              <span className="text-base text-black">万円</span>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 従業員数 */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">従業員数</label>
            <div className="flex items-center gap-2">
              <div className="w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center">
                500
              </div>
              <span className="text-base text-black">人</span>
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 業種 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">業種</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              テキストが入ります。
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 事業内容 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">事業内容</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap">
              テキストが入ります。
              テキストが入ります。
              テキストが入ります。
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 所在地 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">所在地</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap">
              東京都
              千代田区〜〜〜〜〜〜
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 企業フェーズ */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">企業フェーズ</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              上場企業
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* イメージ画像 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">イメージ画像</label>
            <div className="flex gap-4">
              {[0, 1, 2].map(index => (
                <div key={index} className="w-48 h-32 bg-gray-400 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">画像を</div>
                    <div className="text-sm font-bold text-white">変更</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-gray-300" />

          {/* 企業の魅力 */}
          <div className="flex items-start gap-6 py-3">
            <label className="block text-base font-bold text-black w-40 mt-2">企業の魅力</label>
            <div className="flex-1 space-y-6">
              {[0, 1, 2].map(index => (
                <div key={index} className="space-y-4">
                  <div className="text-xl font-bold text-black">
                    企業の魅力テキストが入ります
                  </div>
                  <div className="text-base text-black">
                    企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。企業の魅力説明テキストが入ります。
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <hr className="border-black border-t-2" />

        {/* 企業グループセクション */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-black">企業グループ</h2>
            <button
              onClick={handleNewGroupClick}
              className="px-6 py-3 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition-colors"
            >
              新規グループ追加
            </button>
          </div>

          {/* グループ1 */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">グループ名テキスト</h3>
              <div className="flex gap-6">
                <button
                  onClick={() => handleAddMemberClick('group-1', 'グループ名テキスト')}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  メンバー追加
                </button>
                <button
                  onClick={() => handleGroupNameChangeClick('group-1', 'グループ名テキスト')}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  グループ名編集
                </button>
                <button 
                  onClick={() => {
                    if (confirm('本当にこのグループを削除しますか？')) {
                      // TODO: 実際のグループ削除処理を実装
                      console.log('Deleting group');
                      // グループ削除完了ページに遷移
                      router.push('/admin/company/group');
                    }
                  }}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  グループを削除
                </button>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* メンバーリスト */}
            <div className="space-y-4">
              {['管理者', '管理者', 'スカウト担当者', 'スカウト担当者', ''].map((role, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-2">
                    <div className="text-base font-bold">名前 名前</div>
                                          <div className="flex items-center gap-4">
                      {role && (
                        <select
                          value={role}
                          onChange={(e) => {
                            if (e.target.value !== role) {
                              handleRoleChangeClick('名前 名前', `user-${index}`, role, e.target.value);
                            }
                          }}
                          className="text-base font-bold bg-transparent border-none outline-none cursor-pointer appearance-none pr-6 bg-right bg-no-repeat"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundSize: '1.5rem 1.5rem'
                          }}
                        >
                          <option value="管理者">管理者</option>
                          <option value="スカウト担当者">スカウト担当者</option>
                        </select>
                      )}
                      <button
                        onClick={() => handleUserDeleteClick('名前 名前', `user-${index}`)}
                        className="text-base font-bold text-black hover:text-gray-600"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  {index < 4 && <hr className="border-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* グループ2（同様の構造） */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">グループ名テキスト</h3>
              <div className="flex gap-6">
                <button
                  onClick={() => handleAddMemberClick('group-2', 'グループ名テキスト')}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  メンバー追加
                </button>
                <button
                  onClick={() => handleGroupNameChangeClick('group-2', 'グループ名テキスト')}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  グループ名編集
                </button>
                <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
                  グループを削除
                </button>
              </div>
            </div>

            <hr className="border-gray-300" />

            {/* メンバーリスト */}
            <div className="space-y-4">
              {['管理者', '管理者', 'スカウト担当者', 'スカウト担当者', ''].map((role, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center py-2">
                    <div className="text-base font-bold">名前 名前</div>
                                          <div className="flex items-center gap-4">
                      {role && (
                        <select
                          value={role}
                          onChange={(e) => {
                            if (e.target.value !== role) {
                              handleRoleChangeClick('名前 名前', `user-${index}`, role, e.target.value);
                            }
                          }}
                          className="text-base font-bold bg-transparent border-none outline-none cursor-pointer appearance-none pr-6 bg-right bg-no-repeat"
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23000' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundSize: '1.5rem 1.5rem'
                          }}
                        >
                          <option value="管理者">管理者</option>
                          <option value="スカウト担当者">スカウト担当者</option>
                        </select>
                      )}
                      <button
                        onClick={() => handleUserDeleteClick('名前 名前', `user-${index}`)}
                        className="text-base font-bold text-black hover:text-gray-600"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  {index < 4 && <hr className="border-gray-300" />}
                </div>
              ))}
            </div>
          </div>

          {/* グループチケットログ1 */}
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black text-center mb-6">グループチケットログ</h3>
            
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-20"></div>
                <div className="text-right">
                  <div className="text-base">グループ内月次消化枚数</div>
                  <div className="text-2xl font-bold">100枚</div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン群 */}
          <div className="flex gap-6 justify-center">
            <button
              onClick={handleScoutLimitChangeClick}
              className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              スカウト上限数変更
            </button>
            <button
              onClick={handlePlanChangeClick}
              className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              プラン変更
            </button>
            <button className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors">
              休会
            </button>
            <button
              onClick={handleWithdrawalClick}
              className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              休会
            </button>
          </div>

          {/* チケット管理セクション */}
          <div className="bg-gray-700 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold text-center mb-6">チケット管理</h3>
            
            <div className="bg-white rounded-lg p-6 text-black space-y-4">
              <div className="space-y-2">
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-24"></div>
                <div className="text-right">
                  <div className="text-base">現在の残チケット枚数</div>
                  <div className="text-2xl font-bold">100枚</div>
                </div>
              </div>
              
              <div className="text-sm text-red-500 text-center">
                期間は6ヶ月分をログとして記載する
              </div>
            </div>
          </div>

          {/* グループチケットログ2 */}
          <div className="bg-gray-300 rounded-lg p-6">
            <h3 className="text-xl font-bold text-black text-center mb-6">グループチケットログ</h3>
            
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="space-y-2">
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
                <div className="text-base">yyyy/mm/dd：ログ表示テキストが入ります</div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-20"></div>
                <div className="text-right">
                  <div className="text-base">グループ内月次消化枚数</div>
                  <div className="text-2xl font-bold">100枚</div>
                </div>
              </div>
              
              <div className="text-sm text-red-500 text-center">
                期間は6ヶ月分をログとして記載する
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 企業ユーザー削除確認モーダル */}
      <CompanyUserDeleteModal
        isOpen={deleteModalOpen}
        onClose={handleUserDeleteCancel}
        onConfirm={handleUserDeleteConfirm}
        userName={selectedUser?.name || ''}
      />

      {/* 新規グループ追加モーダル */}
      <NewGroupModal
        isOpen={newGroupModalOpen}
        onClose={handleNewGroupCancel}
        onConfirm={handleNewGroupConfirm}
      />

      {/* 企業ユーザー権限変更確認モーダル */}
      <CompanyUserRoleChangeModal
        isOpen={roleChangeModalOpen}
        onClose={handleRoleChangeCancel}
        onConfirm={handleRoleChangeConfirm}
        userName={roleChangeData?.userName || ''}
        currentRole={roleChangeData?.currentRole || ''}
        newRole={roleChangeData?.newRole || ''}
      />

      {/* 企業グループ名変更モーダル */}
      <CompanyGroupNameChangeModal
        isOpen={groupNameChangeModalOpen}
        onClose={handleGroupNameChangeCancel}
        onConfirm={handleGroupNameChangeConfirm}
        currentGroupName={selectedGroupData?.currentName || ''}
      />

      {/* メンバー追加モーダル */}
      <AddMemberModal
        isOpen={addMemberModalOpen}
        onClose={handleAddMemberCancel}
        onConfirm={handleAddMemberConfirm}
        groupName={selectedGroupForMember?.groupName || ''}
      />

      {/* 招待完了モーダル */}
      <InvitationCompleteModal
        isOpen={invitationCompleteModalOpen}
        onClose={handleInvitationCompleteClose}
        invitedMembersCount={invitedMembersCount}
      />

      {/* 休会確認モーダル */}
      <CompanyWithdrawalConfirmModal
        isOpen={withdrawalConfirmModalOpen}
        onClose={handleWithdrawalCancel}
        onConfirm={handleWithdrawalConfirm}
        companyName={company.company_name}
      />

      {/* 休会完了モーダル */}
      <CompanyWithdrawalCompleteModal
        isOpen={withdrawalCompleteModalOpen}
        onClose={handleWithdrawalCompleteClose}
        companyName={company.company_name}
      />

      {/* プラン変更モーダル */}
      <CompanyPlanChangeModal
        isOpen={planChangeModalOpen}
        onClose={handlePlanChangeCancel}
        onConfirm={handlePlanChangeConfirm}
        currentPlan={company.contract_plan?.plan_name || ''}
      />

      {/* プラン変更完了モーダル */}
      <CompanyPlanChangeCompleteModal
        isOpen={planChangeCompleteModalOpen}
        onClose={handlePlanChangeCompleteClose}
        companyName={company.company_name}
        newPlan={newSelectedPlan}
      />

      {/* スカウト上限数変更モーダル */}
      <CompanyScoutLimitChangeModal
        isOpen={scoutLimitChangeModalOpen}
        onClose={handleScoutLimitChangeCancel}
        onConfirm={handleScoutLimitChangeConfirm}
        currentLimit={company.contract_plan?.max_job_postings || 10}
      />

      {/* スカウト上限数変更完了モーダル */}
      <CompanyScoutLimitChangeCompleteModal
        isOpen={scoutLimitChangeCompleteModalOpen}
        onClose={handleScoutLimitChangeCompleteClose}
        companyName={company.company_name}
        newLimit={newSelectedScoutLimit}
      />
    </div>
  );
}