import React from 'react';

interface FormErrorMessageProps {
  message?: string;
  className?: string;
}

export const FormErrorMessage: React.FC<FormErrorMessageProps> = ({
  message,
  className,
}) => {
  if (!message) return null;
  return <p className={className || 'text-red-500 text-sm mt-1'}>{message}</p>;
};
