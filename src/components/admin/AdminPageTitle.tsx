'use client';

import { usePathname } from 'next/navigation';
import { NewArticleButton } from './ui/NewArticleButton';
import { AdminButton } from './ui/AdminButton';

// Simple encryption helpers for sessionStorage.
async function encrypt(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  // For demonstration, a static key is used, replace with a secure key in production.
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode('a-very-secret-key-32b'), // Must be 16/24/32 bytes for AES
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    data
  );
  // Concatenate IV and encrypted data for storage
  const encArr = new Uint8Array(encrypted);
  const fullArr = new Uint8Array(iv.length + encArr.length);
  fullArr.set(iv, 0);
  fullArr.set(encArr, iv.length);
  return btoa(String.fromCharCode(...fullArr));
}

async function decrypt(stored: string): Promise<string> {
  const raw = Uint8Array.from(atob(stored), c => c.charCodeAt(0));
  const iv = raw.slice(0, 12);
  const data = raw.slice(12);
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode('a-very-secret-key-32b'),
    'AES-GCM',
    false,
    ['encrypt', 'decrypt']
  );
  const decrypted = await window.crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    keyMaterial,
    data
  );
  const decArr = new Uint8Array(decrypted);
  return new TextDecoder().decode(decArr);
}

interface ButtonConfig {
  text: string;
  variant: 'green-gradient' | 'green-outline';
  onClick: () => void;
}

interface PageConfig {
  title: string;
  buttons?: ButtonConfig[];
}

interface PageTitleConfig {
  [key: string]: PageConfig;
}

