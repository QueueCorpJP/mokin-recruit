import React from 'react';
import { redirect } from 'next/navigation';
import InvitationHandler from './InvitationHandler';

interface InvitationPageProps {
  params: {
    token: string;
  };
}

export default function InvitationPage({ params }: InvitationPageProps) {
  // トークンの基本的な形式チェック
  if (!params.token || !params.token.startsWith('invite_')) {
    redirect('/auth/login?error=invalid_invitation');
  }

  return <InvitationHandler token={params.token} />;
}
