'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
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

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = '' }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto',
        },
      }),
      TableOfContents,
      TocTitle,
      TocItem,
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log('Generated HTML:', html);
      onChange(html);
    },
  });

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
    
    // HTMLでテーブルを作成して挿入
    let tableHtml = '<table class="media-table">';
    
    // ヘッダー行
    tableHtml += '<thead><tr>';
    for (let i = 0; i < numCols; i++) {
      tableHtml += '<th class="table-header-cell">カラム' + (i + 1) + '</th>';
    }
    tableHtml += '</tr></thead>';
    
    // データ行
    tableHtml += '<tbody>';
    for (let i = 0; i < numRows - 1; i++) {
      tableHtml += '<tr>';
      for (let j = 0; j < numCols; j++) {
        tableHtml += '<td class="table-cell">データ</td>';
      }
      tableHtml += '</tr>';
    }
    tableHtml += '</tbody>';
    
    tableHtml += '</table>';
    editor?.commands.insertContent(tableHtml);
  };

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-300 rounded-none">
      {/* ツールバー */}
      <div className="border-b border-gray-300 p-2 flex flex-wrap gap-1 bg-gray-50">
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bold') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 px-2"
        >
          B
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('italic') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 px-2"
        >
          I
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 px-2"
        >
          H2
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 px-2"
        >
          H3
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('bulletList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 px-2"
        >
          • List
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('orderedList') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 px-2"
        >
          1. List
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={addImage}
          className="h-8 px-2"
        >
          📷 画像
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={insertTable}
          className="h-8 px-2"
        >
          📋 テーブル
        </Button>
        <Button
          type="button"
          size="sm"
          variant={editor.isActive('blockquote') ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 px-2"
        >
          💬 引用
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 px-2"
        >
          ─ 区切り
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
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
          className="h-8 px-2"
        >
          📋 目次
        </Button>
      </div>

      {/* エディタエリア */}
      <div className="min-h-[400px] p-4">
        <EditorContent
          editor={editor}
          className="prose prose-lg max-w-none focus:outline-none media-content-editor"
          style={{
            fontFamily: 'Inter',
            fontSize: '16px',
            lineHeight: 1.6,
          }}
        />
      </div>

    </div>
  );
}