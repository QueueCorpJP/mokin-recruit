'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEditData } from './edit/page';
import CompanyUserDeleteModal from '@/components/admin/CompanyUserDeleteModal';
import {
  updateCompanyPlan,
  updateCompanyScoutLimit,
  suspendCompany,
  deleteCompany,
  updateGroupName,
  deleteGroup,
  inviteMembersToGroup,
  createNewGroup,
  updateUserRole,
  deleteUserFromGroup,
  getCompanyTickets,
  purchaseTickets
} from './actions';
import NewGroupModal from '@/components/admin/NewGroupModal';
import CompanyUserRoleChangeModal from '@/components/admin/CompanyUserRoleChangeModal';
import CompanyGroupNameChangeModal from '@/components/admin/CompanyGroupNameChangeModal';
import CompanyGroupNameChangeCompleteModal from '@/components/admin/CompanyGroupNameChangeCompleteModal';
import AddMemberModal from '@/components/admin/AddMemberModal';
import InvitationCompleteModal from '@/components/admin/InvitationCompleteModal';
import CompanyScoutLimitChangeModal from '@/components/admin/CompanyScoutLimitChangeModal';
import CompanyScoutLimitChangeCompleteModal from '@/components/admin/CompanyScoutLimitChangeCompleteModal';
import CompanyPlanChangeModal from '@/components/admin/CompanyPlanChangeModal';
import CompanyPlanChangeCompleteModal from '@/components/admin/CompanyPlanChangeCompleteModal';
import CompanyWithdrawalConfirmModal from '@/components/admin/CompanyWithdrawalConfirmModal';
import CompanyWithdrawalCompleteModal from '@/components/admin/CompanyWithdrawalCompleteModal';
import CompanyDeletionConfirmModal from '@/components/admin/CompanyDeletionConfirmModal';
import CompanyDeletionCompleteModal from '@/components/admin/CompanyDeletionCompleteModal';

interface CompanyDetailClientProps {
  company: CompanyEditData;
  onUserDeleteComplete?: () => void;
}

