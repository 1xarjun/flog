import EditorToolbar from "./editor-toolbar";
import { EditorContent } from "@tiptap/react";
import type { Editor as EditorType } from "@tiptap/react";
import { useEditorInstance } from "@/context/constants";

export default function Editor() {
  const editor = useEditorInstance();

  return (
    <div className="border rounded shadow-xs overflow-hidden">
      <EditorToolbar editor={editor} />
      <EditorContent
        editor={editor as EditorType}
        className="text-xs sm:text-sm bg-white"
      />
    </div>
  );
}
