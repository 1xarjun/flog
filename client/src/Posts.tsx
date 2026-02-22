import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import {
  ArrowBigDown,
  ArrowBigUp,
  MessageCircle,
  Reply,
  Share,
  Share2,
} from "lucide-react";

type Post = {
  id: number;
  created_at: string;
  title: string;
  upvotes: number;
  downvotes: number;
  description: string;
  user: {
    username: string;
    email: string;
    status: string;
    pfp: string;
    likes: string[] | [];
    city: string;
    total_posts: number;
  };
};

export default function Posts() {
  const [posts, setPosts] = useState<Post[] | []>([]);

  useEffect(() => {
    async function fetchPosts() {
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      setPosts(data);
    }

    fetchPosts();
  }, []);

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
    <div className="pt-21 pb-8 px-6 bg-[#fefefe]">
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col gap-2.5">
        {posts.length !== 0 &&
          posts.map((p, i) => (
            <div
              id={(i + 1).toString()}
              key={p.id || i}
              className="grid grid-cols-8 border rounded-xs"
            >
              <div className="col-span-1 flex flex-col border-r bg-[#f9f9f9]">
                <div className="flex flex-col items-center p-2">
                  <div className="rounded-full border">
                    <img
                      className="rounded-full size-25 overflow-hidden object-center object-cover"
                      src={p.user.pfp}
                      alt={`${p.user.username}'s profile`}
                    />
                  </div>

                  <span className="text-[16px] font-semibold text-violet-400 max-w-28 truncate">
                    {p.user.username}
                  </span>
                  <p className="text-xs text-gray-800 max-w-29 truncate">
                    {/*status if provided 12 chars is the limit*/}
                    {p.user.status}
                  </p>
                </div>

                <ul className="text-xs text-gray-500 py-2">
                  <li className="flex justify-between px-2">
                    Posts:
                    <span className="text-gray-800">{p.user.total_posts}</span>
                  </li>
                  <li className="flex justify-between px-2">
                    Location:
                    <span className="text-gray-800 text-right">
                      {p.user.city.split(" ").join("\n")}
                    </span>
                  </li>

                  <li className="flex justify-between px-2">
                    Likes:
                    <span className="text-gray-800 text-right">
                      {p.user.likes.join(", ")}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="col-span-7 flex flex-col gap-2 text-xs bg-white">
                <div className="px-2">
                  <div className="flex justify-between items-center border-b text-gray-500 px-2">
                    <span>
                      {formattedDate(
                        new Date(p.created_at.split("T")[0]).toString(),
                      )}
                    </span>

                    <div className="flex gap-2 items-center">
                      <button className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
                        <Share2 />
                      </button>

                      <span className="text-gray-500">#{i + 1}</span>
                    </div>
                  </div>
                </div>

                <div className="h-full px-2 flex flex-col gap-2">
                  <p className="text-[16px] truncate font-medium text-gray-800 py-2">
                    {p.title}
                  </p>
                  <p className=" text-gray-700 line-clamp-5 text-sm">
                    {p.description}
                  </p>
                </div>

                <div className="border-t flex items-center bg-[#fbfbfb]">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <button className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
                        <ArrowBigUp />
                      </button>
                      <span className="text-xs text-gray-500">
                        {p.upvotes - p.downvotes}
                      </span>
                      <button className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
                        <ArrowBigDown />
                      </button>
                    </div>

                    <button className="flex gap-1 items-center [&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-800">
                      <Reply /> Reply
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
