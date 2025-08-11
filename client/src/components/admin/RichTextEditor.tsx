'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { Button } from '@/components/admin/ui/button';

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
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = () => {
    const url = window.prompt('画像URLを入力してください');
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const insertTable = () => {
    // Table functionality will be added later
    const tableHtml = '<table><tr><th>Header 1</th><th>Header 2</th><th>Header 3</th></tr><tr><td>Cell 1</td><td>Cell 2</td><td>Cell 3</td></tr></table>';
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
          variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 px-2"
        >
          H1
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
          variant="outline"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 px-2"
        >
          ─ 区切り
        </Button>
      </div>

      {/* エディタエリア */}
      <div className="min-h-[400px] p-4">
        <EditorContent
          editor={editor}
          className="prose prose-lg max-w-none focus:outline-none"
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