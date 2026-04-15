"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RichEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

export function RichEditor({
  content,
  onChange,
  placeholder = "Start writing...",
  minHeight = 300,
}: RichEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-[#1A6B7A] underline" },
      }),
      Image,
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: {
        class:
          "prose prose-resort max-w-none focus:outline-none px-5 py-4 bg-white text-[#0B1B22]",
        style: `min-height: ${minHeight}px`,
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return (
      <div
        className="bg-white border border-[#0B1B22]/15"
        style={{ minHeight: minHeight + 50 }}
      />
    );
  }

  const btnCls = (active: boolean) =>
    cn(
      "p-2 transition-colors",
      active
        ? "bg-[#0B1B22] text-[#F5EFE3]"
        : "text-[#0B1B22]/70 hover:bg-[#0B1B22]/5"
    );

  return (
    <div className="border border-[#0B1B22]/15 bg-white">
      <div className="flex items-center gap-1 border-b border-[#0B1B22]/10 p-1.5 bg-[#F5EFE3]/50 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={btnCls(editor.isActive("bold"))}
          aria-label="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={btnCls(editor.isActive("italic"))}
          aria-label="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[#0B1B22]/15 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={btnCls(editor.isActive("heading", { level: 2 }))}
          aria-label="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={btnCls(editor.isActive("heading", { level: 3 }))}
          aria-label="Heading 3"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[#0B1B22]/15 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={btnCls(editor.isActive("bulletList"))}
          aria-label="Bullet list"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={btnCls(editor.isActive("orderedList"))}
          aria-label="Ordered list"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={btnCls(editor.isActive("blockquote"))}
          aria-label="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-[#0B1B22]/15 mx-1" />
        <button
          type="button"
          onClick={() => {
            const url = prompt("Enter URL");
            if (url) {
              editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            } else {
              editor.chain().focus().unsetLink().run();
            }
          }}
          className={btnCls(editor.isActive("link"))}
          aria-label="Insert link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }}
          className={btnCls(false)}
          aria-label="Insert image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>
        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className={btnCls(false)}
            aria-label="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className={btnCls(false)}
            aria-label="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
