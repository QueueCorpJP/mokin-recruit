'use client';

import React, { useState, useEffect } from 'react';
import {
  TiptapEditor,
  TiptapEditorContent,
  TiptapStarterKit,
  TiptapImage,
  TiptapTable,
  TiptapTableRow,
  TiptapTableHeader,
  TiptapTableCell,
  TiptapHardBreak,
  TiptapCore
} from '@/lib/lazy-imports';

interface RichTextEditorDynamicProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditorDynamic({ content, onChange, placeholder = '' }: RichTextEditorDynamicProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [editor, setEditor] = useState<any>(null);

  useEffect(() => {
    // 動的インポートが完了するまで待つ
    const initializeEditor = async () => {
      try {
        const [
          { default: useEditor },
          StarterKit,
          Image,
          { default: Table },
          { default: TableRow },
          { default: TableHeader },
          { default: TableCell },
          { default: HardBreak },
          { Node, mergeAttributes }
        ] = await Promise.all([
          import('@tiptap/react').then(mod => ({ default: mod.useEditor })),
          import('@tiptap/starter-kit'),
          import('@tiptap/extension-image'),
          import('@tiptap/extension-table').then(mod => ({ default: mod.Table })),
          import('@tiptap/extension-table-row').then(mod => ({ default: mod.TableRow })),
          import('@tiptap/extension-table-header').then(mod => ({ default: mod.TableHeader })),
          import('@tiptap/extension-table-cell').then(mod => ({ default: mod.TableCell })),
          import('@tiptap/extension-hard-break').then(mod => ({ default: mod.HardBreak })),
          import('@tiptap/core').then(mod => ({ Node: mod.Node, mergeAttributes: mod.mergeAttributes }))
        ]);

        // カスタム目次ノード
        const TableOfContents = Node.create({
          name: 'tableOfContents',
          group: 'block',
          content: 'tocTitle tocItem*',
          atom: false,
          selectable: true,
          
          addKeyboardShortcuts() {
            return {
              'Delete': () => {
                const { selection } = this.editor.state;
                const { $anchor } = selection;
                
                if ($anchor.parent.type.name === 'tableOfContents' && selection.empty && 
                    $anchor.parentOffset === 0 && $anchor.parent.childCount === 1) {
                  return true;
                }
                
                const { $from, $to } = selection;
                if ($from.parent.type.name === 'tableOfContents' || $to.parent.type.name === 'tableOfContents') {
                  return true;
                }
                
                return false;
              },
              'Backspace': () => {
                const { selection } = this.editor.state;
                const { $anchor } = selection;
                
                if ($anchor.parent.type.name === 'tableOfContents' && selection.empty && 
                    $anchor.parentOffset === 0) {
                  return true;
                }
                
                const { $from, $to } = selection;
                if ($from.parent.type.name === 'tableOfContents' || $to.parent.type.name === 'tableOfContents') {
                  return true;
                }
                
                return false;
              }
            }
          },
          
          parseHTML() {
            return [{
              tag: 'div.table-of-contents',
            }]
          },

          renderHTML({ HTMLAttributes }) {
            return ['div', mergeAttributes(HTMLAttributes, { 
              class: 'table-of-contents fixed-toc',
              contenteditable: 'true'
            }), 0]
          },
        });

        const TocTitle = Node.create({
          name: 'tocTitle',
          group: 'block',
          content: 'text*',

          parseHTML() {
            return [{
              tag: 'div.toc-title',
            }]
          },

          renderHTML({ HTMLAttributes }) {
            return ['div', mergeAttributes(HTMLAttributes, { class: 'toc-title' }), 0]
          },
        });

        const TocItem = Node.create({
          name: 'tocItem',
          group: 'block',
          content: 'text*',

          parseHTML() {
            return [{
              tag: 'div.toc-item',
            }]
          },

          renderHTML({ HTMLAttributes }) {
            return ['div', mergeAttributes(HTMLAttributes, { class: 'toc-item' }), 0]
          },
        });

        const Quote = Node.create({
          name: 'quote',
          group: 'block',
          content: 'paragraph+',
          whitespace: 'pre',

          parseHTML() {
            return [{
              tag: 'div.quote-container',
            }]
          },

          renderHTML({ HTMLAttributes }) {
            return ['div', mergeAttributes(HTMLAttributes, { class: 'quote-container' }), 0]
          },
        });

        const editorInstance = useEditor({
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
                style: 'max-width: 100%; height: auto; display: block; border-radius: 24px; margin: 24px 0;',
              },
            }),
            Table.configure({
              resizable: true,
              allowTableNodeSelection: true,
              HTMLAttributes: {
                class: 'border-collapse border border-gray-300 w-full mb-4',
                style: 'max-width: 100%; table-layout: fixed; word-wrap: break-word;',
              },
            }),
            TableRow,
            TableHeader.configure({
              HTMLAttributes: {
                class: 'border border-gray-300 bg-gray-50 px-4 py-2 font-semibold',
                style: 'word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;',
              },
            }),
            TableCell.configure({
              HTMLAttributes: {
                class: 'border border-gray-300 px-4 py-2',
                style: 'word-wrap: break-word; overflow-wrap: break-word; word-break: break-word;',
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
        });

        setEditor(editorInstance);
        setIsLoaded(true);
      } catch (error) {
        console.error('TipTap editor initialization failed:', error);
      }
    };

    initializeEditor();
  }, []);

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  if (!isLoaded || !editor) {
    return (
      <div className="h-96 bg-gray-100 animate-pulse rounded flex items-center justify-center">
        <div className="text-gray-500">エディタを読み込み中...</div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-none">
      {/* 簡素化されたツールバー */}
      <div className="bg-gray-100 border-b border-gray-300 p-2">
        <div className="text-sm text-gray-600">
          リッチテキストエディタ (軽量版)
        </div>
      </div>

      {/* エディタエリア */}
      <div className="min-h-[400px] p-4 overflow-hidden">
        <TiptapEditorContent
          editor={editor}
          className="prose prose-lg max-w-none focus:outline-none media-content-editor overflow-hidden"
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