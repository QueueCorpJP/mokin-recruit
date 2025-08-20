'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useEffect } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';
import { Node, mergeAttributes } from '@tiptap/core';
import { Button } from '@/components/admin/ui/button';
import '@/styles/media-content.css';

// カスタム目次ノード
const TableOfContents = Node.create({
  name: 'tableOfContents',
  group: 'block',
  content: 'tocTitle tocItem*',
  
  parseHTML() {
    return [{
      tag: 'div.table-of-contents',
    }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['div', mergeAttributes(HTMLAttributes, { class: 'table-of-contents' }), 0]
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
  content: 'text*',

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
  console.log('=== RichTextEditor DEBUG ===');
  console.log('Received content:', content);
  console.log('Content has image variables?', content?.includes('{{image:'));
  console.log('Content has supabase URLs?', content?.includes('/storage/v1/object/public/blog/'));
  console.log('=========================');

  const editor = useEditor({
    extensions: [
      StarterKit,
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
      console.log('Updating editor content with:', content);
      editor.commands.setContent(content, false);
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
      <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('bold') ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('bold') ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('italic') ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('italic') ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => {
            // H2を適用またはトグル
            editor.chain().focus().toggleHeading({ level: 2 }).run();
          }}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('heading', { level: 2 }) ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('heading', { level: 2 }) ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('heading', { level: 3 }) ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('heading', { level: 3 }) ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('bulletList') ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('bulletList') ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          箇条書き
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('orderedList') ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('orderedList') ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          番号付き
        </button>
        <button
          type="button"
          onClick={addImage}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          画像
        </button>
        <button
          type="button"
          onClick={insertTable}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          テーブル
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors ${
            editor.isActive('blockquote') ? 'border-b-2 border-[#323232]' : ''
          }`}
          style={{
            borderBottom: editor.isActive('blockquote') ? '2px solid #323232' : 'none',
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          監修者
        </button>
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
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          テーブル削除
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          disabled={!editor.isActive('table')}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          行追加
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteRow().run()}
          disabled={!editor.isActive('table')}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
            borderRight: '1px solid #ddd'
          }}
        >
          行削除
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          disabled={!editor.isActive('table')}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            borderRight: '1px solid #ddd'
          }}
        >
          列追加
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().deleteColumn().run()}
          disabled={!editor.isActive('table')}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            borderRight: '1px solid #ddd'
          }}
        >
          列削除
        </button>
        <button
          type="button"
          onClick={() => {
            editor?.chain()
              .focus()
              .insertContent([
                {
                  type: 'quote',
                  content: [{ type: 'text', text: '引用テキストがここに入ります。引用テキストが入ります。引用テキストが入ります。引用テキストが入ります。引用テキストが入ります。' }],
                },
              ])
              .run();
          }}
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold',
            borderRight: '1px solid #ddd'
          }}
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
          className="h-8 px-3 bg-transparent border-0 text-[#323232] hover:text-[#000] transition-colors"
          style={{
            boxShadow: 'none',
            fontWeight: 'bold'
          }}
        >
          目次
        </button>
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