const pageTitleConfig: PageTitleConfig = {
  '/admin': { title: '' },
  '/admin/job': {
    title: '求人管理',
    buttons: [
      {
        text: '求人作成',
        variant: 'green-gradient',
        onClick: () => (window.location.href = '/admin/job/new'),
      },
    ],
  },
  '/admin/job/new': {
    title: '求人作成',
    buttons: [
      {
        text: '確認する',
        variant: 'green-outline',
        onClick: () => {
          console.log('AdminPageTitle: Dispatching job-new-back event');
          const event = new CustomEvent('job-new-back');
          window.dispatchEvent(event);
        },
      },
      {
        text: '保存',
        variant: 'green-gradient',
        onClick: () => {
          console.log('AdminPageTitle: Dispatching job-new-create event');
          const event = new CustomEvent('job-new-create');
          window.dispatchEvent(event);
        },
      },
    ],
  },
  '/admin/job/new/complete': { title: '求人作成完了' },
  '/admin/job/pending': {
    title: '承認待ち求人',
    buttons: [
      {
        text: 'CSVダウンロード',
        variant: 'green-outline',
        onClick: () => {
          console.log('AdminPageTitle: Dispatching pending-csv-download event');
          const event = new CustomEvent('pending-csv-download');
          window.dispatchEvent(event);
        },
      },
      {
        text: '一括承認',
        variant: 'green-gradient',
        onClick: () => {
          console.log('AdminPageTitle: Dispatching pending-bulk-approve event');
          const event = new CustomEvent('pending-bulk-approve');
          window.dispatchEvent(event);
        },
      },
    ],
  },
  '/admin/member': { title: 'メンバー管理' },
  '/admin/login': { title: 'ログイン' },
  '/admin/message': { title: 'メッセージ一覧' },
  '/admin/message/pending': { title: '確認が必要なメッセージ' },
  '/admin/message/ngword': {
    title: 'NGキーワード一覧',
    buttons: [
      {
        text: 'NGキーワード追加',
        variant: 'green-gradient',
        onClick: () => {
          window.dispatchEvent(new CustomEvent('add-ngkeyword-modal'));
        },
      },
    ],
  },
  '/admin/company': { title: '企業アカウント管理' },
  '/admin/candidate': { title: '候補者一覧' },
  '/admin/media': {
    title: 'メディア記事一覧',
    buttons: [
      {
        text: '新規記事追加',
        variant: 'green-gradient',
        onClick: () => (window.location.href = '/admin/media/new'),
      },
    ],
  },
  '/admin/media/new': {
    title: '新規記事追加',
    buttons: [
      {
        text: '下書き保存',
        variant: 'green-outline',
        onClick: () => window.dispatchEvent(new CustomEvent('draft-save')),
      },
      {
        text: '記事を確認する',
        variant: 'green-gradient',
        onClick: () => window.dispatchEvent(new CustomEvent('preview-click')),
      },
    ],
  },
  '/admin/media/edit': {
    title: '記事編集',
    buttons: [
      {
        text: '下書き保存',
        variant: 'green-outline',
        onClick: () => window.dispatchEvent(new CustomEvent('draft-save')),
      },
      {
        text: '記事を確認する',
        variant: 'green-gradient',
        onClick: () => window.dispatchEvent(new CustomEvent('preview-click')),
      },
    ],
  },
  '/admin/media/preview': {
    title: 'プレビュー',
    buttons: [
      {
        text: '編集に戻る',
        variant: 'green-outline',
        onClick: () => window.dispatchEvent(new CustomEvent('cancel-preview')),
      },
      {
        text: '記事を下書き保存',
        variant: 'green-gradient',
        onClick: () => window.dispatchEvent(new CustomEvent('save-draft')),
      },
      {
        text: '記事を投稿する',
        variant: 'green-gradient',
        onClick: () => window.dispatchEvent(new CustomEvent('publish-article')),
      },
    ],
  },
  '/admin/media/edit/preview': {
    title: '記事プレビュー',
    buttons: [
      {
        text: '編集に戻る',
        variant: 'green-outline',
        onClick: async () => {
          const previewDataString = sessionStorage.getItem('previewArticle');
          if (previewDataString) {
            try {
              const decryptedString = await decrypt(previewDataString);
              const previewData = JSON.parse(decryptedString);
              const statusSelect = document.querySelector(
                'input[name="status"]'
              ) as HTMLInputElement;
              const currentStatus = statusSelect?.value || 'DRAFT';
              const updatedData = { ...previewData, status: currentStatus };
              const encryptedData = await encrypt(JSON.stringify(updatedData));
              sessionStorage.setItem('previewArticle', encryptedData);

              window.location.href = `/admin/media/edit?id=${previewData.id}`;
            } catch (error) {
              console.error('Preview data parsing error:', error);
              window.location.href = '/admin/media/edit';
            }
          } else {
            window.location.href = '/admin/media/edit';
          }
        },
      },
      {
        text: '記事を保存/公開する',
        variant: 'green-gradient',
        onClick: () =>
          window.dispatchEvent(new CustomEvent('save-article-direct')),
      },
    ],
  },
  '/admin/media/category': {
    title: 'カテゴリ一覧',
    buttons: [
      {
        text: '新規カテゴリ追加',
        variant: 'green-gradient',
        onClick: () =>
          window.dispatchEvent(new CustomEvent('add-category-modal')),
      },
    ],
  },
  '/admin/media/tag': {
    title: 'タグ一覧',
    buttons: [
      {
        text: '新規タグ追加',
        variant: 'green-gradient',
        onClick: () => window.dispatchEvent(new CustomEvent('add-tag-modal')),
      },
    ],
  },
  '/admin/media/tag/new': { title: 'タグ作成' },
  '/admin/notice': { title: '運営からのお知らせ管理' },
  '/admin/analytics': { title: '分析' },
};

