import React from 'react';

interface FormFieldHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const FormFieldHeader: React.FC<FormFieldHeaderProps> = ({ 
  children, 
  className = '' 
}) => {
  return (
    <label 
      className={`block mb-2 bg-gray-100 text-gray-800 px-4 py-2 ${className}`}
      style={{
        fontFamily: 'Inter',
        fontSize: '16px',
        fontWeight: 700,
        lineHeight: 1.6
      }}
    >
      {children}
    </label>
  );
};