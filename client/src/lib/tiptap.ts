import { useEditor } from "@tiptap/react";
import type { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { useState } from "react";

export default function useTiptap() {
  const [content, setContent] = useState<JSONContent>();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: true,
          autolink: true,
          linkOnPaste: true,
          defaultProtocol: "https",
        },
      }),

      Placeholder.configure({
        placeholder: "Type here to get started...",
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content,
    immediatelyRender: true,
    onUpdate: ({ editor }) => setContent(editor.getJSON()),
  });

  return { editor };
}
