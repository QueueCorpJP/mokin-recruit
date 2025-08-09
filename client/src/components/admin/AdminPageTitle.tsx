'use client';

import { usePathname } from 'next/navigation';

interface PageTitleConfig {
  [key: string]: string;
}

const pageTitleConfig: PageTitleConfig = {
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

export function AdminPageTitle() {
  const pathname = usePathname();
  
  // 現在のパスに対応するタイトルを取得
  const getPageTitle = () => {
    // 完全一致を先にチェック
    if (pageTitleConfig[pathname]) {
      return pageTitleConfig[pathname];
    }
    
    // 部分一致でチェック（サブページの場合）
    const segments = pathname.split('/').filter(segment => segment !== '');
    for (let i = segments.length; i > 0; i--) {
      const path = '/' + segments.slice(0, i).join('/');
      if (pageTitleConfig[path]) {
        return pageTitleConfig[path];
      }
    }
    
    // デフォルトタイトル
    return 'ページ';
  };

  const title = getPageTitle();

  return (
    <div className="mb-6">
      <h1 style={{
        color: '#000',
        fontFamily: 'Inter',
        fontSize: '32px',
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal'
      }}>
        {title}
      </h1>
    </div>
  );
}