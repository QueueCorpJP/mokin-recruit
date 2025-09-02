import React from 'react';
import ScoutTemplateNewClient from './ScoutTemplateNewClient';
import { getServerAuth } from '@/lib/auth/server';
import { redirect } from 'next/navigation';

export default async function ScoutTemplateNewPage() {


  return <ScoutTemplateNewClient />;
}
