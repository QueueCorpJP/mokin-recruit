'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
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
  '/admin': '管理画面トップページ',
  '/admin/analytics': '分析',
  '/admin/article': '記事管理',
  '/admin/auth': '認証',
  '/admin/auth/login': 'ログイン',
  '/admin/candidate': '候補者一覧',
  '/admin/candidate/new': '候補者新規登録',
  '/admin/candidate/new/confirm': '候補者登録確認',
  '/admin/company': '企業アカウント管理',
  '/admin/company/debug-company': '企業デバッグ',
  '/admin/company/delete': '企業削除',
  '/admin/company/edit': '企業編集',
  '/admin/company/group': '企業グループ',
  '/admin/company/new': '企業新規登録',
  '/admin/company/new/confirm': '企業登録確認',
  '/admin/company/user': '企業ユーザー',
  '/admin/company/withdraw': '企業退会',
  '/admin/industry': 'オリジナル業種一覧',
  '/admin/industry/delete-complete': 'オリジナル業種一覧',
  '/admin/job': '求人一覧',
  '/admin/job/new': '新規求人作成',
  '/admin/job/new/confirm': '求人作成確認',
  '/admin/job/pending': '求人承認待ち',
  '/admin/job/pending/complete': '承認完了',
  '/admin/login': 'ログイン',
  '/admin/media': 'メディア記事一覧',
  '/admin/media/category': 'カテゴリ一覧',
  '/admin/media/edit': '記事編集',
  '/admin/media/edit/preview': 'プレビュー',
  '/admin/media/new': '新規記事作成',
  '/admin/media/preview': 'プレビュー',
  '/admin/media/tag': 'タグ一覧',
  '/admin/media/tag/new': 'タグ作成',
  '/admin/member': 'メンバー管理',
  '/admin/message': 'メッセージ管理',
  '/admin/message/ngword': 'NGワード管理',
  '/admin/message/pending': 'メッセージ承認待ち',
  '/admin/message-moderation': 'メッセージモデレーション',
  '/admin/message-moderation/ng-keywords': 'NGキーワード管理',
  '/admin/notice': '運営からのお知らせ管理',
  '/admin/notice/edit': 'お知らせ編集',
  '/admin/notice/edit/preview': 'プレビュー',
  '/admin/notice/new': '新規お知らせ作成',
  '/admin/notice/preview': 'プレビュー',
};

export function AdminBreadcrumb() {
  const pathname = usePathname();
  const [jobTitle, setJobTitle] = useState<string>('');

  // 求人詳細ページの場合、windowオブジェクトから求人タイトルを取得
  useEffect(() => {
    const jobIdMatch = pathname.match(/^\/admin\/job\/([^\/]+)$/);
    if (jobIdMatch) {
      // windowオブジェクトに設定された求人タイトルを取得
      const title = (window as any).jobTitle;
      if (title) {
        setJobTitle(title);
      }
    } else {
      // 他のページの場合はタイトルをクリア
      setJobTitle('');
    }
  }, [pathname]);

  const generateBreadcrumbs = () => {
    const pathSegments = pathname.split('/').filter(segment => segment !== '');
    const breadcrumbs = [];

    let currentPath = '';

    for (let i = 0; i < pathSegments.length; i++) {
      currentPath += `/${pathSegments[i]}`;
      const isLast = i === pathSegments.length - 1;
      let title: string;
      const hasMapping = Object.prototype.hasOwnProperty.call(
        breadcrumbConfig,
        currentPath
      );

      if (hasMapping) {
        title = breadcrumbConfig[currentPath];
      } else {
        // 動的ルートのラベルを日本語化（マッピングがない場合のみ適用）
        if (pathSegments[i] === 'block') {
          title = 'ブロック企業';
        } else if (pathSegments[i] === 'edit') {
          title = '編集';
        } else if (pathSegments[i] === 'confirm') {
          title = '確認';
        } else if (pathSegments[i] === 'new') {
          title = '新規登録';
        } else if (
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            pathSegments[i]
          )
        ) {
          // UUID形式で求人詳細ページの場合は求人タイトルを表示
          if (currentPath.startsWith('/admin/job/') && jobTitle) {
            title = jobTitle;
          } else {
            title = '詳細';
          }
        } else {
          title = pathSegments[i];
        }
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

  // トップページ（/admin）の場合の処理
  if (breadcrumbs.length === 0) {
    return null;
  }

  return (
    <div className='w-full mb-6'>
      <Breadcrumb>
        <BreadcrumbList className='flex flex-wrap gap-2 items-center'>
          {breadcrumbs.map((breadcrumb, index) => (
            <div key={breadcrumb.href} className='flex items-center gap-2'>
              <BreadcrumbItem>
                {breadcrumb.isLast ? (
                  <BreadcrumbPage
                    className='font-bold text-[#333]'
                    style={{
                      fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                      fontWeight: 700,
                    }}
                  >
                    {breadcrumb.title}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={breadcrumb.href}
                      className='font-bold text-[#333] hover:text-[#0f9058] transition-colors'
                      style={{
                        fontFamily: 'Inter, "Noto Sans JP", sans-serif',
                        fontWeight: 700,
                      }}
                    >
                      {breadcrumb.title}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <PaginationArrow
                    direction='right'
                    className='h-2 breadcrumb-arrow'
                  />
                </BreadcrumbSeparator>
              )}
            </div>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
