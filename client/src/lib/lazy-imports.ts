import dynamic from 'next/dynamic';

// Tiptap関連を遅延読み込み（記事作成・編集時のみ必要）
export const TiptapEditor = dynamic(
  () => import('@tiptap/react').then(mod => ({ default: mod.useEditor })),
  { ssr: false }
);

export const TiptapStarterKit = dynamic(
  () => import('@tiptap/starter-kit'),
  { ssr: false }
);

export const TiptapImage = dynamic(
  () => import('@tiptap/extension-image'),
  { ssr: false }
);

export const TiptapTable = dynamic(
  () => import('@tiptap/extension-table'),
  { ssr: false }
);

export const TiptapTableRow = dynamic(
  () => import('@tiptap/extension-table-row'),
  { ssr: false }
);

export const TiptapTableHeader = dynamic(
  () => import('@tiptap/extension-table-header'),
  { ssr: false }
);

export const TiptapTableCell = dynamic(
  () => import('@tiptap/extension-table-cell'),
  { ssr: false }
);

// React Query Devtools（開発環境のみ）
export const ReactQueryDevtools = dynamic(
  () => import('@tanstack/react-query-devtools').then(mod => ({ default: mod.ReactQueryDevtools })),
  { 
    ssr: false,
    loading: () => null,
  }
);

// その他の重いコンポーネント
export const StagewiseToolbar = dynamic(
  () => import('@stagewise-plugins/react'),
  { ssr: false }
);