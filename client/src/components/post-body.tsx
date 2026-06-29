import TextAlign from "@tiptap/extension-text-align";
import {
  Editor,
  EditorContent,
  useEditor,
  type JSONContent,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { CornerDownRight } from "lucide-react";
import { generateHTML } from "@tiptap/react";
import { Link } from "react-router";
import type { Post } from "@/PostsN";
import useStore from "@/store/useStore";

export default function PostBody({
  content,
  repliedTo,
}: {
  content?: JSONContent;
  repliedTo: Post | null | string;
}) {
  const currentPage = useStore((s) => s.currentPage);

  const editor = useEditor({
    editable: false,
    content: content,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        link: {
          openOnClick: true,
          defaultProtocol: "https",
        },
      }),

      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
  });

  return (
    <div className={`h-full flex flex-col ${repliedTo ? "gap-2" : ""} p-2.5`}>
      {repliedTo && (
        <Link
          // now here the it wouldnt be currentPage and i need to know the page of the post somehow
          to={`/?highlight=${repliedTo._id}&page=${repliedTo.pageNo}`}
          className="border rounded overflow-hidden"
        >
          <div className="p-3 flex gap-1 flex-col text-xs bg-[#fbfbfb] text-gray-500">
            <span className="font-medium [&_svg]:size-3 flex gap-1 items-center text-gray-700">
              <CornerDownRight />
              Replying to {repliedTo.author.username}
            </span>
            <div
              className="preview line-clamp-3"
              dangerouslySetInnerHTML={{
                __html: generateHTML(repliedTo.content as JSONContent, [
                  StarterKit,
                ]),
              }}
            ></div>{" "}
          </div>
        </Link>
      )}

      <EditorContent
        editor={editor as Editor}
        className="read-only text-sm bg-white"
      />
    </div>
  );
}
