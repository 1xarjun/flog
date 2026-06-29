import EditorToolbar from "./editor-toolbar";
import { type Editor as EditorType, EditorContent } from "@tiptap/react";
import type { Post } from "@/PostsN";
import { useNavigate } from "react-router";
import { useEditorInstance } from "@/context/constants";

export default function Editor({ replyTo = undefined }: { replyTo?: Post }) {
  const navigate = useNavigate();

  const editor = useEditorInstance();

  function handleReply(): void {
    throw new Error("Function not implemented.");
  }

  return (
    <div className="max-w-3xl max-h-[calc(100vh*1.2)] pb-10 flex flex-col gap-4 text-gray-700 pt-10">
      {replyTo && (
        <div className="flex flex-col gap-2 border rounded shadow-xs p-3 text-gray-500 text-sm bg-[#fbfbfb]">
          <p>
            Replying to{" "}
            <span className="text-violet-500">@{replyTo.user.username}</span>
          </p>
          <p className="max-h-14 line-clamp-4">{replyTo.description}</p>
        </div>
      )}
      <div className="border rounded shadow-xs overflow-hidden">
        <EditorToolbar editor={editor} />
        <EditorContent
          editor={editor as EditorType}
          className="text-sm bg-white"
        />
      </div>

      <div className="text-sm text-gray-700 flex justify-end gap-4">
        <button
          onClick={() => {
            if (window.history.length > 1) {
              navigate(-1); // take back to previous page
            } else {
              navigate("/");
            }
          }}
          className="px-3 py-2 rounded  hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={() => handleReply()}
          className="px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        >
          Post reply
        </button>
      </div>
    </div>
  );
}