export function AdminPageTitle() {
  const pathname = usePathname();

  // console.log('AdminPageTitle: Current pathname:', pathname);

  // 現在のパスに対応する設定を取得
  const getPageConfig = (): PageConfig => {
    // 完全一致を先にチェック
    if (pageTitleConfig[pathname]) {
      return pageTitleConfig[pathname];
    }

    // 動的ルートのチェック
    if (pathname.match(/^\/admin\/message\/pending\/[\w-]+$/)) {
      return { title: 'メッセージ詳細' };
    }
    if (pathname.match(/^\/admin\/message\/[\w-]+$/)) {
      return { title: 'メッセージ詳細' };
    }

    if (pathname.match(/^\/admin\/job\/[^\/]+\/edit\/confirm$/)) {
      return { title: '求人編集完了' };
    }

    if (pathname.match(/^\/admin\/job\/[^\/]+\/edit$/)) {
      return {
        title: '求人詳細',
        buttons: [
          {
            text: '確認する',
            variant: 'green-gradient',
            onClick: () => {
              console.log('AdminPageTitle: Dispatching job-edit-update event');
              const event = new CustomEvent('job-edit-update');
              window.dispatchEvent(event);
            },
          },
        ],
      };
    }

    if (
      pathname.match(/^\/admin\/job\/[^\/]+$/) &&
      !pathname.includes('/edit')
    ) {
      return {
        title: '求人詳細',
        buttons: [
          {
            text: '編集する',
            variant: 'green-gradient',
            onClick: () => {
              const pathParts = pathname.split('/');
              const jobId = pathParts[pathParts.length - 1];
              window.location.href = `/admin/job/${jobId}/edit`;
            },
          },
        ],
      };
    }

    if (pathname.match(/^\/admin\/candidate\/[^\/]+\/deleted$/)) {
      return { title: '候補者消去完了' };
    }

    if (pathname.match(/^\/admin\/candidate\/[^\/]+\/block$/)) {
      return { title: 'ブロック企業追加' };
    }

    if (pathname.match(/^\/admin\/candidate\/[^\/]+\/edit$/)) {
      return { title: '候補者情報' };
    }
    if (pathname.match(/^\/admin\/candidate\/[^\/]+\/edit\/confirm$/)) {
      return { title: '候補者情報' };
    }
    if (pathname.match(/^\/admin\/candidate\/new\/confirm$/)) {
      return { title: '候補者情報追加確認' };
    }

    if (pathname.match(/^\/admin\/candidate\/new$/)) {
      return {
        title: '候補者情報追加',
        buttons: [
          {
            text: '下書き保存',
            variant: 'green-outline',
            onClick: () => {
              console.log(
                'AdminPageTitle: Dispatching candidate-new-draft event'
              );
              const event = new CustomEvent('candidate-new-draft');
              window.dispatchEvent(event);
            },
          },
          {
            text: '確認する',
            variant: 'green-gradient',
            onClick: () => {
              console.log(
                'AdminPageTitle: Dispatching candidate-new-confirm event'
              );
              const event = new CustomEvent('candidate-new-confirm');
              window.dispatchEvent(event);
            },
          },
        ],
      };
    }

    if (pathname.match(/^\/admin\/candidate\/[^\/]+$/)) {
      return {
        title: '候補者詳細',
        buttons: [
          {
            text: '候補者情報編集',
            variant: 'green-outline',
            onClick: () => {
              const pathParts = pathname.split('/');
              const candidateId = pathParts[pathParts.length - 1];
              window.location.href = `/admin/candidate/${candidateId}/edit`;
            },
          },

          {
            text: 'ブロック企業設定',
            variant: 'green-outline',
            onClick: () => {
              const pathParts = pathname.split('/');
              const candidateId = pathParts[pathParts.length - 1];
              window.location.href = `/admin/candidate/${candidateId}/block`;
            },
          },
          {
            text: '候補者情報削除',
            variant: 'green-outline',
            onClick: () => {
              console.log(
                'AdminPageTitle: Dispatching candidate-delete-modal event'
              );
              const event = new CustomEvent('candidate-delete-modal');
              window.dispatchEvent(event);
            },
          },
        ],
      };
    }

    if (pathname.match(/^\/admin\/media\/[^\/]+$/)) {
      return {
        title: '記事詳細',
        buttons: [
          {
            text: '編集',
            variant: 'green-gradient',
            onClick: () => {
              const pathParts = pathname.split('/');
              const mediaId = pathParts[pathParts.length - 1];
              window.location.href = `/admin/media/edit?id=${mediaId}`;
            },
          },
        ],
      };
    }

    // デフォルト
    return { title: 'ページ' };
  };

  const config = getPageConfig();
  // console.log('AdminPageTitle: Matched config:', config);

  // タイトルのスタイル
  const titleStyle = {
    color: '#323232',
    fontFamily: 'Inter',
    fontSize: '32px',
    fontStyle: 'normal' as const,
    fontWeight: 700,
    lineHeight: 'normal',
  };

  // ボタンがある場合は横並びレイアウト
  if (config.buttons && config.buttons.length > 0) {
    return (
      <div className='mb-6 flex justify-between items-center'>
        <h1 style={titleStyle}>{config.title}</h1>
        <div className='flex gap-4'>
          {config.buttons.map((button, index) => (
            <AdminButton
              key={index}
              onClick={button.onClick}
              text={button.text}
              variant={button.variant}
            />
          ))}
        </div>
      </div>
    );
  }

  // ボタンがない場合は通常のタイトルのみ
  return (
    <div className='mb-6'>
      <h1 style={titleStyle}>{config.title}</h1>
    </div>
  );
}
