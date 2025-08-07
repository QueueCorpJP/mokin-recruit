'use client';

import React from 'react';
import { MessageLayout } from './MessageLayout';
import type { Message } from './MessageList';
import type { Room } from '@/lib/rooms';

export interface MessageLayoutClientProps {
  messages?: Message[];
  rooms?: Room[];
  isCandidatePage?: boolean;
  userId?: string;
  userType?: string;
}

export function MessageLayoutClient(props: MessageLayoutClientProps) {
  return <MessageLayout {...props} />;
}