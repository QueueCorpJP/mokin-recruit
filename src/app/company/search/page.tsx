import React from 'react';
import Search from './SearchClient';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getSavedSearches } from './actions';

export default async function SearchPage() {
  const companyUser = await getCachedCompanyUser();
  let savedSearches = [];

  if (companyUser) {
    const result = await getSavedSearches(companyUser.id, companyUser.group_id || '');
    if (result.success) {
      savedSearches = result.data;
    }
  }

  return (
    <div>
      <Search companyId={companyUser?.id || ''} />
    </div>
  );
}
