'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/admin/ui/breadcrumb';
import { ChevronRightIcon } from 'lucide-react';

interface BreadcrumbConfig {
  [key: string]: string;
}

const breadcrumbConfig: BreadcrumbConfig = {
  '/admin': '管理者トップ',
  '/admin/job': '求人管理',
  '/admin/member': 'メンバー管理',
  '/admin/login': 'ログイン',
  '/admin/message': 'メッセージ管理',
  '/admin/company': '企業アカウント管理',
  '/admin/candidate': '候補者管理',
  '/admin/media': 'メディア管理',
  '/admin/notice': '運営からのお知らせ管理',
  '/admin/analytics': '分析',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  
  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [];
    
    let currentPath = '';
    
    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      const isLast = i === pathSegments.length - 1;
      const title = breadcrumbConfig[currentPath] || pathSegments[i];
      
      breadcrumbs.push({
        href: currentPath,
        title,
        isLast,
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <div className="w-full mb-6">
      <Breadcrumb>
        <BreadcrumbList className="flex flex-wrap gap-2 items-center">
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className="flex items-center gap-2">
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage className="font-bold text-[#333]">
                    {breadcrumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={breadcrumb.href}
                      className="font-bold text-[#333] hover:text-[#0f9058] transition-colors"
                    >
                      {breadcrumb.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRightIcon className="w-4 h-4 text-[#0f9058]" />
                </BreadcrumbSeparator>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}