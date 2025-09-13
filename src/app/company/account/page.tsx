import React from 'react';
import AccountClient from './AccountClient';

import { requireCompanyAuthForAction, getCompanySupabaseClient } from '@/lib/auth/server';

export default async function AccountPage() {
  // 認証（RLS有効）
  const auth = await requireCompanyAuthForAction();
  if (!auth.success) {
    // 統一された骨組み表示
    return (
      <div className='min-h-[60vh] w-full flex flex-col items-center bg-[#F9F9F9] px-4 pt-4 pb-20 md:px-20 md:py-10 md:pb-20'>
        <main className='w-full max-w-[1280px] mx-auto'>
          <p>認証が必要です。</p>
        </main>
      </div>
    );
  }

  const { companyAccountId } = auth.data;
  const supabase = await getCompanySupabaseClient();

  // 企業情報
  const companyPromise = supabase
    .from('company_accounts')
    .select(`id, company_name, representative_name, representative_position, industry, industries, company_overview, headquarters_address, icon_image_url, company_images, company_urls, established_year, capital_amount, capital_unit, employees_count, company_phase, company_attractions`)
    .eq('id', companyAccountId)
    .maybeSingle();

  // グループ一覧
  const groupsPromise = supabase
    .from('company_groups')
    .select('id, group_name')
    .eq('company_account_id', companyAccountId);

  const [{ data: company }, { data: groups }] = await Promise.all([
    companyPromise,
    groupsPromise,
  ]);

  // グループがなければ空配列
  const groupList = groups ?? [];
  const groupIds = groupList.map((g) => g.id);

  // メンバー権限（グループ別）
  let permissions: Array<{ id: string; company_user_id: string; company_group_id: string; permission_level: string }> = [];
  if (groupIds.length > 0) {
    const { data: perms } = await supabase
      .from('company_user_group_permissions')
      .select('id, company_user_id, company_group_id, permission_level')
      .in('company_group_id', groupIds);
    permissions = perms ?? [];
  }

  // ユーザー詳細
  let users: Array<{ id: string; full_name: string | null; email: string }> = [];
  const userIds = Array.from(new Set(permissions.map((p) => p.company_user_id)));
  if (userIds.length > 0) {
    const { data: userRows } = await supabase
      .from('company_users')
      .select('id, full_name, email')
      .in('id', userIds);
    users = userRows ?? [];
  }

  // 権限マッピング（UIのadmin/scout/recruiterに合わせるが、現行DBは二値運用）
  const mapPermission = (level: string): 'admin' | 'member' | 'viewer' => {
    switch (level) {
      case 'ADMIN':
      case 'ADMINISTRATOR':
        return 'admin';
      case 'SCOUT_STAFF':
        // UIではscout/recruiterを表示するが、ここでは同一グルーピングで扱う
        return 'member';
      default:
        return 'viewer';
    }
  };

  // グループ + メンバー構築
  const groupsWithMembers = groupList.map((g) => {
    const membersForGroup = permissions
      .filter((p) => p.company_group_id === g.id)
      .map((p) => {
        const u = users.find((x) => x.id === p.company_user_id);
        return {
          id: p.company_user_id,
          name: u?.full_name ?? '未設定',
          email: u?.email ?? '未設定',
          permission: mapPermission(p.permission_level),
        } as const;
      });
    return {
      id: g.id,
      name: g.group_name || 'グループ名テキスト',
      members: membersForGroup,
    } as const;
  });

  // JSONフィールドの安全な解析
  const parseJsonField = (field: any, defaultValue: any) => {
    if (typeof field === 'string') {
      try {
        return JSON.parse(field);
      } catch {
        return defaultValue;
      }
    }
    return field ?? defaultValue;
  };

  // 企業基本情報のマッピング
  let industryList: string[] = [];
  
  if (company?.industries) {
    // industries フィールドがある場合（新しい形式）
    const industriesData = parseJsonField(company.industries, []);
    if (Array.isArray(industriesData) && industriesData.length > 0) {
      // industriesが業種名の配列の場合
      if (typeof industriesData[0] === 'string') {
        industryList = industriesData;
      }
      // industriesが {id, name} オブジェクトの配列の場合
      else if (typeof industriesData[0] === 'object' && industriesData[0].name) {
        industryList = industriesData.map((item: any) => item.name);
      }
    }
  }
  
  // industries が空で、古い industry フィールドがある場合は fallback
  if (industryList.length === 0 && company?.industry) {
    industryList = (company.industry ?? '')
      .split(/[、,\s]+/)
      .filter((s: string) => s.length > 0);
  }
  
  // バッジは多くても控えめに
  industryList = industryList.slice(0, 6);

  const companyProps = company
    ? {
        companyName: company.company_name ?? 'テキストが入ります。',
        representativeName: company.representative_name ?? '代表者名テキスト',
        representativePosition: company.representative_position ?? '未設定',
        industryList: industryList.length > 0 ? industryList : ['未設定'],
        companyOverview: company.company_overview ?? '',
        headquartersAddress: company.headquarters_address ?? '',
        iconUrl: company.icon_image_url ?? null,
        imageUrls: Array.isArray(company.company_images) ? company.company_images : [],
        companyUrls: parseJsonField(company.company_urls, []),
        establishedYear: company.established_year ?? null,
        capitalAmount: company.capital_amount ?? null,
        capitalUnit: company.capital_unit ?? '万円',
        employeesCount: company.employees_count ?? null,
        companyPhase: company.company_phase ?? '',
        companyAttractions: parseJsonField(company.company_attractions, []),
      }
    : undefined;

  type GroupMemberPermission = 'admin' | 'member' | 'viewer';
  interface Member { id: string; name: string; email: string; permission: GroupMemberPermission; }
  interface Group { id: string; name: string; members: Member[]; }
  interface AccountPropsLocal {
    company?: {
      companyName: string;
      representativeName: string;
      representativePosition: string;
      industryList: string[];
      companyOverview: string;
      headquartersAddress: string;
      iconUrl?: string | null;
      imageUrls?: string[];
      companyUrls?: Array<{ title: string; url: string }>;
      establishedYear?: number | null;
      capitalAmount?: number | null;
      capitalUnit?: string;
      employeesCount?: number | null;
      companyPhase?: string;
      companyAttractions?: Array<{ title: string; content: string }>;
    } | undefined;
    groups?: Group[] | undefined;
  }

  const Account = AccountClient as React.ComponentType<AccountPropsLocal>;

  return (
    <>
      <Account
        company={companyProps}
        groups={groupsWithMembers}
      />
    </>
  );
}
