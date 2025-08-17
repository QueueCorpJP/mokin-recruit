'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminButtonProps {
  href?: string;
  onClick?: () => void;
  text: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  href,
  onClick,
  text,
  variant = 'primary',
  size = 'medium',
  disabled = false
}) => {
  const getVariant = () => {
    switch (variant) {
      case 'secondary':
        return 'secondary';
      case 'danger':
        return 'destructive';
      default:
        return 'green-gradient';
    }
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return 'figma-small';
      case 'large':
        return 'lg';
      default:
        return 'figma-default';
    }
  };

  if (href) {
    return (
      <Button
        asChild
        variant={getVariant()}
        size={getSize()}
        disabled={disabled}
      >
        <a href={href}>{text}</a>
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={getVariant()}
      size={getSize()}
      disabled={disabled}
    >
      {text}
    </Button>
  );
};