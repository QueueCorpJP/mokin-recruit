import React from 'react';

interface SectionBlockProps {
  children: React.ReactNode;
}

const SectionBlock: React.FC<SectionBlockProps> = ({ children }) => (
  <div style={{ marginBottom: 40 }}>{children}</div>
);

export default SectionBlock;
