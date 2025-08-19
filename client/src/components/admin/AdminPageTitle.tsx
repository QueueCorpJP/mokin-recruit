'use client';

import { usePathname } from 'next/navigation';
import { NewArticleButton } from './ui/NewArticleButton';
import { AdminButton } from './ui/AdminButton';

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
  '/admin/media': 'メディア記事一覧',
  '/admin/media/new': '新規記事追加',
  '/admin/media/edit': '記事編集',
  '/admin/media/preview': 'プレビュー',
  '/admin/media/edit/preview': '記事プレビュー',
  '/admin/media/category': 'カテゴリ一覧',
  '/admin/media/tag': 'タグ一覧',
  '/admin/media/tag/new': 'タグ作成',
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
    
    // 動的ルートのチェック
    if (pathname.match(/^\/admin\/media\/[^\/]+$/)) {
      return '記事詳細';
    }
    
    // デフォルトタイトル
    return 'ページ';
  };

  const title = getPageTitle();

  // Special cases with buttons - include buttons alongside title
  if (pathname === '/admin/media') {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          {title}
        </h1>
        <NewArticleButton />
      </div>
    );
  }

  if (pathname === '/admin/media/category') {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          {title}
        </h1>
        <AdminButton
          onClick={() => {
            const event = new CustomEvent('add-category-modal');
            window.dispatchEvent(event);
          }}
          text="新規カテゴリ追加"
          variant="green-gradient"
        />
      </div>
    );
  }

  if (pathname === '/admin/media/tag') {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          {title}
        </h1>
        <AdminButton
          onClick={() => {
            const event = new CustomEvent('add-tag-modal');
            window.dispatchEvent(event);
          }}
          text="新規タグ追加"
          variant="green-gradient"
        />
      </div>
    );
  }

  if (pathname === '/admin/media/new') {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          {title}
        </h1>
        <div className="flex gap-4">
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('draft-save');
              window.dispatchEvent(event);
            }}
            text="下書き保存"
            variant="green-outline"
          />
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('preview-click');
              window.dispatchEvent(event);
            }}
            text="記事を確認する"
            variant="green-gradient"
          />
        </div>
      </div>
    );
  }

  if (pathname === '/admin/media/edit' || pathname.match(/^\/admin\/media\/edit\//)) {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          {title}
        </h1>
        <div className="flex gap-4">
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('draft-save');
              window.dispatchEvent(event);
            }}
            text="下書き保存"
            variant="green-outline"
          />
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('preview-click');
              window.dispatchEvent(event);
            }}
            text="記事を確認する"
            variant="green-gradient"
          />
        </div>
      </div>
    );
  }

  if (pathname === '/admin/media/preview') {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          新規記事追加
        </h1>
        <div className="flex gap-4">
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('cancel-preview');
              window.dispatchEvent(event);
            }}
            text="戻る"
            variant="green-outline"
          />
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('save-draft');
              window.dispatchEvent(event);
            }}
            text="記事を下書き保存"
            variant="green-gradient"
          />
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('publish-article');
              window.dispatchEvent(event);
            }}
            text="記事を投稿する"
            variant="green-gradient"
          />
        </div>
      </div>
    );
  }

  if (pathname.match(/^\/admin\/media\/edit\/preview$/)) {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          記事プレビュー
        </h1>
        <div className="flex gap-4">
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('back-to-edit');
              window.dispatchEvent(event);
            }}
            text="戻る"
            variant="green-outline"
          />
          <AdminButton
            onClick={() => {
              const event = new CustomEvent('save-article');
              window.dispatchEvent(event);
            }}
            text="記事を保存/公開する"
            variant="green-gradient"
          />
        </div>
      </div>
    );
  }

  if (pathname.match(/^\/admin\/media\/[^\/]+$/)) {
    return (
      <div className="mb-6 flex justify-between items-center">
        <h1 style={{
          color: '#323232',
          fontFamily: 'Inter',
          fontSize: '32px',
          fontStyle: 'normal',
          fontWeight: 700,
          lineHeight: 'normal'
        }}>
          {title}
        </h1>
        <div className="flex gap-4">
          <AdminButton
            onClick={() => {
              const pathParts = pathname.split('/');
              const mediaId = pathParts[pathParts.length - 1];
              window.location.href = `/admin/media/edit?id=${mediaId}`;
            }}
            text="編集"
            variant="green-gradient"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h1 style={{
        color: '#323232',
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