'use client';

import React from 'react';
import { AdminButton } from './AdminButton';

interface NewArticleButtonProps {
  href?: string;
  onClick?: () => void;
  text?: string;
}

export const NewArticleButton: React.FC<NewArticleButtonProps> = ({
  href = '/admin/media/new',
  onClick,
  text = '新規記事追加'
}) => {
  return (
    <AdminButton
      href={href}
      onClick={onClick}
      text={text}
      variant="green-gradient"
      size="figma-default"
    />
  );
};