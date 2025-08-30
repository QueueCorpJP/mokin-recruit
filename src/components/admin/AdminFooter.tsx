'use client';

import React from 'react';
import Link from 'next/link';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="w-full flex justify-start items-center bg-[linear-gradient(83deg,_#198D76_0%,_#1CA74F_100%)] h-[48px] px-[40px]">
     <img src="/images/logo-white.png" alt="footer" className="w-auto h-[25px]"/>
    </footer>
  );
};