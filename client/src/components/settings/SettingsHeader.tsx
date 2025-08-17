'use client';

import React from 'react';
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
    <div className="bg-gradient-to-t from-[#17856f] to-[#229a4e] px-20 py-10">
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={index}>
            {index > 0 && (
              <ChevronRight className="w-3 h-3 text-white" />
            )}
            <span className="text-white text-sm font-bold tracking-[1.4px]">
              {item.label}
            </span>
          </React.Fragment>
        ))}
      </div>
      
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-8 h-8 flex items-center justify-center text-white">
            {icon}
          </div>
        )}
        <h1 className="text-white text-2xl font-bold tracking-[2.4px]">
          {title}
        </h1>
      </div>
    </div>
  );
}