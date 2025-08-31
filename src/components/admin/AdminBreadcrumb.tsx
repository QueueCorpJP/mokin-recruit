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
import { PaginationArrow } from '@/components/svg/PaginationArrow';

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
  '/admin/candidate': '候補者一覧',
  '/admin/media': 'メディア記事一覧',
  '/admin/media/new': '新規記事作成',
  '/admin/media/edit': '記事編集',
  '/admin/media/preview': 'プレビュー',
  '/admin/media/edit/preview': 'プレビュー',
  '/admin/media/category': 'カテゴリ一覧',
  '/admin/media/tag': 'タグ一覧',
  '/admin/media/tag/new': 'タグ作成',
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
      let title = breadcrumbConfig[currentPath] || pathSegments[i];
      
      // 動的ルートのラベルを日本語化
      if (pathSegments[i] === 'block') {
        title = 'ブロック企業';
      } else if (pathSegments[i] === 'edit') {
        title = '編集';
      } else if (pathSegments[i] === 'confirm') {
        title = '確認';
      } else if (pathSegments[i] === 'new') {
        title = '新規登録';
      } else if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(pathSegments[i])) {
        // UUID形式の場合は「詳細」と表示
        title = '詳細';
      }
      
      // 全ての階層を表示
      breadcrumbs.push({
        href: currentPath,
        title,
        isLast,
      });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();
  
  // トップページ（/admin）の場合でも管理者トップを表示
  if (breadcrumbs.length === 0) {
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
                  <BreadcrumbPage 
                    className="font-bold text-[#333]"
                    style={{
                      fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                      fontWeight: 700
                    }}
                  >
                    {breadcrumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={breadcrumb.href}
                      className="font-bold text-[#333] hover:text-[#0f9058] transition-colors"
                      style={{
                        fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                        fontWeight: 700
                      }}
                    >
                      {breadcrumb.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <PaginationArrow direction="right" className="h-2 breadcrumb-arrow" />
                </BreadcrumbSeparator>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}