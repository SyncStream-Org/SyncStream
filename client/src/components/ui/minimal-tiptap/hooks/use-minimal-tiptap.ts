import * as React from "react"
import type { Editor } from "@tiptap/react"
import type { Content, UseEditorOptions } from "@tiptap/react"
import { StarterKit } from "@tiptap/starter-kit"
import { useEditor } from "@tiptap/react"
import { Typography } from "@tiptap/extension-typography"
import { Placeholder } from "@tiptap/extension-placeholder"
import { Underline } from "@tiptap/extension-underline"
import { TextStyle } from "@tiptap/extension-text-style"
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import {
  Link,
  Image,
  HorizontalRule,
  CodeBlockLowlight,
  Selection,
  Color,
  UnsetAllMarks,
  ResetMarksOnEnter,
  FileHandler,
} from "../extensions"
import { cn } from "@/utilities/utils"
import { fileToBase64, getOutput, randomId } from "../utils"
import { useThrottle } from "../hooks/use-throttle"
import { toast } from "sonner"
import { WebsocketProvider } from "y-websocket"
import * as Y from "yjs"

export interface UseMinimalTiptapEditorProps extends UseEditorOptions {
  value?: Content
  output?: "html" | "json" | "text"
  placeholder?: string
  editorClassName?: string
  throttleDelay?: number
  onUpdate?: (content: Content) => void
  onBlur?: (content: Content) => void
  provider: WebsocketProvider | null,
  ydoc: Y.Doc | null,
  username: string,
  color: string,
}

export const createExtensions = (
  placeholder: string, 
  provider: WebsocketProvider | null, 
  ydoc: Y.Doc | null, 
  username: string, 
  color: string,
) => {
  const baseExtensions = [
    StarterKit.configure({
      horizontalRule: false,
      codeBlock: false,
      paragraph: { HTMLAttributes: { class: "text-node" } },
      heading: { HTMLAttributes: { class: "heading-node" } },
      blockquote: { HTMLAttributes: { class: "block-node" } },
      bulletList: { HTMLAttributes: { class: "list-node" } },
      orderedList: { HTMLAttributes: { class: "list-node" } },
      code: { HTMLAttributes: { class: "inline", spellcheck: "false" } },
      dropcursor: { width: 2, class: "ProseMirror-dropcursor border" },
    }),
    Link,
    Underline,
    Image.configure({
      allowedMimeTypes: ["image/*"],
      maxFileSize: 5 * 1024 * 1024,
      allowBase64: true,
    }),
    Placeholder.configure({
      placeholder,
    }),
    Typography,
    TextStyle,
    HorizontalRule,
    Color,
    Selection,
    UnsetAllMarks,
    ResetMarksOnEnter,
    CodeBlockLowlight,
    ...(ydoc
      ? [
          Collaboration.configure({
            document: ydoc,
          }),
          CollaborationCursor.configure({
            provider,
            user: {
              name: username,
              color: color,
            },
          }),
        ]
      : []),
  ];
  
  return baseExtensions;
};

export const useMinimalTiptapEditor = ({
  value,
  output = "html",
  placeholder = "",
  editorClassName,
  throttleDelay = 0,
  onUpdate,
  onBlur,
  provider,
  ydoc,
  username,
  color,
  ...props
}: UseMinimalTiptapEditorProps) => {
  const throttledSetValue = useThrottle(
    (value: Content) => onUpdate?.(value),
    throttleDelay
  )

  const handleUpdate = React.useCallback(
    (editor: Editor) => throttledSetValue(getOutput(editor, output)),
    [output, throttledSetValue]
  )

  const handleCreate = React.useCallback(
    (editor: Editor) => {
      if (value && editor.isEmpty) {
        editor.commands.setContent(value)
      }
    },
    [value]
  )

  const handleBlur = React.useCallback(
    (editor: Editor) => onBlur?.(getOutput(editor, output)),
    [output, onBlur]
  )

  const editor = useEditor({
    extensions: createExtensions(placeholder, provider, ydoc, username, color),
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        class: cn("focus:outline-none", editorClassName),
      },
    },
    onUpdate: ({ editor }) => handleUpdate(editor),
    onCreate: ({ editor }) => handleCreate(editor),
    onBlur: ({ editor }) => handleBlur(editor),
    ...props,
  }, [ydoc, provider, username, color])

  return editor
}
