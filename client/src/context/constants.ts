import { createContext, useContext } from "react";
import type { Editor } from "@tiptap/react";

export const EditorContext = createContext<Editor | undefined>(undefined);

export function useEditorInstance() {
  return useContext(EditorContext);
}
