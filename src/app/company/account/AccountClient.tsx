'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select-input';

const AccountIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.11116 0C5.47535 0 4.14819 1.34375 4.14819 3V29C4.14819 30.6562 5.47535 32 7.11116 32H13.0371V27C13.0371 25.3438 14.3642 24 16 24C17.6358 24 18.963 25.3438 18.963 27V32H24.8889C26.5247 32 27.8519 30.6562 27.8519 29V3C27.8519 1.34375 26.5247 0 24.8889 0H7.11116ZM8.09881 15C8.09881 14.45 8.54326 14 9.08647 14H11.0618C11.605 14 12.0494 14.45 12.0494 15V17C12.0494 17.55 11.605 18 11.0618 18H9.08647C8.54326 18 8.09881 17.55 8.09881 17V15ZM15.0124 14H16.9877C17.5309 14 17.9754 14.45 17.9754 15V17C17.9754 17.55 17.5309 18 16.9877 18H15.0124C14.4692 18 14.0247 17.55 14.0247 17V15C14.0247 14.45 14.4692 14 15.0124 14ZM19.9507 15C19.9507 14.45 20.3951 14 20.9383 14H22.9136C23.4568 14 23.9013 14.45 23.9013 15V17C23.9013 17.55 23.4568 18 22.9136 18H20.9383C20.3951 18 19.9507 17.55 19.9507 17V15ZM9.08647 6H11.0618C11.605 6 12.0494 6.45 12.0494 7V9C12.0494 9.55 11.605 10 11.0618 10H9.08647C8.54326 10 8.09881 9.55 8.09881 9V7C8.09881 6.45 8.54326 6 9.08647 6ZM14.0247 7C14.0247 6.45 14.4692 6 15.0124 6H16.9877C17.5309 6 17.9754 6.45 17.9754 7V9C17.9754 9.55 17.5309 10 16.9877 10H15.0124C14.4692 10 14.0247 9.55 14.0247 9V7ZM20.9383 6H22.9136C23.4568 6 23.9013 6.45 23.9013 7V9C23.9013 9.55 23.4568 10 22.9136 10H20.9383C20.3951 10 19.9507 9.55 19.9507 9V7C19.9507 6.45 20.3951 6 20.9383 6Z"
      fill="white"
    />
  </svg>
);

const GroupIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.2 3.3125C8.26087 3.3125 9.27828 3.73029 10.0284 4.47397C10.7786 5.21765 11.2 6.2263 11.2 7.27802C11.2 8.32974 10.7786 9.33838 10.0284 10.0821C9.27828 10.8257 8.26087 11.2435 7.2 11.2435C6.13913 11.2435 5.12172 10.8257 4.37157 10.0821C3.62143 9.33838 3.2 8.32974 3.2 7.27802C3.2 6.2263 3.62143 5.21765 4.37157 4.47397C5.12172 3.73029 6.13913 3.3125 7.2 3.3125ZM25.6 3.3125C26.6609 3.3125 27.6783 3.73029 28.4284 4.47397C29.1786 5.21765 29.6 6.2263 29.6 7.27802C29.6 8.32974 29.1786 9.33838 28.4284 10.0821C27.6783 10.8257 26.6609 11.2435 25.6 11.2435C24.5391 11.2435 23.5217 10.8257 22.7716 10.0821C22.0214 9.33838 21.6 8.32974 21.6 7.27802C21.6 6.2263 22.0214 5.21765 22.7716 4.47397C23.5217 3.73029 24.5391 3.3125 25.6 3.3125ZM0 18.1187C0 15.1991 2.39 12.8297 5.335 12.8297H7.47C8.265 12.8297 9.02 13.0032 9.7 13.3106C9.635 13.6675 9.605 14.0392 9.605 14.4159C9.605 16.3095 10.445 18.0097 11.77 19.1746C11.76 19.1746 11.75 19.1746 11.735 19.1746H1.065C0.48 19.1746 0 18.6987 0 18.1187ZM20.265 19.1746C20.255 19.1746 20.245 19.1746 20.23 19.1746C21.56 18.0097 22.395 16.3095 22.395 14.4159C22.395 14.0392 22.36 13.6724 22.3 13.3106C22.98 12.9983 23.735 12.8297 24.53 12.8297H26.665C29.61 12.8297 32 15.1991 32 18.1187C32 18.7037 31.52 19.1746 30.935 19.1746H20.27H20.265ZM11.2 14.4159C11.2 13.1539 11.7057 11.9435 12.6059 11.0511C13.5061 10.1587 14.727 9.65733 16 9.65733C17.273 9.65733 18.4939 10.1587 19.3941 11.0511C20.2943 11.9435 20.8 13.1539 20.8 14.4159C20.8 15.678 20.2943 16.8884 19.3941 17.7808C18.4939 18.6732 17.273 19.1746 16 19.1746C14.727 19.1746 13.5061 18.6732 12.6059 17.7808C11.7057 16.8884 11.2 15.678 11.2 14.4159ZM6.4 27.3683C6.4 23.72 9.385 20.7608 13.065 20.7608H18.93C22.615 20.7608 25.6 23.72 25.6 27.3683C25.6 28.097 25.005 28.6918 24.265 28.6918H7.73C6.995 28.6918 6.395 28.1019 6.395 27.3683H6.4Z"
      fill="#0F9058"
    />
  </svg>
);

const SettingIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M23.2941 7.8109C23.4448 8.21879 23.3177 8.67357 22.9929 8.96425L20.9548 10.8115C21.0066 11.2006 21.0348 11.5991 21.0348 12.0023C21.0348 12.4055 21.0066 12.8041 20.9548 13.1932L22.9929 15.0404C23.3177 15.3311 23.4448 15.7859 23.2941 16.1938C23.087 16.7517 22.8376 17.2862 22.5505 17.8019L22.3292 18.1817C22.0186 18.6974 21.6703 19.185 21.289 19.6445C21.0113 19.982 20.55 20.0945 20.1358 19.9633L17.5141 19.1334C16.8834 19.6163 16.1867 20.0195 15.4431 20.3243L14.8547 23.0014C14.7606 23.428 14.4311 23.7656 13.998 23.8359C13.3485 23.9437 12.6801 24 11.9976 24C11.3151 24 10.6467 23.9437 9.99718 23.8359C9.56415 23.7656 9.23467 23.428 9.14053 23.0014L8.55217 20.3243C7.80848 20.0195 7.11186 19.6163 6.48114 19.1334L3.86411 19.968C3.4499 20.0992 2.98863 19.982 2.71092 19.6492C2.32967 19.1897 1.98136 18.7021 1.6707 18.1864L1.44948 17.8066C1.16236 17.2909 0.912892 16.7564 0.705789 16.1985C0.555169 15.7906 0.682255 15.3358 1.00703 15.0451L3.04511 13.1979C2.99334 12.8041 2.9651 12.4055 2.9651 12.0023C2.9651 11.5991 2.99334 11.2006 3.04511 10.8115L1.00703 8.96425C0.682255 8.67357 0.555169 8.21879 0.705789 7.8109C0.912892 7.25298 1.16236 6.7185 1.44948 6.20277L1.6707 5.82301C1.98136 5.30729 2.32967 4.81969 2.71092 4.36023C2.98863 4.02266 3.4499 3.91014 3.86411 4.04141L6.48585 4.87126C7.11657 4.38836 7.81319 3.98515 8.55688 3.68041L9.14524 1.00332C9.23938 0.576675 9.56886 0.239109 10.0019 0.168783C10.6514 0.056261 11.3198 0 12.0023 0C12.6848 0 13.3532 0.056261 14.0027 0.164095C14.4358 0.234421 14.7653 0.571987 14.8594 0.998633L15.4478 3.67572C16.1915 3.98046 16.8881 4.38367 17.5188 4.86658L20.1405 4.03673C20.5547 3.90545 21.016 4.02266 21.2937 4.35554C21.675 4.815 22.0233 5.3026 22.3339 5.81832L22.5552 6.19809C22.8423 6.71381 23.0917 7.24829 23.2988 7.80621L23.2941 7.8109ZM12.0023 15.7531C13.001 15.7531 13.9588 15.3579 14.6649 14.6545C15.3711 13.9511 15.7678 12.9971 15.7678 12.0023C15.7678 11.0076 15.3711 10.0536 14.6649 9.35018C13.9588 8.64678 13.001 8.25161 12.0023 8.25161C11.0036 8.25161 10.0459 8.64678 9.3397 9.35018C8.63353 10.0536 8.23681 11.0076 8.23681 12.0023C8.23681 12.9971 8.63353 13.9511 9.3397 14.6545C10.0459 15.3579 11.0036 15.7531 12.0023 15.7531Z"
      fill="#DCDCDC"
    />
  </svg>
);

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.23077 1.23077C9.23077 0.55 8.68077 0 8 0C7.31923 0 6.76923 0.55 6.76923 1.23077V6.76923H1.23077C0.55 6.76923 0 7.31923 0 8C0 8.68077 0.55 9.23077 1.23077 9.23077H6.76923V14.7692C6.76923 15.45 7.31923 16 8 16C8.68077 16 9.23077 15.45 9.23077 14.7692V9.23077H14.7692C15.45 9.23077 16 8.68077 16 8C16 7.31923 15.45 6.76923 14.7692 6.76923H9.23077V1.23077Z"
      fill="#0F9058"
    />
  </svg>
);

