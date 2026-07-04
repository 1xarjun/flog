import type { Editor } from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  Code,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  ItalicIcon,
  LinkIcon,
  ListIcon,
  ListOrderedIcon,
  QuoteIcon,
  RedoIcon,
  StrikethroughIcon,
  UnderlineIcon,
  UndoIcon,
  UnlinkIcon,
} from "lucide-react";

export default function EditorToolbar({ editor }: { editor?: Editor }) {
  function handleLink() {
    const link = editor?.getAttributes("link").href;
    if (link) {
      editor?.chain().focus().unsetLink().run();
    } else {
      const url = prompt("Enter your url: ");
      if (!url) return;
      const valid = new URL(url);
      if (!valid) return alert("URL is not valid");
      editor
        ?.chain()
        .focus()
        .toggleLink({
          href: valid.href,
          target: "_blank",
          rel: "noopener noreferrer",
        })
        .run();
    }
  }

  return (
    <div className="flex gap-1 overflow-x-auto border-b p-2 items-center [&_svg]:size-3 sm:[&_svg]:size-4 bg-[#fbfbfb]">
      <div className="flex gap-1">
        <button
          title="Bold"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("bold") ? "bg-gray-200" : ""}`}
        >
          <BoldIcon />
        </button>
        <button
          title="Italic"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("italic") ? "bg-gray-200" : ""}`}
        >
          <ItalicIcon />
        </button>
        <button
          title="Underline"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("underline") ? "bg-gray-200" : ""}`}
        >
          <UnderlineIcon />
        </button>
        <button
          title="Strikethrough"
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("strike") ? "bg-gray-200" : ""}`}
        >
          <StrikethroughIcon />
        </button>
        <button
          title="Code"
          onClick={() => editor?.chain().focus().toggleCode().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("code") ? "bg-gray-200" : ""}`}
        >
          <Code />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      <div className="flex gap-1">
        <button
          title="Heading 1"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""}`}
        >
          <Heading1Icon />
        </button>
        <button
          title="Heading 2"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""}`}
        >
          <Heading2Icon />
        </button>
        <button
          title="Heading 3"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("heading", { level: 3 }) ? "bg-gray-200" : ""}`}
        >
          <Heading3Icon />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      <div className="flex gap-1">
        <button
          title="Bullet List"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("bulletList") ? "bg-gray-200" : ""}`}
        >
          <ListIcon />
        </button>
        <button
          title="Ordered List"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("orderedList") ? "bg-gray-200" : ""}`}
        >
          <ListOrderedIcon />
        </button>
        <button
          title="Quote"
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("blockquote") ? "bg-gray-200" : ""}`}
        >
          <QuoteIcon />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      <div className="flex gap-1">
        <button
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          title="Align Left"
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive({ textAlign: "left" }) ? "bg-gray-200" : ""}`}
        >
          <AlignLeftIcon />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          title="Align Center"
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive({ textAlign: "center" }) ? "bg-gray-200" : ""}`}
        >
          <AlignCenterIcon />
        </button>
        <button
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          title="Align Right"
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive({ textAlign: "right" }) ? "bg-gray-200" : ""}`}
        >
          <AlignRightIcon />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      <div className="flex gap-1">
        <button
          onClick={() => handleLink()}
          title="Add Link"
          className={`hover:bg-gray-100 p-2 rounded ${editor?.isActive("link") ? "bg-gray-200" : ""}`}
        >
          <LinkIcon />
        </button>
        <button
          onClick={() => editor?.chain().focus().unsetLink().run()}
          title="Remove Link"
          disabled={!editor?.isActive("link")}
          className={`hover:bg-gray-100 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <UnlinkIcon />
        </button>
      </div>

      <div className="w-px h-8 bg-gray-300 mx-1"></div>

      <div className="flex gap-1">
        <button
          title="Undo"
          disabled={!editor?.can().undo()}
          onClick={() => editor?.chain().focus().undo().run()}
          className={`hover:bg-gray-100 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <UndoIcon />
        </button>
        <button
          title="Redo"
          disabled={!editor?.can().redo()}
          onClick={() => editor?.chain().focus().redo().run()}
          className={`hover:bg-gray-100 p-2 rounded disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <RedoIcon />
        </button>
      </div>
    </div>
  );
}
