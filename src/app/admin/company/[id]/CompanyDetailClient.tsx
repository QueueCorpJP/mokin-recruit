'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { CompanyEditData } from './edit/page';
import type { CompanyAnalyticsData } from './page';
import { AdminButton } from '@/components/admin/ui/AdminButton';
import { ActionButton } from '@/components/admin/ui/ActionButton';
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

// プランの日本語表示名を取得
const getPlanDisplayName = (plan: string): string => {
  switch (plan) {
    case 'none':
      return 'プラン加入なし';
    case 'standard':
      return 'スタンダード';
    case 'strategic':
      return 'ストラテジック';
    default:
      return plan;
  }
};

// 権限の日本語表示名を取得
const getPermissionDisplayName = (permission: string): string => {
  switch (permission) {
    case 'ADMIN':
      return '管理者';
    case 'SCOUT':
      return 'スカウト担当者';
    case 'RECRUITER':
      return '採用担当者';
    default:
      return permission;
  }
};

interface CompanyDetailClientProps {
  company: CompanyEditData;
  analytics: CompanyAnalyticsData;
  onUserDeleteComplete?: () => void;
}

export default function CompanyDetailClient({
  company: initialCompany,
  analytics,
  onUserDeleteComplete,
}: CompanyDetailClientProps) {
  const router = useRouter();

  // companyをstateで管理して更新可能にする
  console.log('[CompanyDetailClient] Initial company prop:', initialCompany);
  console.log('[CompanyDetailClient] Initial plan value:', initialCompany.plan);
  const [company, setCompany] = useState(initialCompany);

  // 注意: initialCompanyの自動同期は削除（モーダル表示中の勝手な更新を防ぐため）
  // 更新はモーダルが閉じたときのrouter.refresh()でのみ行う

  // デバッグ用: コンポーネントがマウントされたときの情報をログ出力
  useEffect(() => {
    console.log(
      `[Company Detail Client] Company: ${company.company_name}, Plan: ${company.plan}`
    );
    console.log(
      `[Company Detail Client] Groups:`,
      company.company_groups?.map(g => `${g.group_name} (${g.id})`) || []
    );
  }, [company.company_name, company.plan, company.company_groups]);

  const [memoText, setMemoText] = useState(
    '自由にメモを記入できます。\n同一グループ内の方が閲覧可能です。'
  );
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{
    name: string;
    id: string;
  } | null>(null);
  const [newGroupModalOpen, setNewGroupModalOpen] = useState(false);
  const [roleChangeModalOpen, setRoleChangeModalOpen] = useState(false);
  const [roleChangeData, setRoleChangeData] = useState<{
    userName: string;
    userId: string;
    currentRole: string;
    newRole: string;
  } | null>(null);
  const [groupNameChangeModalOpen, setGroupNameChangeModalOpen] =
    useState(false);
  const [
    groupNameChangeCompleteModalOpen,
    setGroupNameChangeCompleteModalOpen,
  ] = useState(false);
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
  const [invitationCompleteModalOpen, setInvitationCompleteModalOpen] =
    useState(false);
  const [invitedMembersCount, setInvitedMembersCount] = useState(0);
  const [withdrawalConfirmModalOpen, setWithdrawalConfirmModalOpen] =
    useState(false);
  const [withdrawalCompleteModalOpen, setWithdrawalCompleteModalOpen] =
    useState(false);
  const [planChangeModalOpen, setPlanChangeModalOpen] = useState(false);
  const [planChangeCompleteModalOpen, setPlanChangeCompleteModalOpen] =
    useState(false);
  const [newSelectedPlan, setNewSelectedPlan] = useState('');
  const [scoutLimitChangeModalOpen, setScoutLimitChangeModalOpen] =
    useState(false);
  const [
    scoutLimitChangeCompleteModalOpen,
    setScoutLimitChangeCompleteModalOpen,
  ] = useState(false);
  const [newSelectedScoutLimit, setNewSelectedScoutLimit] = useState(0);
  const [deletionConfirmModalOpen, setDeletionConfirmModalOpen] =
    useState(false);
  const [deletionCompleteModalOpen, setDeletionCompleteModalOpen] =
    useState(false);

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

  const handleRoleChangeClick = (
    userName: string,
    userId: string,
    currentRole: string,
    newRole: string
  ) => {
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
      console.log(
        'Changing role for user:',
        roleChangeData.userId,
        'from',
        roleChangeData.currentRole,
        'to',
        roleChangeData.newRole
      );
      alert(
        `${roleChangeData.userName}さんの権限を${roleChangeData.newRole}に変更しました（デバッグモード）`
      );
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

  const handleGroupNameChangeConfirm = async (newGroupName: string) => {
    if (selectedGroupData) {
      try {
        const result = await updateGroupName(
          selectedGroupData.groupId,
          newGroupName
        );

        if (result.success) {
          console.log('Group name updated successfully:', result.updatedGroup);
          console.log(
            `Group name changed: ${selectedGroupData?.currentName} → ${newGroupName}`
          );
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
        console.log(
          'Inviting members to group:',
          selectedGroupForMember.groupId,
          'members:',
          members
        );

        const result = await inviteMembersToGroup(
          selectedGroupForMember.groupId,
          members
        );

        if (result.success) {
          console.log('Members invited successfully:', result.invitedMembers);

          // 招待完了モーダルを開く
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
  };

  const handleWithdrawalClick = () => {
    setWithdrawalConfirmModalOpen(true);
  };

  const handleWithdrawalConfirm = async () => {
    try {
      const result = await suspendCompany(company.id);

      if (result.success) {
        console.log('Company suspended successfully:', result.company);
        console.log(
          `Company ${company.company_name} suspended with status: ${result.company?.status}`
        );
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
    const result = await updateCompanyPlan(company.id, newPlan);

    if (result.success) {
      console.log('Company plan updated successfully:', result.company);

      // プラン変更確認モーダルを閉じて、完了モーダルを表示
      // 注意: ここではローカルstateは更新しない（モーダル表示中は古いデータのまま）
      setNewSelectedPlan(newPlan);
      setPlanChangeCompleteModalOpen(true);
      // モーダルはCompanyPlanChangeModal内で閉じられる
    } else {
      console.error('Company plan update failed:', result.error);
      alert(`プラン変更に失敗しました: ${result.error}`);
      // エラー時はモーダルを開いたまま（CompanyPlanChangeModal内でthrowされる）
      throw new Error(result.error || 'プラン変更に失敗しました');
    }
  };

  const handlePlanChangeCancel = () => {
    setPlanChangeModalOpen(false);
  };

  const handlePlanChangeCompleteClose = () => {
    setPlanChangeCompleteModalOpen(false);
    setNewSelectedPlan('');
    // モーダルが閉じた時にページをリロードして最新データを表示
    router.refresh();
  };

  const handleScoutLimitChangeClick = () => {
    setScoutLimitChangeModalOpen(true);
  };

  const handleScoutLimitChangeConfirm = async (newLimit: number) => {
    try {
      const result = await updateCompanyScoutLimit(company.id, newLimit);

      if (result.success) {
        console.log(
          'Company scout limit updated successfully:',
          result.company
        );

        // クライアント側のcompany状態も更新
        setCompany(prevCompany => ({
          ...prevCompany,
          scout_limit: newLimit,
        }));

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
        console.log(
          'Company physically deleted successfully:',
          result.deletedCompany
        );
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
    <div className='bg-white min-h-screen'>
      {/* ヘッダーボタン */}
      <div className='flex justify-end gap-4 p-6 pb-0'>
        <AdminButton
          onClick={handleEdit}
          text='企業情報を編集'
          variant='green-gradient'
        />
        <AdminButton
          onClick={handleDelete}
          text='企業を削除'
          variant='green-gradient'
        />
      </div>

      <div className='max-w-7xl mx-auto px-6 py-8 space-y-8'>
        {/* 企業分析セクション */}
        <div className='space-y-4'>
          <h2 className='text-2xl font-bold text-[#323232]'>企業分析</h2>

          {/* 分析テーブル */}
          <div className='border border-gray-300 rounded'>
            <table className='w-full'>
              <thead className='bg-gray-100'>
                <tr>
                  <th className='px-3 py-2 text-left text-xs font-semibold text-[#323232] border-r border-gray-300'></th>
                  <th className='px-3 py-2 text-left text-xs font-semibold text-[#323232] border-r border-gray-300'>
                    スカウト送信数
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-semibold text-[#323232] border-r border-gray-300'>
                    開封数（開封率）
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-semibold text-[#323232] border-r border-gray-300'>
                    返信数（返信率）
                  </th>
                  <th className='px-3 py-2 text-left text-xs font-semibold text-[#323232]'>
                    応募数（応募率）
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className='border-t border-gray-300'>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    過去7日合計
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.past7Days.scoutSends}
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.past7Days.opens}（{analytics.past7Days.openRate}
                    %）
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.past7Days.replies}（
                    {analytics.past7Days.replyRate}%）
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232]'>
                    {analytics.past7Days.applications}（
                    {analytics.past7Days.applicationRate}%）
                  </td>
                </tr>
                <tr className='border-t border-gray-300'>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    過去30日間合計
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.past30Days.scoutSends}
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.past30Days.opens}（
                    {analytics.past30Days.openRate}%）
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.past30Days.replies}（
                    {analytics.past30Days.replyRate}%）
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232]'>
                    {analytics.past30Days.applications}（
                    {analytics.past30Days.applicationRate}%）
                  </td>
                </tr>
                <tr className='border-t border-gray-300'>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    累計
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.total.scoutSends}
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.total.opens}（{analytics.total.openRate}%）
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232] border-r border-gray-300'>
                    {analytics.total.replies}（{analytics.total.replyRate}%）
                  </td>
                  <td className='px-3 py-2 text-xs text-[#323232]'>
                    {analytics.total.applications}（
                    {analytics.total.applicationRate}%）
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 運営メモ */}
          <div className='mt-8'>
            <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] mb-2">
              運営メモ
            </label>
            <div className='border p-1'>
              <textarea
                value={memoText}
                onChange={e => setMemoText(e.target.value)}
                className="w-full h-32 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] resize-none text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP'] focus:outline-none focus:border-[#0F9058] placeholder:text-[#999999]"
                placeholder='自由にメモを記入できます。同一グループ内の方が閲覧可能です。'
              />
            </div>
          </div>
        </div>

        <hr className='border-black border-t-2' />

        {/* 企業情報セクション */}
        <div className='space-y-6'>
          <h2 className='text-2xl font-bold text-black'>企業情報</h2>

          {/* プラン */}
          <div className='flex items-center gap-6 py-3'>
            <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
              プラン
            </label>
            <div className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP']">
              {(() => {
                console.log('[RENDER] company.plan value:', company.plan);
                console.log(
                  '[RENDER] getPlanDisplayName result:',
                  company.plan
                    ? getPlanDisplayName(company.plan)
                    : 'プラン名が入ります'
                );
                return company.plan
                  ? getPlanDisplayName(company.plan)
                  : 'プラン名が入ります';
              })()}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 企業ID */}
          <div className='flex items-center gap-6 py-3'>
            <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
              企業ID
            </label>
            <div className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP']">
              {company.id}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 企業名 */}
          <div className='flex items-center gap-6 py-3'>
            <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
              企業名
            </label>
            <div className="flex-1 px-[11px] py-[11px] bg-white border border-[#999999] rounded-[5px] text-[16px] text-[#323232] font-medium tracking-[1.6px] font-['Noto_Sans_JP']">
              {company.company_name}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* URL */}
          <div className='flex items-start gap-6 py-3'>
            <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40 mt-2">
              URL
            </label>
            <div className='flex-1 space-y-3'>
              {company.company_urls &&
              Array.isArray(company.company_urls) &&
              company.company_urls.length > 0 ? (
                company.company_urls.map((urlData: any, index: number) => (
                  <div key={index} className='flex items-center gap-4'>
                    <div className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px]">
                      {urlData.title || 'タイトル未設定'}
                    </div>
                    <div className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#323232] leading-[1.6] tracking-[1.6px]">
                      {urlData.url || 'URL未設定'}
                    </div>
                  </div>
                ))
              ) : (
                <div className="font-['Noto_Sans_JP'] text-[16px] font-medium text-[#999999] leading-[1.6] tracking-[1.6px]">
                  URLが設定されていません
                </div>
              )}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* アイコン画像 */}
          <div className='flex items-center gap-6 py-3'>
            <label className="block font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] w-40">
              アイコン画像
            </label>
            <div className='w-32 h-32 bg-gray-400 rounded-full flex items-center justify-center overflow-hidden'>
              {company.icon_image_url ? (
                <img
                  src={company.icon_image_url}
                  alt='企業アイコン'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='text-center'>
                  <div className='text-sm font-bold text-white'>画像未設定</div>
                </div>
              )}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 代表者 */}
          <div className='flex items-center gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40'>
              代表者
            </label>
            <div className='flex-1 px-3 py-3 bg-white border border-gray-300 text-base'>
              {company.representative_position && company.representative_name
                ? `${company.representative_position} ${company.representative_name}`
                : company.representative_name || '未設定'}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 設立 */}
          <div className='flex items-center gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40'>
              設立
            </label>
            <div className='flex items-center gap-2'>
              <div className='w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center'>
                {company.established_year || '未設定'}
              </div>
              <span className='text-base text-black'>年</span>
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 資本金 */}
          <div className='flex items-center gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40'>
              資本金
            </label>
            <div className='flex items-center gap-2'>
              <div className='w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center'>
                {company.capital_amount || '未設定'}
              </div>
              <span className='text-base text-black'>
                {company.capital_unit || '万円'}
              </span>
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 従業員数 */}
          <div className='flex items-center gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40'>
              従業員数
            </label>
            <div className='flex items-center gap-2'>
              <div className='w-24 px-3 py-3 bg-white border border-gray-300 text-base text-center'>
                {company.employees_count || '未設定'}
              </div>
              <span className='text-base text-black'>人</span>
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 業種 */}
          <div className='flex items-start gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40 mt-2'>
              業種
            </label>
            <div className='flex-1 px-3 py-3 bg-white border border-gray-300 text-base'>
              {company.industries &&
              Array.isArray(company.industries) &&
              company.industries.length > 0
                ? company.industries.join(', ')
                : company.industry || '未設定'}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 事業内容 */}
          <div className='flex items-start gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40 mt-2'>
              事業内容
            </label>
            <div className='flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap'>
              {company.business_content || company.company_overview || '未設定'}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 所在地 */}
          <div className='flex items-start gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40 mt-2'>
              所在地
            </label>
            <div className='flex-1 px-3 py-3 bg-white border border-gray-300 text-base whitespace-pre-wrap'>
              {company.headquarters_address ||
                (company.prefecture && company.address
                  ? `${company.prefecture} ${company.address}`
                  : company.prefecture || company.address || '未設定')}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 企業フェーズ */}
          <div className='flex items-center gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40'>
              企業フェーズ
            </label>
            <div className='flex-1 px-3 py-3 bg-white border border-gray-300 text-base'>
              {company.company_phase || '未設定'}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* イメージ画像 */}
          <div className='flex items-start gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40 mt-2'>
              イメージ画像
            </label>
            <div className='flex gap-4'>
              {company.company_images &&
              Array.isArray(company.company_images) &&
              company.company_images.length > 0
                ? company.company_images
                    .slice(0, 3)
                    .map((imageUrl: string, index: number) => (
                      <div
                        key={index}
                        className='w-48 h-32 bg-gray-400 flex items-center justify-center overflow-hidden'
                      >
                        <img
                          src={imageUrl}
                          alt={`企業画像${index + 1}`}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ))
                : [0, 1, 2].map(index => (
                    <div
                      key={index}
                      className='w-48 h-32 bg-gray-400 flex items-center justify-center'
                    >
                      <div className='text-center'>
                        <div className='text-sm font-bold text-white'>
                          画像未設定
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
          </div>

          <hr className='border-gray-300' />

          {/* 企業の魅力 */}
          <div className='flex items-start gap-6 py-3'>
            <label className='block text-base font-bold text-black w-40 mt-2'>
              企業の魅力
            </label>
            <div className='flex-1 space-y-6'>
              {company.company_attractions &&
              Array.isArray(company.company_attractions) &&
              company.company_attractions.length > 0 ? (
                company.company_attractions.map(
                  (attraction: any, index: number) => (
                    <div key={index} className='space-y-4'>
                      <div className='text-xl font-bold text-black'>
                        {attraction.title || `魅力${index + 1}`}
                      </div>
                      <div className='text-base text-black'>
                        {attraction.description || '説明が設定されていません'}
                      </div>
                    </div>
                  )
                )
              ) : (
                <div className='text-base text-gray-500'>
                  企業の魅力が設定されていません
                </div>
              )}
            </div>
          </div>
        </div>

        <hr className='border-black border-t-2' />

        {/* 企業グループセクション */}
        <div className='space-y-6'>
          <div className='flex justify-between items-center'>
            <h2 className='text-2xl font-bold text-[#323232]'>企業グループ</h2>
            <AdminButton
              onClick={handleNewGroupClick}
              text='新規グループ追加'
              variant='green-gradient'
            />
          </div>

          {/* グループリスト */}
          {company.company_groups && company.company_groups.length > 0 ? (
            company.company_groups.map((group, index) => (
              <div
                key={group.id}
                className='bg-white border border-gray-200 rounded-lg p-6 space-y-4'
              >
                <div className='flex justify-between items-center'>
                  <h3 className='text-xl font-bold text-[#323232]'>
                    {group.group_name}
                  </h3>
                  <div className='flex gap-6'>
                    <AdminButton
                      onClick={() =>
                        handleAddMemberClick(group.id, group.group_name)
                      }
                      text='メンバー追加'
                      variant='green-outline'
                    />
                    <AdminButton
                      onClick={() =>
                        handleGroupNameChangeClick(group.id, group.group_name)
                      }
                      text='グループ名編集'
                      variant='green-outline'
                    />
                    <AdminButton
                      onClick={async () => {
                        if (
                          confirm(
                            '本当にこのグループを削除しますか？\nこの操作は取り消すことができません。'
                          )
                        ) {
                          try {
                            const result = await deleteGroup(group.id);

                            if (result.success) {
                              console.log(
                                'Group deleted successfully:',
                                result.deletedGroup
                              );
                              alert(
                                `グループ「${group.group_name}」を削除しました`
                              );

                              // 削除成功後に /admin/company/delete に遷移
                              router.push('/admin/company/delete');
                            } else {
                              console.error(
                                'Group deletion failed:',
                                result.error
                              );
                              alert(
                                `グループの削除に失敗しました: ${result.error}`
                              );
                            }
                          } catch (error) {
                            console.error('Group deletion error:', error);
                            alert('グループ削除中にエラーが発生しました');
                          }
                        }
                      }}
                      text='グループを削除'
                      variant='green-outline'
                    />
                  </div>
                </div>

                <hr className='border-gray-300' />

                {/* メンバーリスト */}
                <div className='space-y-4'>
                  {group.company_user_group_permissions &&
                  group.company_user_group_permissions.length > 0 ? (
                    group.company_user_group_permissions.map(
                      (permission, permIndex) => (
                        <div key={permission.company_user_id}>
                          <div className='flex justify-between items-center py-2'>
                            <div className='text-base font-bold'>
                              {permission.company_users?.full_name ||
                                '名前未設定'}
                            </div>
                            <div className='flex items-center gap-4'>
                              <select
                                value={permission.permission_level}
                                onChange={e => {
                                  if (
                                    e.target.value !==
                                    permission.permission_level
                                  ) {
                                    handleRoleChangeClick(
                                      permission.company_users?.full_name ||
                                        '名前未設定',
                                      permission.company_user_id,
                                      getPermissionDisplayName(
                                        permission.permission_level
                                      ),
                                      getPermissionDisplayName(e.target.value)
                                    );
                                  }
                                }}
                                className="font-['Noto_Sans_JP'] text-[16px] font-bold text-[#323232] leading-[1.6] tracking-[1.6px] bg-transparent border-none outline-none cursor-pointer appearance-none pr-6 bg-right bg-no-repeat"
                                style={{
                                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23323232' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                                  backgroundSize: '1.5rem 1.5rem',
                                }}
                              >
                                <option value='ADMIN'>管理者</option>
                                <option value='SCOUT'>スカウト担当者</option>
                                <option value='RECRUITER'>採用担当者</option>
                              </select>
                              <ActionButton
                                onClick={() =>
                                  handleUserDeleteClick(
                                    permission.company_users?.full_name ||
                                      '名前未設定',
                                    permission.company_user_id
                                  )
                                }
                                text='削除'
                                variant='delete'
                                size='small'
                              />
                            </div>
                          </div>
                          {permIndex <
                            group.company_user_group_permissions.length - 1 && (
                            <hr className='border-gray-300' />
                          )}
                        </div>
                      )
                    )
                  ) : (
                    <div className='text-center text-gray-500 py-4'>
                      このグループにはメンバーがいません
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className='bg-white border border-gray-200 rounded-lg p-6'>
              <p className='text-center text-gray-500'>グループがありません</p>
            </div>
          )}

          {/* グループチケットログ1 */}
          <div className='bg-gray-300 rounded-lg p-6'>
            <h3 className='text-xl font-bold text-[#323232] text-center mb-6'>
              グループチケットログ
            </h3>

            <div className='bg-white rounded-lg p-6 space-y-4'>
              <div className='space-y-2'>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='border-l border-gray-300 h-20'></div>
                <div className='text-right'>
                  <div className='text-base'>グループ内月次消化枚数</div>
                  <div className='text-2xl font-bold'>100枚</div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン群 */}
          <div className='flex gap-6 justify-center'>
            <AdminButton
              onClick={handleScoutLimitChangeClick}
              text='スカウト上限数変更'
              variant='green-outline'
            />
            <AdminButton
              onClick={handlePlanChangeClick}
              text='プラン変更'
              variant='green-outline'
            />
            <AdminButton
              onClick={handleWithdrawalClick}
              text='休会'
              variant='green-outline'
            />
            <AdminButton
              onClick={handleDeletionClick}
              text='退会'
              variant='green-outline'
            />
          </div>

          {/* チケット管理セクション */}
          <div className='bg-gray-700 rounded-lg p-6 text-white'>
            <h3 className='text-xl font-bold text-center mb-6'>チケット管理</h3>

            <div className='bg-white rounded-lg p-6 text-black space-y-4'>
              <div className='space-y-2'>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='border-l border-gray-300 h-24'></div>
                <div className='text-right'>
                  <div className='text-base'>現在の残チケット枚数</div>
                  <div className='text-2xl font-bold'>100枚</div>
                </div>
              </div>

              <div className='text-sm text-red-500 text-center'>
                期間は6ヶ月分をログとして記載する
              </div>
            </div>
          </div>

          {/* グループチケットログ2 */}
          <div className='bg-gray-300 rounded-lg p-6'>
            <h3 className='text-xl font-bold text-[#323232] text-center mb-6'>
              グループチケットログ
            </h3>

            <div className='bg-white rounded-lg p-6 space-y-4'>
              <div className='space-y-2'>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
                <div className='text-base'>
                  yyyy/mm/dd：ログ表示テキストが入ります
                </div>
              </div>

              <div className='flex justify-between items-center'>
                <div className='border-l border-gray-300 h-20'></div>
                <div className='text-right'>
                  <div className='text-base'>グループ内月次消化枚数</div>
                  <div className='text-2xl font-bold'>100枚</div>
                </div>
              </div>

              <div className='text-sm text-red-500 text-center'>
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
        currentLimit={company.scout_limit || 10}
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