interface Member {
  id: string;
  name: string;
  email: string;
  permission: 'admin' | 'member' | 'viewer';
}

interface Group {
  id: string;
  name: string;
  members: Member[];
}

export default function AccountClient() {
  const router = useRouter();
  const [userPermission] = useState<'scout' | 'recruiter' | 'admin'>('admin');
  const isAdmin = userPermission === 'admin';

  // グループとメンバーの状態管理
  const [groups, setGroups] = useState<Group[]>([
    {
      id: 'group-1',
      name: 'グループ名テキスト',
      members: [
        { id: 'member-1-1', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
        { id: 'member-1-2', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
        { id: 'member-1-3', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
      ],
    },
    {
      id: 'group-2',
      name: 'グループ名テキスト',
      members: [
        { id: 'member-2-1', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
        { id: 'member-2-2', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
        { id: 'member-2-3', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
      ],
    },
    {
      id: 'group-3',
      name: 'グループ名テキスト',
      members: [
        { id: 'member-3-1', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
        { id: 'member-3-2', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
        { id: 'member-3-3', name: '名前テキストが入ります。', email: 'examples@mail.com', permission: 'admin' },
      ],
    },
  ]);

  // メンバー追加関数
  const addMember = (groupId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          const newMember: Member = {
            id: `member-${Date.now()}`,
            name: `新しいメンバー${group.members.length + 1}`,
            email: `newmember${group.members.length + 1}@example.com`,
            permission: 'member',
          };
          return {
            ...group,
            members: [...group.members, newMember],
          };
        }
        return group;
      })
    );
  };

  // メンバー削除関数
  const deleteMember = (groupId: string, memberId: string) => {
    setGroups((prevGroups) =>
      prevGroups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            members: group.members.filter((member) => member.id !== memberId),
          };
        }
        return group;
      })
    );
  };

  return (
    <>
      {/* ヘッダー */}
      <div
        className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10"
        style={{
          background: 'linear-gradient(to top, #17856f, #229a4e)',
        }}
      >
        <div className="w-full max-w-[1200px] mx-auto">
          <div className="flex items-center gap-4">
            <AccountIcon />
            <h1
              className="text-white text-[24px] font-bold tracking-[2.4px]"
              style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
            >
              企業アカウント情報
            </h1>
          </div>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="bg-[#f9f9f9] px-20 pt-10 pb-20">
        <div className="w-full max-w-[1200px] mx-auto">
          {/* 企業情報セクション（1つ目） */}
          <div className="bg-white rounded-[10px] p-10 mb-6 relative">
            {/* 編集ボタン（右上） */}
            {isAdmin && (
              <div className="absolute top-10 right-10">
                <Button
                  variant="green-gradient"
                  size="figma-default"
                  onClick={() => router.push('/company/account/edit')}
                  className="min-w-[160px] px-10"
                >
                  編集
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-2">
              {/* 会社名 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    企業名
                  </div>
                </div>
                <div className="flex items-center py-6">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    テキストが入ります。
                  </div>
                </div>
              </div>

              {/* URL */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    URL
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    URLタイトルテキスト
                  </div>
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    https://
                  </div>
                </div>
              </div>

              {/* アイコン画像 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    アイコン画像
                  </div>
                </div>
                <div className="flex items-start py-6">
                  <div className="w-[100px] h-[100px] rounded-full overflow-hidden relative">
                    <Image
                      src="/images/account-sample.png"
                      alt="企業アイコン"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* 代表者 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    代表者
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    代表者役職名テキスト
                  </div>
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    代表者名テキスト
                  </div>
                </div>
              </div>

              {/* 設立年 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    設立年
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    2020
                  </div>
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    年
                  </div>
                </div>
              </div>

              {/* 資本金 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    資本金
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    100
                  </div>
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    万円
                  </div>
                </div>
              </div>

              {/* 従業員数 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    従業員数
                  </div>
                </div>
                <div className="flex items-center py-6 gap-2">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    100
                  </div>
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    人
                  </div>
                </div>
              </div>

              {/* 業種 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    業種
                  </div>
                </div>
                <div className="flex items-center py-6">
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                      <span
                        className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        業種テキスト
                      </span>
                    </div>
                    <div className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                      <span
                        className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        業種テキスト
                      </span>
                    </div>
                    <div className="bg-[#d2f1da] rounded-[5px] px-3 py-1">
                      <span
                        className="text-[14px] font-medium text-[#0f9058] tracking-[1.4px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        業種テキスト
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 事業内容 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    事業内容
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                    <br />
                    テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                  </div>
                </div>
              </div>

              {/* 所在地 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    所在地
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-1">
                    <div
                      className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      都道府県を選択
                    </div>
                    <div
                      className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                      style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                    >
                      テキストが入ります。
                    </div>
                  </div>
                </div>
              </div>

              {/* 企業フェーズ */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    企業フェーズ
                  </div>
                </div>
                <div className="flex items-center py-6">
                  <div
                    className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    テキストが入ります。
                  </div>
                </div>
              </div>

              {/* イメージ画像 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    イメージ画像
                  </div>
                </div>
                <div className="flex items-start py-6 gap-4">
                  <div className="w-[200px] h-[133px] bg-gray-200 rounded-[5px] overflow-hidden relative">
                    <Image
                      src="/images/account-sample-2.png"
                      alt="企業画像1"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-[200px] h-[133px] bg-gray-200 rounded-[5px] overflow-hidden relative">
                    <Image
                      src="/images/account-sample-2.png"
                      alt="企業画像2"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="w-[200px] h-[133px] bg-gray-200 rounded-[5px] overflow-hidden relative">
                    <Image
                      src="/images/account-sample-2.png"
                      alt="企業画像3"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* 企業の魅力 */}
              <div className="flex gap-6">
                <div className="w-[200px] bg-[#f9f9f9] rounded-[5px] px-6 shrink-0 min-h-[80px] flex items-center">
                  <div
                    className="text-[16px] font-bold text-[#323232] tracking-[1.6px]"
                    style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                  >
                    企業の魅力
                  </div>
                </div>
                <div className="flex-1 py-6">
                  <div className="flex flex-col gap-6">
                    <div>
                      <div
                        className="text-[18px] font-bold text-[#323232] tracking-[1.8px] leading-[1.6] mb-1"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        見出しテキストが入ります。
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                        <br />
                        テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                      </div>
                    </div>
                    <div>
                      <div
                        className="text-[18px] font-bold text-[#323232] tracking-[1.8px] leading-[1.6] mb-1"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        見出しテキストが入ります。
                      </div>
                      <div
                        className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                        <br />
                        テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。テキストが入ります。
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* グループ管理セクション（2つ目） */}
          <div className="mt-20">
            {/* タイトル部分 */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <GroupIcon />
                <h2
                  className="text-[24px] font-bold text-[#323232] tracking-[2.4px] leading-[1.6]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  グループ管理
                </h2>
              </div>
              <Button
                variant="green-gradient"
                size="figma-default"
                className="min-w-[160px] px-10"
                onClick={() => {
                  // 新規グループ作成モーダル表示
                }}
              >
                新規グループ作成
              </Button>
            </div>

            {/* コンテンツ部分 - 3つのグループ */}
            <div className="flex flex-col gap-6">
              {groups.map((group) => (
                <div key={group.id} className="flex flex-col gap-2">
                  {/* グループヘッダー */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      <h3
                        className="text-[20px] font-bold text-[#0f9058] tracking-[2px] leading-[1.6]"
                        style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                      >
                        {group.name}
                      </h3>
                      <button
                        className="p-0 hover:opacity-70 transition-opacity"
                        onClick={() => {
                          // グループ名変更モーダル表示
                        }}
                      >
                        <SettingIcon />
                      </button>
                    </div>
                    <Button
                      type="button"
                      variant="green-outline"
                      size="figma-default"
                      className="border-[#0f9058] text-[#0f9058] min-w-[120px] px-6 py-2.5 transition-colors"
                      onClick={() => addMember(group.id)}
                    >
                      <PlusIcon />
                      <span className="ml-2">メンバー追加</span>
                    </Button>
                  </div>

                  {/* 区切り線 */}
                  <div className="h-[1px] bg-[#999] w-full mb-2"></div>

                  {/* メンバーリスト */}
                  <div className="flex flex-col gap-2">
                    {group.members.map((member) => (
                      <div
                        key={member.id}
                        className={`bg-white flex items-center gap-6 px-10 py-5 rounded-[10px]`}
                      >
                        <div
                          className="flex-1 text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          {member.name}
                        </div>
                        <div
                          className="w-60 text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                        >
                          {member.email}
                        </div>
                        <div className="w-60">
                          <SelectInput
                            options={[
                              { value: 'admin', label: '管理者' },
                              { value: 'member', label: 'メンバー' },
                              { value: 'viewer', label: '閲覧者' },
                            ]}
                            value={member.permission}
                            placeholder="権限を選択"
                          />
                        </div>
                        <button
                          className="text-[14px] font-bold text-[#323232] tracking-[1.4px] leading-[1.6] px-2.5 hover:text-[#f56c6c] transition-colors"
                          style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                          onClick={() => deleteMember(group.id, member.id)}
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* よくあるご質問セクション（3つ目） */}
          <div className="bg-white rounded-[10px] p-10 border-2 border-[#0f9058] relative mt-20">
            <div className="flex flex-col gap-6">
              {/* セクションタイトル */}
              <div className="flex flex-col gap-2">
                <h2
                  className="text-[20px] font-bold text-[#0f9058] tracking-[2px] leading-[1.6]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  よくあるご質問
                </h2>
                <div className="h-[1px] bg-[#dcdcdc] w-full"></div>
              </div>

              {/* Q&A 1 */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-[18px] font-bold text-[#323232] tracking-[1.8px] leading-[1.6]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  Q.「管理者」「スカウト担当者」の権限の違いは何ですか？
                </h3>
                <div
                  className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。
                  <br />
                  回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。
                </div>
              </div>

              {/* Q&A 2 */}
              <div className="flex flex-col gap-2">
                <h3
                  className="text-[18px] font-bold text-[#323232] tracking-[1.8px] leading-[1.6]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  Q. グループを削除する方法を教えてください。
                </h3>
                <div
                  className="text-[16px] font-medium text-[#323232] tracking-[1.6px] leading-[2]"
                  style={{ fontFamily: 'Noto Sans JP, sans-serif' }}
                >
                  回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。
                  <br />
                  回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。回答テキストが入ります。
                </div>
              </div>

              {/* お問い合わせボタン */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="green-gradient"
                  size="figma-default"
                  className="min-w-[160px] px-10"
                  onClick={() => router.push('/company/contact')}
                >
                  お問い合わせ
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
