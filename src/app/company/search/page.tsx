import React from 'react';
import Search from './SearchClient';
import { getCachedCompanyUser } from '@/lib/auth/server';
import { getSavedSearches } from './actions';
import { SavedSearchesList } from './SavedSearchesList';

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
      {companyUser && (
        <div className="w-full max-w-[1280px] mx-auto px-10 pb-10">
          <SavedSearchesList 
            companyId={companyUser.id} 
            savedSearches={savedSearches}
          />
        </div>
      )}
    </div>
  );
}
