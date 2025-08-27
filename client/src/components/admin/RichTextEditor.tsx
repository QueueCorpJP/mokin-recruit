'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { HardBreak } from '@tiptap/extension-hard-break';
import { Node, mergeAttributes } from '@tiptap/core';
import { Button } from '@/components/admin/ui/button';

// カスタム目次ノード
const TableOfContents = Node.create({
  name: 'tableOfContents',
  group: 'block',
  content: 'tocTitle tocItem*',
  atom: false,
  selectable: true,
  deletable: false,
  
  addKeyboardShortcuts() {
    return {
      'Delete': () => {
        const { selection } = this.editor.state;
        const { $anchor } = selection;
        
        // 目次ブロック全体を選択している場合のみ削除を防ぐ
        if ($anchor.parent.type.name === 'tableOfContents' && selection.empty && 
            $anchor.parentOffset === 0 && $anchor.parent.childCount === 1) {
          return true; // ブロック全体の削除を防ぐ
        }
        
        // 目次ノード自体が選択されている場合は削除を防ぐ
        if (selection.node && selection.node.type.name === 'tableOfContents') {
          return true;
        }
        
        return false; // テキスト削除は許可
      },
      'Backspace': () => {
        const { selection } = this.editor.state;
        const { $anchor } = selection;
        
        // 目次ブロック全体を選択している場合のみ削除を防ぐ
        if ($anchor.parent.type.name === 'tableOfContents' && selection.empty && 
            $anchor.parentOffset === 0) {
          return true; // ブロック全体の削除を防ぐ
        }
        
        // 目次ノード自体が選択されている場合は削除を防ぐ
        if (selection.node && selection.node.type.name === 'tableOfContents') {
          return true;
        }
        
        return false; // テキスト削除は許可
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
})

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
})

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
})

