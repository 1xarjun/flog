import { Share2 } from "lucide-react";

export default function PostHeader({
  created_at,
  index,
}: {
  created_at: string;
  index: number;
}) {
  const formattedDate = (date: string) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = d.toLocaleString("en-IN", {
      month: "short",
    });
    const dd = d.toLocaleString("en-IN", {
      day: "2-digit",
    });
    return `${dd} ${mm}, ${yyyy}`;
  };

  return (
    <div className="px-2">
      <div className="flex justify-between items-center border-b text-gray-500 px-2">
        {/*TODO: small pointer to the user*/}
        <span>
          {formattedDate(new Date(created_at.split("T")[0]).toString())}
        </span>

        <div className="flex gap-2 items-center">
          <button className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
            <Share2 />
          </button>

          <span className="text-gray-500">#{index + 1}</span>
        </div>
      </div>
    </div>
  );
}
