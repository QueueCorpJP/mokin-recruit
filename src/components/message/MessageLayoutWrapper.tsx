'use client';

import React from 'react';
import {
  MessageLayoutServer,
  MessageLayoutServerProps,
} from './MessageLayoutServer';

export interface MessageLayoutWrapperProps extends MessageLayoutServerProps {
  initialRoomId?: string;
  jobOptions?: Array<{ value: string; label: string; groupId?: string }>;
}

export function MessageLayoutWrapper(props: MessageLayoutWrapperProps) {
  return (
    <MessageLayoutServer
      {...props}
      initialRoomId={props.initialRoomId}
      jobOptions={props.jobOptions}
    />
  );
}
