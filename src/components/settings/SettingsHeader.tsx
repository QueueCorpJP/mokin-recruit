'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SettingsHeaderProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  icon?: React.ReactNode;
}

export function SettingsHeader({ breadcrumbs, title, icon }: SettingsHeaderProps) {
  return (
    <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-4 md:px-20 py-6 md:py-10">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {breadcrumbs?.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-white" />
            )}
            {item.href ? (
              <Link 
                href={item.href}
                className="text-white text-xs md:text-sm font-bold tracking-[1.2px] md:tracking-[1.4px] hover:text-white/80 transition-colors cursor-pointer"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-white text-xs md:text-sm font-bold tracking-[1.2px] md:tracking-[1.4px]">
                {item.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center gap-3 md:gap-4">
        {icon && (
          <div className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <h1 className="text-white text-lg md:text-2xl font-bold tracking-[1.8px] md:tracking-[2.4px]">
          {title}
        </h1>
      </div>
    </div>
  );
}