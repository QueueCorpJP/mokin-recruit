import type { PermissionLevelDb, UiRole } from '@/types/company';

const uiToDbMap: Record<UiRole, PermissionLevelDb> = {
  admin: 'ADMINISTRATOR',
  scout: 'SCOUT_STAFF',
  // DBスキーマは 'RECRUITER_STAFF' を許容しないため、'recruiter' も 'SCOUT_STAFF' にマップする
  recruiter: 'SCOUT_STAFF',
};

const dbToUiMap: Record<PermissionLevelDb, UiRole> = {
  ADMINISTRATOR: 'admin',
  SCOUT_STAFF: 'scout',
  RECRUITER_STAFF: 'recruiter',
};

export function toDbPermission(role: UiRole): PermissionLevelDb {
  return uiToDbMap[role];
}

export function toUiRole(level: PermissionLevelDb): UiRole {
  return dbToUiMap[level];
}
