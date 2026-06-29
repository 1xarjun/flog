import { type ReactNode } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import useStore from "@/store/useStore";
import { EditorContext } from "./constants";

export default function EditorProvider({ children }: { children: ReactNode }) {
  const content = useStore((s) => s.content); // subscribe this component to store.content and re-render if content changes
  const setContent = useStore((s) => s.actions.setContent);

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

  return (
    <EditorContext.Provider value={editor}>{children}</EditorContext.Provider>
  );
}
