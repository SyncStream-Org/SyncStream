import * as React from "react"
import type { Editor } from "@tiptap/react"
import type { FormatAction } from "../../types"
import type { toggleVariants } from "@/components/ui/toggle"
import type { VariantProps } from "class-variance-authority"
import {
  Undo,
  Redo,
} from "lucide-react"
import { ToolbarSection } from "../toolbar-section"

type UndoRedoAction = "undo" | "redo"
interface InsertElement extends FormatAction {
  value: UndoRedoAction
}

const formatActions: InsertElement[] = [
  {
    value: "undo",
    label: "Undo",
    icon: <Undo className="size-5" />,
    action: (editor) => editor.chain().focus().undo().run(),
    isActive: (editor) => false,
    canExecute: (editor) =>
      editor.can().chain().focus().undo().run(),
    shortcuts: ["mod", "z"],
  },
  {
    value: "redo",
    label: "Redo",
    icon: <Redo className="size-5" />,
    action: (editor) => editor.chain().focus().redo().run(),
    isActive: (editor) => false,
    canExecute: (editor) =>
      editor.can().chain().focus().redo().run(),
    shortcuts: ["mod", "shift", "z"],
  },
]

interface SectionSixProps extends VariantProps<typeof toggleVariants> {
  editor: Editor
}

export const SectionSix: React.FC<SectionSixProps> = ({
  editor,
  size,
  variant,
}) => {
  return (
    <>
      <ToolbarSection
        editor={editor}
        actions={formatActions}
        activeActions={['undo', 'redo']}
        mainActionCount={2}
        dropdownTooltip="Insert elements"
        size={size}
        variant={variant}
      />
    </>
  )
}

SectionSix.displayName = "SectionSix"

export default SectionSix
