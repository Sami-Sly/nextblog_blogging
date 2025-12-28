

"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image"; // 👈 import Image extension

interface RichTextProps {
  content: string | Record<string, any>;
}

export default function RichTextViewer({ content }: RichTextProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true, // optional: renders image inline with text
        allowBase64: false, // set to true only if you use base64 images (not recommended for UploadThing)
      }),
    ],
    content: content,
    editable: false,
    immediatelyRender: false,
  });

  if (!editor) return null;

  return <EditorContent editor={editor} />;
}