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
import { Toggle } from '@/components/ui/toggle';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

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
    <div className="flex flex-wrap items-center gap-2 p-2 border-b">
      {/* Heading controls */}
      <div className="flex">
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          aria-label="Toggle Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Toggle Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('heading', { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Toggle Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Text formatting controls */}
      <div className="flex">
        <Toggle
          size="sm"
          pressed={editor.isActive('bold')}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Toggle Bold"
        >
          <Bold className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('italic')}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Toggle Italic"
        >
          <Italic className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('code')}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          aria-label="Toggle Code"
        >
          <Code className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* List controls */}
      <div className="flex">
        <Toggle
          size="sm"
          pressed={editor.isActive('bulletList')}
          onPressedChange={() =>
            editor.chain().focus().toggleBulletList().run()
          }
          aria-label="Toggle Bullet List"
        >
          <List className="h-4 w-4" />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive('orderedList')}
          onPressedChange={() =>
            editor.chain().focus().toggleOrderedList().run()
          }
          aria-label="Toggle Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </Toggle>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Block controls */}
      <div className="flex">
        <Toggle
          size="sm"
          pressed={editor.isActive('blockquote')}
          onPressedChange={() =>
            editor.chain().focus().toggleBlockquote().run()
          }
          aria-label="Toggle Blockquote"
        >
          <Quote className="h-4 w-4" />
        </Toggle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="p-2 h-8 w-8"
          aria-label="Insert Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History controls */}
      <div className="flex">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={checkForUndo()}
          className="p-2 h-8 w-8"
          aria-label="Undo"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={checkForRedo()}
          className="p-2 h-8 w-8"
          aria-label="Redo"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
