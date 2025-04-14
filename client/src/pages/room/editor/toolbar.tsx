import type { Editor } from '@tiptap/react';
import { Separator } from '@/components/ui/separator';
import { SectionOne } from '@/components/ui/minimal-tiptap/components/section/one';
import { SectionTwo } from '@/components/ui/minimal-tiptap/components/section/two';
import { SectionThree } from '@/components/ui/minimal-tiptap/components/section/three';
import { SectionFour } from '@/components/ui/minimal-tiptap/components/section/four';
import { SectionFive } from '@/components/ui/minimal-tiptap/components/section/five';
import '@/components/ui/minimal-tiptap/styles/index.css';

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
    <div className="shrink-0 overflow-x-auto border-b border-border p-2">
      <div className="flex w-max items-center gap-px">
        <SectionOne
          editor={editor}
          activeLevels={[1, 2, 3]}
          variant="outline"
        />

        <Separator orientation="vertical" className="mr-2 h-4" />

        <SectionTwo
          editor={editor}
          activeActions={[
            'italic',
            'bold',
            'underline',
            'code',
            'strikethrough',
            'clearFormatting',
          ]}
          mainActionCount={5}
          variant="outline"
        />

        <Separator orientation="vertical" className="mr-2 h-4" />

        <SectionThree editor={editor} variant="outline" />

        <Separator orientation="vertical" className="mr-2 h-4" />

        <SectionFour
          editor={editor}
          activeActions={['bulletList', 'orderedList']}
          mainActionCount={2}
          variant="outline"
        />

        <Separator orientation="vertical" className="mr-2 h-4" />

        <SectionFive
          editor={editor}
          activeActions={['blockquote', 'codeBlock', 'horizontalRule']}
          mainActionCount={3}
          variant="outline"
        />
      </div>
    </div>
  );
}
