import { Share2 } from "lucide-react";
import { formattedDate } from "@/constants";

export default function PostHeader({
  created_at,
  index,
  share = true,
  postId,
  current,
}: {
  created_at: string;
  index: number;
  share?: boolean;
  postId: string;
  current?: number;
}) {
  // const currentPage = useStore((s) => s.currentPage);

  return (
    <div className="px-2 text-[10px] sm:text-xs">
      <div className="flex justify-between items-center border-b text-gray-500 px-2">
        {/*TODO: small pointer to the user*/}
        <span>
          {formattedDate(new Date(created_at?.split("T")[0]).toString())}
        </span>

        <div className="flex gap-2 items-center h-6">
          {share && (
            <button
              onClick={() => {
                const currentPostURL = `${window.location.origin}/?highlight=${postId}&page=${current}`;
                navigator.clipboard.writeText(currentPostURL);
                alert("Link copied successfully!");
              }}
              className="[&_svg]:size-2.5 sm:[&_svg]:size-3 px-1.5 rounded-md  text-gray-500 hover:text-gray-800"
            >
              <Share2 />
            </button>
          )}

          <span className="text-gray-500">
            #{current ? (current - 1) * 10 + index + 1 : index + 1}{" "}
            {/* as the limit is 10 (for now hardcoded to 10) */}
          </span>
        </div>
      </div>
    </div>
  );
}