export default function CompanyDetailClient({ company, onUserDeleteComplete }: CompanyDetailClientProps) {
  const router = useRouter();

  // デバッグ用: コンポーネントがマウントされたときの情報をログ出力
  useEffect(() => {
    console.log(`[Company Detail Client] Company: ${company.company_name}, Plan: ${company.plan}`);
    console.log(`[Company Detail Client] Groups:`, company.company_groups?.map(g => `${g.group_name} (${g.id})`) || []);

    // グループメンバーの詳細情報を出力
    company.company_groups?.forEach(group => {
      console.log(`[Company Detail Client] Group "${group.group_name}" members:`, {
        permissionsCount: group.company_user_group_permissions?.length || 0,
        permissions: group.company_user_group_permissions?.map(perm => ({
          id: perm.id,
          level: perm.permission_level,
          user: perm.company_users ? {
            id: perm.company_users.id,
            name: perm.company_users.full_name,
            email: perm.company_users.email
          } : 'USER_DATA_MISSING'
        })) || []
      });
    });
  }, [company.company_name, company.plan, company.company_groups]);

  // チケット情報を取得
  useEffect(() => {
    const fetchTicketData = async () => {
      if (!company.id) return;

      setTicketLoading(true);
      try {
        const result = await getCompanyTickets(company.id);
        if (result.success) {
          setTicketData(result.data);
        } else {
          console.error('Failed to fetch ticket data:', result.error);
        }
      } catch (error) {
        console.error('Error fetching ticket data:', error);
      } finally {
        setTicketLoading(false);
      }
    };

    fetchTicketData();
  }, [company.id]);

  const [memoText, setMemoText] = useState('自由にメモを記入できます。\n同一グループ内の方が閲覧可能です。');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{name: string, id: string, groupId: string} | null>(null);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState<{
    userName: string;
    userId: string;
    groupId: string;
    currentRole: string;
    newRole: string;
  } | null>(null);

  // チケット管理用のstate
  const [ticketData, setTicketData] = useState<{
    tickets: {
      total_tickets: number;
      used_tickets: number;
      remaining_tickets: number;
    };
    transactions: Array<{
      id: string;
      transaction_type: string;
      amount: number;
      description: string;
      created_at: string;
    }>;
  } | null>(null);
  const [ticketLoading, setTicketLoading] = useState(false);
  const [ticketPurchaseModalOpen, setTicketPurchaseModalOpen] = useState(false);
  const [groupNameChangeModalOpen, setGroupNameChangeModalOpen] = useState(false);
  const [groupNameChangeCompleteModalOpen, setGroupNameChangeCompleteModalOpen] = useState(false);
  const [selectedGroupData, setSelectedGroupData] = useState<{
    groupId: string;
    currentName: string;
  } | null>(null);
  const [updatedGroupName, setUpdatedGroupName] = useState('');
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [selectedGroupForMember, setSelectedGroupForMember] = useState<{
    groupId: string;
    groupName: string;
  } | null>(null);
  const [invitationCompleteModalOpen, setInvitationCompleteModalOpen] = useState(false);
  const [invitedMembersCount, setInvitedMembersCount] = useState(0);
  const [invitedMembers, setInvitedMembers] = useState<any[]>([]);
  const [withdrawalConfirmModalOpen, setWithdrawalConfirmModalOpen] = useState(false);
  const [withdrawalCompleteModalOpen, setWithdrawalCompleteModalOpen] = useState(false);
  const [planChangeModalOpen, setPlanChangeModalOpen] = useState(false);
  const [planChangeCompleteModalOpen, setPlanChangeCompleteModalOpen] = useState(false);
  const [newSelectedPlan, setNewSelectedPlan] = useState('');
  const [scoutLimitChangeModalOpen, setScoutLimitChangeModalOpen] = useState(false);
  const [scoutLimitChangeCompleteModalOpen, setScoutLimitChangeCompleteModalOpen] = useState(false);
  const [newSelectedScoutLimit, setNewSelectedScoutLimit] = useState(0);
  const [deletionConfirmModalOpen, setDeletionConfirmModalOpen] = useState(false);
  const [deletionCompleteModalOpen, setDeletionCompleteModalOpen] = useState(false);

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

  const handleUserDeleteClick = (userName: string, userId: string, groupId: string) => {
    setSelectedUser({ name: userName, id: userId, groupId });
    setDeleteModalOpen(true);
  };

  const handleUserDeleteConfirm = async () => {
    if (selectedUser) {
      try {
        console.log('Deleting user:', selectedUser.id, selectedUser.name, 'from group:', selectedUser.groupId);

        // 実際の企業ユーザー削除処理を実行
        const result = await deleteUserFromGroup(selectedUser.id, selectedUser.groupId);

        if (result.success) {
          console.log('User deleted successfully');
          setDeleteModalOpen(false);
          setSelectedUser(null);

          // デバッグページ用のコールバックがある場合はそれを実行
          if (onUserDeleteComplete) {
            onUserDeleteComplete();
          } else {
            // メンバーを削除した後にユーザー削除完了ページに遷移
            // 企業IDをクエリパラメータとして渡す
            router.push(`/admin/company/user?companyId=${company.id}&userName=${encodeURIComponent(selectedUser.name)}`);

            // 少し遅延してからページをリロードして最新データを反映
            setTimeout(() => {
              window.location.reload();
            }, 1000);
          }
        } else {
          console.error('User deletion failed:', result.error);
          alert(`ユーザーの削除に失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('User deletion error:', error);
        alert('ユーザー削除中にエラーが発生しました');
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

  const handleNewGroupConfirm = async (groupName: string, members: any[]) => {
    try {
    console.log('Creating new group:', groupName, 'with members:', members);

      const result = await createNewGroup(company.id, groupName, members);

      if (result.success) {
        console.log('New group created successfully:', result.group);
        alert(result.message || `グループ「${groupName}」を作成しました`);
    setNewGroupModalOpen(false);
      } else {
        console.error('New group creation failed:', result.error);
        alert(`グループの作成に失敗しました: ${result.error}`);
        setNewGroupModalOpen(false);
      }
    } catch (error) {
      console.error('New group creation error:', error);
      alert('グループ作成中にエラーが発生しました');
      setNewGroupModalOpen(false);
    }
  };

  const handleNewGroupCancel = () => {
    setNewGroupModalOpen(false);
  };

  const handleRoleChangeClick = (userName: string, userId: string, groupId: string, currentRole: string, newRole: string) => {
    setRoleChangeData({
      userName,
      userId,
      groupId,
      currentRole,
      newRole,
    });
    setRoleChangeModalOpen(true);
  };

  const handleRoleChangeConfirm = async () => {
    if (roleChangeData) {
      try {
        // データベース権限値への変換
        const dbRoleMap: { [key: string]: string } = {
          '管理者': 'ADMINISTRATOR',
          'スカウト担当者': 'SCOUT_STAFF'
        };

        const dbNewRole = dbRoleMap[roleChangeData.newRole] || roleChangeData.newRole;

        console.log('Changing role for user:', roleChangeData.userId, 'to', dbNewRole);
        const result = await updateUserRole(roleChangeData.userId, roleChangeData.groupId, dbNewRole);

        if (result.success) {
          console.log('User role updated successfully:', result.updatedPermission);
          alert(`${roleChangeData.userName}さんの権限を${roleChangeData.newRole}に変更しました`);
          setRoleChangeModalOpen(false);
          setRoleChangeData(null);
          // 権限変更後にページをリロードして最新データを反映
          window.location.reload();
        } else {
          console.error('User role update failed:', result.error);
          alert(`権限の変更に失敗しました: ${result.error}`);
        }
      } catch (error) {
        console.error('Role change error:', error);
        alert('権限変更中にエラーが発生しました');
      }
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

  const handleGroupNameChangeConfirm = async (newGroupName: string) => {
    if (selectedGroupData) {
      try {
        const result = await updateGroupName(selectedGroupData.groupId, newGroupName);

        if (result.success) {
          console.log('Group name updated successfully:', result.updatedGroup);
          console.log(`Group name changed: ${selectedGroupData?.currentName} → ${newGroupName}`);
          // 成功したら完了モーダルを表示
          setUpdatedGroupName(newGroupName);
          setGroupNameChangeModalOpen(false);
          setGroupNameChangeCompleteModalOpen(true);
        } else {
          console.error('Group name update failed:', result.error);
          alert(`グループ名の変更に失敗しました: ${result.error}`);
      setGroupNameChangeModalOpen(false);
      setSelectedGroupData(null);
        }
      } catch (error) {
        console.error('Group name change error:', error);
        alert('グループ名変更中にエラーが発生しました');
        setGroupNameChangeModalOpen(false);
        setSelectedGroupData(null);
      }
    }
  };

  const handleGroupNameChangeCancel = () => {
    setGroupNameChangeModalOpen(false);
    setSelectedGroupData(null);
  };

  const handleGroupNameChangeCompleteClose = () => {
    setGroupNameChangeCompleteModalOpen(false);
    setSelectedGroupData(null);
    setUpdatedGroupName('');
    // 完了モーダルのクローズ処理のみ - リロードはモーダルのボタンで実行
  };

  const handleAddMemberClick = (groupId: string, groupName: string) => {
    setSelectedGroupForMember({
      groupId,
      groupName,
    });
    setAddMemberModalOpen(true);
  };

  const handleAddMemberConfirm = async (members: any[]) => {
    if (selectedGroupForMember) {
      try {
        console.log('Inviting members to group:', selectedGroupForMember.groupId, 'members:', members);

        const result = await inviteMembersToGroup(selectedGroupForMember.groupId, members);

        if (result.success) {
          console.log('Members invited successfully:', result.invitedMembers);

      // 招待完了モーダルを開く
          setInvitedMembers(result.invitedMembers || []);
          setInvitedMembersCount(result.invitedMembers?.length || 0);
      setAddMemberModalOpen(false);
      setInvitationCompleteModalOpen(true);
        } else {
          console.error('Member invitation failed:', result.error);
          alert(`メンバー招待に失敗しました: ${result.error}`);
          setAddMemberModalOpen(false);
          setSelectedGroupForMember(null);
        }
      } catch (error) {
        console.error('Member invitation error:', error);
        alert('メンバー招待中にエラーが発生しました');
        setAddMemberModalOpen(false);
        setSelectedGroupForMember(null);
      }
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
    setInvitedMembers([]);
    // メンバーを追加した後にページをリロードして最新データを反映
    window.location.reload();
  };

  const handleWithdrawalClick = () => {
    setWithdrawalConfirmModalOpen(true);
  };

  const handleWithdrawalConfirm = async () => {
    try {
      const result = await suspendCompany(company.id);

      if (result.success) {
        console.log('Company suspended successfully:', result.company);
        console.log(`Company ${company.company_name} suspended with status: ${result.company.status}`);
    // 休会確認モーダルを閉じて、完了モーダルを表示
    setWithdrawalConfirmModalOpen(false);
    setWithdrawalCompleteModalOpen(true);
      } else {
        console.error('Company suspension failed:', result.error);
        alert(`休会処理に失敗しました: ${result.error}`);
        setWithdrawalConfirmModalOpen(false);
      }
    } catch (error) {
      console.error('Suspension error:', error);
      alert('休会処理中にエラーが発生しました');
      setWithdrawalConfirmModalOpen(false);
    }
  };

  const handleWithdrawalCancel = () => {
    setWithdrawalConfirmModalOpen(false);
  };

  const handleWithdrawalCompleteClose = () => {
    setWithdrawalCompleteModalOpen(false);
    // 休会完了モーダルのクローズ処理のみ - ページ遷移はモーダル内のボタンで行う
  };

  const handlePlanChangeClick = () => {
    setPlanChangeModalOpen(true);
  };

  const handlePlanChangeConfirm = async (newPlan: string) => {
    try {
      const result = await updateCompanyPlan(company.id, newPlan);

      if (result.success) {
        console.log('Company plan updated successfully:', result.company);
    // プラン変更確認モーダルを閉じて、完了モーダルを表示
    setNewSelectedPlan(newPlan);
    setPlanChangeModalOpen(false);
    setPlanChangeCompleteModalOpen(true);
      } else {
        console.error('Company plan update failed:', result.error);
        alert(`プラン変更に失敗しました: ${result.error}`);
        setPlanChangeModalOpen(false);
      }
    } catch (error) {
      console.error('Plan change error:', error);
      alert('プラン変更中にエラーが発生しました');
      setPlanChangeModalOpen(false);
    }
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

  const handleScoutLimitChangeConfirm = async (newLimit: number) => {
    try {
      const result = await updateCompanyScoutLimit(company.id, newLimit);

      if (result.success) {
        console.log('Company scout limit updated successfully:', result.company);
    // スカウト上限数変更確認モーダルを閉じて、完了モーダルを表示
    setNewSelectedScoutLimit(newLimit);
    setScoutLimitChangeModalOpen(false);
    setScoutLimitChangeCompleteModalOpen(true);
      } else {
        console.error('Company scout limit update failed:', result.error);
        alert(`スカウト上限数変更に失敗しました: ${result.error}`);
        setScoutLimitChangeModalOpen(false);
      }
    } catch (error) {
      console.error('Scout limit change error:', error);
      alert('スカウト上限数変更中にエラーが発生しました');
      setScoutLimitChangeModalOpen(false);
    }
  };

  const handleScoutLimitChangeCancel = () => {
    setScoutLimitChangeModalOpen(false);
  };

  const handleScoutLimitChangeCompleteClose = () => {
    setScoutLimitChangeCompleteModalOpen(false);
    setNewSelectedScoutLimit(0);
    // 完了後に現在のページに留まる（企業詳細ページ）
  };

  const handleDeletionClick = () => {
    setDeletionConfirmModalOpen(true);
  };

  const handleDeletionConfirm = async () => {
    try {
      const result = await deleteCompany(company.id);

      if (result.success) {
        console.log('Company physically deleted successfully:', result.deletedCompany);
        // 退会確認モーダルを閉じて、完了モーダルを表示
        setDeletionConfirmModalOpen(false);
        setDeletionCompleteModalOpen(true);
      } else {
        console.error('Company deletion failed:', result.error);
        alert(`退会処理に失敗しました: ${result.error}`);
        setDeletionConfirmModalOpen(false);
      }
    } catch (error) {
      console.error('Deletion error:', error);
      alert('退会処理中にエラーが発生しました');
      setDeletionConfirmModalOpen(false);
    }
  };

  const handleDeletionCancel = () => {
    setDeletionConfirmModalOpen(false);
  };

  const handleDeletionCompleteClose = () => {
    setDeletionCompleteModalOpen(false);
    // モーダルを閉じるのみ - ページ遷移はモーダル内のボタンで行う
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

          {/* プラン */}
          <div className="flex items-center gap-6 py-3">
            <label className="block text-base font-bold text-black w-40">プラン</label>
            <div className="flex-1 px-3 py-3 bg-white border border-gray-300 text-base">
              {company.plan || 'プラン名が入ります'}
            </div>
          </div>

          <hr className="border-gray-300" />
          
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

          {/* グループリスト */}
          {company.company_groups && company.company_groups.length > 0 ? (
            company.company_groups.map((group, index) => (
              <div key={group.id} className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-black">{group.group_name}</h3>
              <div className="flex gap-6">
                <button
                      onClick={() => handleAddMemberClick(group.id, group.group_name)}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  メンバー追加
                </button>
                <button
                      onClick={() => handleGroupNameChangeClick(group.id, group.group_name)}
                  className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
                >
                  グループ名編集
                </button>
                <button 
                      onClick={async () => {
                        if (confirm('本当にこのグループを削除しますか？\nこの操作は取り消すことができません。')) {
                          try {
                            const result = await deleteGroup(group.id);

                            if (result.success) {
                              console.log('Group deleted successfully:', result.deletedGroup);
                              alert(`グループ「${group.group_name}」を削除しました`);

                              // 削除成功後に /admin/company/delete に遷移
                              router.push('/admin/company/delete');
                            } else {
                              console.error('Group deletion failed:', result.error);
                              alert(`グループの削除に失敗しました: ${result.error}`);
                            }
                          } catch (error) {
                            console.error('Group deletion error:', error);
                            alert('グループ削除中にエラーが発生しました');
                          }
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
                  {group.company_user_group_permissions && group.company_user_group_permissions.length > 0 ? (
                    group.company_user_group_permissions.map((permission, permissionIndex) => {
                      // UI表示用の権限名への変換
                      const uiRoleMap: { [key: string]: string } = {
                        'ADMINISTRATOR': '管理者',
                        'ADMIN': '管理者',
                        'SCOUT_STAFF': 'スカウト担当者'
                      };

                      const currentUIRole = uiRoleMap[permission.permission_level] || permission.permission_level;
                      const user = permission.company_users;

                      if (!user) return null;

                      return (
                        <div key={permission.id}>
                          <div className="flex justify-between items-center py-2">
                            <div className="text-base font-bold">{user.full_name}</div>
                            <div className="flex items-center gap-4">
                              <select
                                value={currentUIRole}
                                onChange={(e) => {
                                  if (e.target.value !== currentUIRole) {
                                    handleRoleChangeClick(user.full_name, user.id, group.id, currentUIRole, e.target.value);
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
                              <button
                                onClick={() => handleUserDeleteClick(user.full_name, user.id, group.id)}
                                className="text-base font-bold text-black hover:text-gray-600"
                              >
                                削除
                              </button>
                            </div>
                          </div>
                          {permissionIndex < group.company_user_group_permissions.length - 1 && <hr className="border-gray-300" />}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      このグループにはメンバーがいません
                    </div>
                  )}
            </div>
          </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <p className="text-center text-gray-500">グループがありません</p>
            </div>
          )}

          {/* グループチケットログ */}
          {company.company_groups && company.company_groups.length > 0 && (
            <div className="bg-gray-300 rounded-lg p-6">
              <h3 className="text-xl font-bold text-black text-center mb-6">グループチケットログ</h3>

              <div className="space-y-6">
                {company.company_groups.map((group, groupIndex) => {
                  const ticketData = company.groupTicketData?.[group.id];
                  const messageCount = ticketData?.messageCount || 0;
                  const applicationCount = ticketData?.applicationCount || 0;
                  const totalTickets = messageCount + applicationCount;

                  return (
                    <div key={group.id} className="bg-white rounded-lg p-6 space-y-4">
                      <h4 className="text-lg font-bold text-black mb-4">{group.group_name}</h4>

                      <div className="space-y-2">
                        <div className="text-base">メッセージ送信数: {messageCount}件</div>
                        <div className="text-base">応募数: {applicationCount}件</div>
                        <div className="text-base">総消費チケット数: {totalTickets}枚</div>
                        <div className="text-base">最終更新: {new Date(group.updated_at).toLocaleDateString('ja-JP')}</div>
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="border-l border-gray-300 h-20"></div>
                        <div className="text-right">
                          <div className="text-base">グループ内月次消化枚数</div>
                          <div className="text-2xl font-bold">{totalTickets}枚</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

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
            <button
              onClick={handleWithdrawalClick}
              className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              休会
            </button>
            <button
              onClick={handleDeletionClick}
              className="px-6 py-3 border border-black rounded-full font-bold hover:bg-gray-50 transition-colors"
            >
              退会
            </button>
          </div>

          {/* チケット管理セクション */}
          <div className="bg-gray-700 rounded-lg p-6 text-white">
            <h3 className="text-xl font-bold text-center mb-6">チケット管理</h3>

            <div className="bg-white rounded-lg p-6 text-black space-y-4">
              {/* 取引履歴 */}
              <div className="space-y-2">
                {ticketLoading ? (
                  <div className="text-center py-4">読み込み中...</div>
                ) : ticketData?.transactions && ticketData.transactions.length > 0 ? (
                  ticketData.transactions.map((transaction) => (
                    <div key={transaction.id} className="text-base">
                      {new Date(transaction.created_at).toLocaleDateString('ja-JP')}：
                      {transaction.description}
                      {transaction.amount > 0 ? (
                        <span className="text-green-600 font-semibold"> (+{transaction.amount})</span>
                      ) : (
                        <span className="text-red-600 font-semibold"> ({transaction.amount})</span>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-base text-gray-500">取引履歴がありません</div>
                )}
              </div>

              {/* 残チケット数 */}
              <div className="flex justify-between items-center">
                <div className="border-l border-gray-300 h-24"></div>
                <div className="text-right">
                  <div className="text-base">現在の残チケット枚数</div>
                  <div className="text-2xl font-bold">
                    {ticketData?.tickets.remaining_tickets ?? 0}枚
                  </div>
                  <div className="text-sm text-gray-600">
                    総購入: {ticketData?.tickets.total_tickets ?? 0}枚 /
                    使用済: {ticketData?.tickets.used_tickets ?? 0}枚
                  </div>
                </div>
              </div>

              {/* チケット購入ボタン */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={() => setTicketPurchaseModalOpen(true)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors"
                >
                  チケットを購入
                </button>
              </div>

              <div className="text-sm text-gray-500 text-center">
                直近6ヶ月分の取引履歴を表示しています
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

      {/* チケット購入モーダル */}
      {ticketPurchaseModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-[90vw]">
            <h3 className="text-xl font-bold text-center mb-6">チケット購入</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  購入枚数
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue="10"
                >
                  <option value="10">10枚</option>
                  <option value="20">20枚</option>
                  <option value="50">50枚</option>
                  <option value="100">100枚</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={() => setTicketPurchaseModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={async () => {
                    const selectElement = document.querySelector('select') as HTMLSelectElement;
                    const amount = parseInt(selectElement?.value || '10');

                    try {
                      const result = await purchaseTickets(company.id, amount, `${amount}枚のチケットを購入`);
                      if (result.success) {
                        alert(`${amount}枚のチケットを購入しました！`);
                        setTicketPurchaseModalOpen(false);
                        // チケット情報を再取得
                        const ticketResult = await getCompanyTickets(company.id);
                        if (ticketResult.success) {
                          setTicketData(ticketResult.data);
                        }
                      } else {
                        alert(`チケット購入に失敗しました: ${result.error}`);
                      }
                    } catch (error) {
                      console.error('チケット購入エラー:', error);
                      alert('チケット購入中にエラーが発生しました');
                    }
                  }}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  購入する
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* 企業グループ名変更完了モーダル */}
      <CompanyGroupNameChangeCompleteModal
        isOpen={groupNameChangeCompleteModalOpen}
        onClose={handleGroupNameChangeCompleteClose}
        oldGroupName={selectedGroupData?.currentName || ''}
        newGroupName={updatedGroupName}
        companyId={company.id}
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
        invitedMembers={invitedMembers}
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
        companyId={company.id}
      />

      {/* 退会確認モーダル */}
      <CompanyDeletionConfirmModal
        isOpen={deletionConfirmModalOpen}
        onClose={handleDeletionCancel}
        onConfirm={handleDeletionConfirm}
        companyName={company.company_name}
      />

      {/* 退会完了モーダル */}
      <CompanyDeletionCompleteModal
        isOpen={deletionCompleteModalOpen}
        onClose={handleDeletionCompleteClose}
        companyName={company.company_name}
      />

      {/* プラン変更モーダル */}
      <CompanyPlanChangeModal
        isOpen={planChangeModalOpen}
        onClose={handlePlanChangeCancel}
        onConfirm={handlePlanChangeConfirm}
        currentPlan={company.plan || ''}
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