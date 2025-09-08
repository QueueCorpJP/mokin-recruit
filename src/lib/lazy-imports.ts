import dynamic from 'next/dynamic';

// Tiptap関連を遅延読み込み（記事作成・編集時のみ必要）
// Note: useEditor is a hook and cannot be dynamically imported
export { useEditor } from '@tiptap/react';

export const TiptapEditorContent = dynamic(
  () => import('@tiptap/react').then(mod => ({ default: mod.EditorContent })),
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
  () => import('@tiptap/extension-table').then(mod => ({ default: mod.Table })),
  { ssr: false }
);

export const TiptapTableRow = dynamic(
  () => import('@tiptap/extension-table-row').then(mod => ({ default: mod.TableRow })),
  { ssr: false }
);

export const TiptapTableHeader = dynamic(
  () => import('@tiptap/extension-table-header').then(mod => ({ default: mod.TableHeader })),
  { ssr: false }
);

export const TiptapTableCell = dynamic(
  () => import('@tiptap/extension-table-cell').then(mod => ({ default: mod.TableCell })),
  { ssr: false }
);

export const TiptapHardBreak = dynamic(
  () => import('@tiptap/extension-hard-break').then(mod => ({ default: mod.HardBreak })),
  { ssr: false }
);

export const TiptapCore = dynamic(
  () => import('@tiptap/core').then(mod => ({ Node: mod.Node, mergeAttributes: mod.mergeAttributes })),
  { ssr: false }
);

// その他の重いコンポーネント
// RichTextEditor自体も動的インポート
export const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditorDynamic').then(mod => ({ default: mod.RichTextEditorDynamic })),
  { 
    ssr: false, 
    loading: () => {
      const React = require('react');
      return React.createElement('div', {
        className: 'h-96 bg-gray-100 animate-pulse rounded flex items-center justify-center'
      }, React.createElement('span', {
        className: 'text-gray-500'
      }, 'エディタを読み込み中...'));
    }
  }
);