'use client';

import React, { Suspense } from 'react';
import { ScoutConfirmForm } from './ScoutConfirmForm';

interface CompanyScoutConfirmPageProps {
  params: { id: string };
}

export default function CompanyScoutConfirmPage({ params }: CompanyScoutConfirmPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ScoutConfirmForm candidateId={params.id} />
    </Suspense>
  );
}