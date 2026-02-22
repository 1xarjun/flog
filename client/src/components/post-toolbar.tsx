import { ArrowBigDown, ArrowBigUp, Reply } from "lucide-react";

export default function PostToolbar({
  upvotes,
  downvotes,
}: {
  upvotes: number;
  downvotes: number;
}) {
  return (
    <div className="border-t flex items-center bg-[#fbfbfb]">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <button className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
            <ArrowBigUp />
          </button>
          <span className="text-xs text-gray-500">{upvotes - downvotes}</span>
          <button className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
            <ArrowBigDown />
          </button>
        </div>

        <button className="flex gap-1 items-center [&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
          <Reply /> Reply
        </button>
      </div>
    </div>
  );
}
