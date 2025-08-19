'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

interface AdminButtonProps {
  href?: string;
  onClick?: () => void;
  text: string;
  variant?: 'primary' | 'green-gradient' | 'secondary' | 'destructive' | 'green-outline' | 'green-square' | 'blue-gradient' | 'blue-outline' | 'yellow-gradient' | 'yellow-outline' | 'white-outline-square' | 'small-green' | 'small-green-outline' | 'outline' | 'ghost' | 'link' | 'default';
  size?: 'figma-default' | 'figma-small' | 'figma-square' | 'figma-outline' | 'figma-blue' | 'figma-blue-outline' | 'figma-yellow' | 'figma-yellow-outline' | 'figma-white-square' | 'figma-small-outline' | 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  className?: string;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  href,
  onClick,
  text,
  variant = 'green-gradient',
  size = 'figma-default',
  disabled = false,
  className = ''
}) => {
  // Map 'primary' to 'green-gradient' for consistency
  const mappedVariant = variant === 'primary' ? 'green-gradient' : variant;

  if (href) {
    return (
      <Button
        asChild
        variant={mappedVariant}
        size={size}
        disabled={disabled}
        className={className}
      >
        <a href={href}>{text}</a>
      </Button>
    );
  }

  return (
    <Button
      onClick={onClick}
      variant={mappedVariant}
      size={size}
      disabled={disabled}
      className={className}
    >
      {text}
    </Button>
  );
};