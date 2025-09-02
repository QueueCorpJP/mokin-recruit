'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export const AdminFooter: React.FC = () => {
  return (
    <footer className="w-full flex justify-start items-center bg-[linear-gradient(83deg,_#198D76_0%,_#1CA74F_100%)] h-[48px] px-[40px]">
     <Image src="/images/logo-white.png" alt="footer" width={90} height={25} className="w-auto h-[25px]" loading="lazy" />
    </footer>
  );
};