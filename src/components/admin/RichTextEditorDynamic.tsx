'use client';

import React, { useState, useEffect } from 'react';
import { useEditor } from '@tiptap/react';
import dynamic from 'next/dynamic';

// 必要なものだけを動的 import し、型は利用側で付与
const TiptapEditorContent = dynamic(
  () => import('@tiptap/react').then(mod => ({ default: mod.EditorContent })),
  { ssr: false }
);

interface RichTextEditorDynamicProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditorDynamic({
  content,
  onChange,
  placeholder = '',
}: RichTextEditorDynamicProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [editorConfig, setEditorConfig] = useState<any>(null);

  const editor = useEditor(editorConfig, [editorConfig]);

  useEffect(() => {
    // 動的インポートが完了するまで待つ
    const initializeEditor = async () => {
      try {
        const [
          { useEditor },
          starterKitModule,
          imageModule,
          { Table },
          { TableRow },
          { TableHeader },
          { TableCell },
          { HardBreak },
          { Node, mergeAttributes },
        ] = await Promise.all([
          import('@tiptap/react'),
          import('@tiptap/starter-kit'),
          import('@tiptap/extension-image'),
          import('@tiptap/extension-table'),
          import('@tiptap/extension-table-row'),
          import('@tiptap/extension-table-header'),
          import('@tiptap/extension-table-cell'),
          import('@tiptap/extension-hard-break'),
          import('@tiptap/core'),
        ]);

        const StarterKit =
          (starterKitModule as any).default ?? starterKitModule;
        const Image = (imageModule as any).default ?? imageModule;

        // カスタム目次ノード
        const TableOfContents = Node.create({
          name: 'tableOfContents',
          group: 'block',
          content: 'tocTitle tocItem*',
          atom: false,
          selectable: true,

          addKeyboardShortcuts() {
            return {
              Delete: () => {
                const { selection } = this.editor.state;
                const { $anchor } = selection;

                if (
                  $anchor.parent.type.name === 'tableOfContents' &&
                  selection.empty &&
                  $anchor.parentOffset === 0 &&
                  $anchor.parent.childCount === 1
                ) {
                  return true;
                }

                const { $from, $to } = selection;
                if (
                  $from.parent.type.name === 'tableOfContents' ||
                  $to.parent.type.name === 'tableOfContents'
                ) {
                  return true;
                }

                return false;
              },
              Backspace: () => {
                const { selection } = this.editor.state;
                const { $anchor } = selection;

                if (
                  $anchor.parent.type.name === 'tableOfContents' &&
                  selection.empty &&
                  $anchor.parentOffset === 0
                ) {
                  return true;
                }

                const { $from, $to } = selection;
                if (
                  $from.parent.type.name === 'tableOfContents' ||
                  $to.parent.type.name === 'tableOfContents'
                ) {
                  return true;
                }

                return false;
              },
            };
          },

          parseHTML() {
            return [
              {
                tag: 'div.table-of-contents',
              },
            ];
          },

          renderHTML({ HTMLAttributes }) {
            return [
              'div',
              mergeAttributes(HTMLAttributes, {
                class: 'table-of-contents fixed-toc',
                contenteditable: 'true',
              }),
              0,
            ];
          },
        });

        const TocTitle = Node.create({
          name: 'tocTitle',
          group: 'block',
          content: 'text*',

          parseHTML() {
            return [
              {
                tag: 'div.toc-title',
              },
            ];
          },

          renderHTML({ HTMLAttributes }) {
            return [
              'div',
              mergeAttributes(HTMLAttributes, { class: 'toc-title' }),
              0,
            ];
          },
        });

        const TocItem = Node.create({
          name: 'tocItem',
          group: 'block',
          content: 'text*',

          parseHTML() {
            return [
              {
                tag: 'div.toc-item',
              },
            ];
          },

          renderHTML({ HTMLAttributes }) {
            return [
              'div',
              mergeAttributes(HTMLAttributes, { class: 'toc-item' }),
              0,
            ];
          },
        });

        const Quote = Node.create({
          name: 'quote',
          group: 'block',
          content: 'paragraph+',
          whitespace: 'pre',

          parseHTML() {
            return [
              {
                tag: 'div.quote-container',
              },
            ];
          },

          renderHTML({ HTMLAttributes }) {
            return [
              'div',
              mergeAttributes(HTMLAttributes, { class: 'quote-container' }),
              0,
            ];
          },
        });

        const editorConfig = {
          extensions: [
            StarterKit,
            HardBreak.configure({
              keepMarks: true,
              HTMLAttributes: {
                class: 'hard-break',
              },
            }),
            Image.configure({
              inline: false,
              allowBase64: true,
              HTMLAttributes: {
                class: 'max-w-full h-auto',
                style:
                  'max-width: 100%; height: auto; display: block; border-radius: 24px; margin: 24px 0;',
              },
            }),
            Table.configure({
              resizable: true,
              allowTableNodeSelection: true,
              HTMLAttributes: {
                class: 'border-collapse border border-gray-300 w-full mb-4',
                style:
                  'max-width: 100%; table-layout: fixed; word-wrap: break-word;',
              },
            }),
            TableRow,
            TableHeader.configure({
              HTMLAttributes: {
                class:
                  'border border-gray-300 bg-gray-50 px-4 py-2 font-semibold',
                style:
                  'word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;',
              },
            }),
            TableCell.configure({
              HTMLAttributes: {
                class: 'border border-gray-300 px-4 py-2',
                style:
                  'word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;',
              },
            }),
            TableOfContents,
            TocTitle,
            TocItem,
            Quote,
          ],
          content,
          immediatelyRender: false,
          onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
          },
        };

        setEditorConfig(editorConfig);
        setIsLoaded(true);
      } catch (error) {
        console.error('TipTap editor initialization failed:', error);
      }
    };

    initializeEditor();
  }, [content, onChange]);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!isLoaded || !editor) {
    return (
      <div className='h-96 bg-gray-100 animate-pulse rounded flex items-center justify-center'>
        <div className='text-gray-500'>エディタを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className='border border-gray-300 rounded-none'>
      {/* 簡素化されたツールバー */}
      <div className='bg-gray-100 border-b border-gray-300 p-2'>
        <div className='text-sm text-gray-600'>
          リッチテキストエディタ (軽量版)
        </div>
      </div>

      {/* エディタエリア */}
      <div className='min-h-[400px] p-4 overflow-hidden'>
        <TiptapEditorContent
          editor={editor}
          className='prose prose-lg max-w-none focus:outline-none media-content-editor overflow-hidden'
          style={{
            fontFamily: 'Inter',
            fontSize: '16px',
            lineHeight: 1.8,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            wordBreak: 'break-word',
            maxWidth: '100%',
            width: '100%',
          }}
        />
      </div>
    </div>
  );
}
