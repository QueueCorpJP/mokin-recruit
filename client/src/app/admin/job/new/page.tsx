import React from 'react';
import AdminJobNewClient from './JobNewClient';

export default function AdminJobNewPage() {
  // モックの企業グループデータ
  const companyGroups = [
    { id: '1', name: '株式会社ドクターズプライム' },
    { id: '2', name: '株式会社ドクターズプライム（子会社）' }
  ];

  return (
    <AdminJobNewClient 
      initialCompanyGroups={companyGroups}
    />
  );
}