import React from 'react';
import { NewMessageItem, Message } from './NewMessageItem';

interface NewMessageListProps {
  messages: Message[];
}

export const NewMessageList: React.FC<NewMessageListProps> = ({ messages }) => (
  <div className='flex flex-col gap-2 mt-2 mb-6'>
    {messages.map(msg => (
      <NewMessageItem key={msg.id} message={msg} />
    ))}
  </div>
);