// カスタム引用ノード
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
})

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = '' }: RichTextEditorProps) {

  const editor = useEditor({
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
      console.log('Generated HTML:', html);
      onChange(html);
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [editor, content]);

  // 初期化時に目次を自動挿入
  useEffect(() => {
    if (editor && !content) {
      editor.commands.insertContent([
        {
          type: 'tableOfContents',
          content: [
            {
              type: 'tocTitle',
              content: [{ type: 'text', text: '目次' }],
            },
            {
              type: 'tocItem',
              content: [{ type: 'text', text: '項目1' }],
            },
            {
              type: 'tocItem',
              content: [{ type: 'text', text: '項目2' }],
            },
            {
              type: 'tocItem',
              content: [{ type: 'text', text: '項目3' }],
            },
          ],
        },
      ]);
    }
  }, [editor, content]);

  const addImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.multiple = true;
    
    input.onchange = async (e) => {
      const target = e.target as HTMLInputElement;
      const files = target.files;
      
      if (!files || files.length === 0) return;
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append('file', file);
        
        try {
          const response = await fetch('/api/upload-content-image', {
            method: 'POST',
            body: formData,
          });
          
          const result = await response.json();
          
          if (result.success && result.url) {
            const imageOrder = Date.now() + i;
            editor?.chain()
              .focus()
              .setImage({ 
                src: result.url
              })
              .run();
          } else {
            console.error('画像アップロードに失敗:', result.error);
            alert('画像のアップロードに失敗しました: ' + (result.error || '不明なエラー'));
          }
        } catch (error) {
          console.error('画像アップロードエラー:', error);
          alert('画像のアップロードに失敗しました');
        }
      }
    };
    
    input.click();
  };

  const insertTable = () => {
    const rows = window.prompt('行数を入力してください (デフォルト: 3)', '3');
    const cols = window.prompt('列数を入力してください (デフォルト: 3)', '3');
    
    const numRows = parseInt(rows || '3');
    const numCols = parseInt(cols || '3');
    
    if (numRows <= 0 || numCols <= 0) {
      alert('行数と列数は1以上の数値を入力してください');
      return;
    }
    
    editor?.chain().focus().insertTable({ rows: numRows, cols: numCols, withHeaderRow: true }).run();
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-none">
      {/* ツールバー */}
      <div className="bg-gray-100 border-b border-gray-300 p-2">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`inline-flex items-center justify-center w-8 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm font-medium ${
              editor.isActive('bold') ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="太字"
          >
            <strong>B</strong>
          </button>
          
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`inline-flex items-center justify-center w-8 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm font-medium italic ${
              editor.isActive('italic') ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="斜体"
          >
            I
          </button>

          <div className="w-px h-6 bg-gray-400 mx-1"></div>

          <button
            type="button"
            onClick={() => {
              // H2を適用またはトグル
              editor.chain().focus().toggleHeading({ level: 2 }).run();
            }}
            className={`inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm font-medium ${
              editor.isActive('heading', { level: 2 }) ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="見出し2"
          >
            H2
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm font-medium ${
              editor.isActive('heading', { level: 3 }) ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="見出し3"
          >
            H3
          </button>

          <div className="w-px h-6 bg-gray-400 mx-1"></div>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm ${
              editor.isActive('bulletList') ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="箇条書き"
          >
            リスト
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm ${
              editor.isActive('orderedList') ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="番号付きリスト"
          >
            番号リスト
          </button>

          <div className="w-px h-6 bg-gray-400 mx-1"></div>

          <button
            type="button"
            onClick={addImage}
            className="inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm"
            title="画像を追加"
          >
            画像
          </button>

          <button
            type="button"
            onClick={insertTable}
            className="inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm"
            title="テーブルを挿入"
          >
            テーブル
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm ${
              editor.isActive('blockquote') ? 'bg-gray-200 border-gray-500' : ''
            }`}
            title="監修者"
          >
            監修者
          </button>

          <div className="w-px h-6 bg-gray-400 mx-1"></div>

          <button
            type="button"
            onClick={() => {
              // テーブル内にカーソルがあるかチェック
              if (editor.isActive('table')) {
                editor.chain().focus().deleteTable().run();
              } else {
                // テーブルが選択されていない場合は、より積極的に削除を試みる
                const { state } = editor;
                const { selection } = state;
                
                // カーソル位置を調整してテーブル削除を試行
                editor.chain().focus().selectParentNode().deleteTable().run();
              }
            }}
            disabled={!editor.isActive('table')}
            className="inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="テーブル削除"
          >
            削除
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            disabled={!editor.isActive('table')}
            className="inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="行追加"
          >
            +行
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            disabled={!editor.isActive('table')}
            className="inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="行削除"
          >
            -行
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            disabled={!editor.isActive('table')}
            className="inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="列追加"
          >
            +列
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            disabled={!editor.isActive('table')}
            className="inline-flex items-center justify-center px-2 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            title="列削除"
          >
            -列
          </button>

          <div className="w-px h-6 bg-gray-400 mx-1"></div>

          <button
            type="button"
            onClick={() => {
              editor?.chain()
                .focus()
                .insertContent([
                  {
                    type: 'quote',
                    content: [
                      {
                        type: 'paragraph',
                        content: [{ type: 'text', text: '引用テキストがここに入ります。引用テキストが入ります。引用テキストが入ります。引用テキストが入ります。引用テキストが入ります。' }],
                      },
                    ],
                  },
                ])
                .run();
            }}
            className="inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm"
            title="引用を挿入"
          >
            引用
          </button>

          <button
            type="button"
            onClick={() => {
              editor?.chain()
                .focus()
                .insertContent([
                  {
                    type: 'tableOfContents',
                    content: [
                      {
                        type: 'tocTitle',
                        content: [{ type: 'text', text: '目次' }],
                      },
                      {
                        type: 'tocItem',
                        content: [{ type: 'text', text: '項目1' }],
                      },
                      {
                        type: 'tocItem',
                        content: [{ type: 'text', text: '項目2' }],
                      },
                      {
                        type: 'tocItem',
                        content: [{ type: 'text', text: '項目3' }],
                      },
                    ],
                  },
                ])
                .run();
            }}
            className="inline-flex items-center justify-center px-3 h-8 border border-gray-400 bg-white hover:bg-gray-50 rounded text-sm"
            title="目次を挿入"
          >
            目次
          </button>
        </div>
      </div>

      {/* エディタエリア */}
      <div className="min-h-[400px] p-4 overflow-hidden">
        <EditorContent
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