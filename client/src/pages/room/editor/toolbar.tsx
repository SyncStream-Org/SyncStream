import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo,
  Quote,
  Minus,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const checkForUndo = () => {
    return !editor?.can()?.chain()?.undo()?.run();
  };

  const checkForRedo = () => {
    return !editor?.can()?.chain()?.redo()?.run();
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`p-2 rounded ${
          editor.isActive('heading', { level: 1 })
            ? 'bg-gray-200 dark:bg-gray-600'
            : ''
        }`}
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`p-2 rounded ${
          editor.isActive('heading', { level: 2 })
            ? 'bg-gray-200 dark:bg-gray-600'
            : ''
        }`}
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={`p-2 rounded ${
          editor.isActive('heading', { level: 3 })
            ? 'bg-gray-200 dark:bg-gray-600'
            : ''
        }`}
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded ${
          editor.isActive('bold') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded ${
          editor.isActive('italic') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded ${
          editor.isActive('code') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded ${
          editor.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded ${
          editor.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded ${
          editor.isActive('blockquote') ? 'bg-gray-200 dark:bg-gray-600' : ''
        }`}
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
        className="p-2 rounded"
      >
        <Minus className="w-4 h-4" />
      </button>

      <div className="ml-auto flex items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={checkForUndo()}
          className="p-2 rounded disabled:opacity-50"
        >
          <Undo className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={checkForRedo()}
          className="p-2 rounded disabled:opacity-50"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
