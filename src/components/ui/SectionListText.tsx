import React from 'react';

interface SectionListTextProps {
  children: React.ReactNode;
}

const SectionListText: React.FC<SectionListTextProps> = ({ children }) => (
  <li
    style={{
      fontSize: 16,
      fontWeight: 500,
      lineHeight: '200%',
      marginBottom: 0,
      color: '#323232',
      listStyle: 'none',
      display: 'flex',
      alignItems: 'flex-start',
    }}
  >
    <span style={{ marginRight: 4 }}>・</span>
    {children}
  </li>
);

export default SectionListText;
