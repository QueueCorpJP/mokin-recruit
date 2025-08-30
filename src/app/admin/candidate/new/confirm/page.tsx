import { Suspense } from 'react';
import CandidateNewConfirmClient from './CandidateNewConfirmClient';

export default function CandidateNewConfirmPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CandidateNewConfirmClient />
    </Suspense>
  );
}