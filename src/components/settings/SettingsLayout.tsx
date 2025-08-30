import React from 'react';
import { SettingsBreadcrumb } from './SettingsBreadcrumb';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface SettingsLayoutProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  children: React.ReactNode;
}

export function SettingsLayout({ breadcrumbs, title, children }: SettingsLayoutProps) {
  return (
    <>
      <SettingsBreadcrumb items={breadcrumbs} title={title} />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </>
  );
}