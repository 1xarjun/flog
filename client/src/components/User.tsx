import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { User } from "@/Posts";
import { formattedDate } from "@/constants";
import type { Post as PostType } from "@/Posts";
import PostHeader from "./post-header";
import PostBody from "./post-body";
import PostToolbar from "./post-toolbar";

export default function User() {
  const { username } = useParams<{ username: string }>();

  const {
    data: posts,
    isLoading: postsLoading,
    error: errorLoadingPosts,
  } = useQuery({
    queryKey: ["userPosts"],
    queryFn: () =>
      fetch(`http://localhost:3000/posts?createdBy=${username}`).then((res) =>
        res.json(),
      ),

    staleTime: 0,
  });

  console.log(posts);

  const { data, isLoading, error } = useQuery({
    queryKey: ["username"],
    queryFn: () =>
      fetch(`http://localhost:3000/users?username=${username}`).then((res) =>
        res.json(),
      ),
    staleTime: 0,
  });

  if (isLoading || postsLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error || errorLoadingPosts) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Error: {error.message}
      </div>
    );
  }

  const user: User = data[0];

  return (
    <div className="min-h-screen pt-21 pb-8 px-6 bg-[#fefefe]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-4 grid-cols-6 border rounded-xs bg-[#fbfbfb]">
          <div className="flex flex-col items-center col-span-1 px-2.5 pt-3">
            <div className="rounded-full border">
              <img
                className="rounded-full size-35 overflow-hidden object-center object-cover"
                src={user.pfp}
                alt={`${user.username}'s profile`}
              />
            </div>
          </div>

          <div className="col-span-5 text-sm px-2.5 pt-3">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-violet-400 max-w-28 truncate hover:underline">
                {user.username}
              </span>
              <p className=" text-gray-800 max-w-full truncate">
                {/*status if provided 12 chars is the limit*/}
                {user.status} . From {user.city}
              </p>
            </div>

            <ul className="text-gray-500 flex flex-col gap-1 pt-2">
              <li className="flex gap-2">
                Posts:
                <span className="text-gray-800">{user.total_posts}</span>
              </li>
              <li className="flex gap-2">
                Location:
                <span className="text-gray-800 text-right">
                  {user.city.split(" ").join("\n")}
                </span>
              </li>

              <li className="flex gap-2">
                Likes:
                <span className="text-gray-800 text-right">
                  {user.likes.join(", ")}
                </span>
              </li>

              <li className="flex gap-2">
                Joined:
                <span className="text-gray-800 text-right">
                  {formattedDate(user.created_at)}
                </span>
              </li>
            </ul>
          </div>

          <div className="col-span-6 flex justify-between bg-white border-t p-2 text-xs text-gray-500 px-6 py-2">
            <div className="flex flex-col items-center">
              Messages <span className="text-gray-800">{user.total_posts}</span>
            </div>
            <div>
              <div className="flex flex-col items-center">
                Replies{" "}
                <span className="text-gray-800">{user.total_posts}</span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              Score <span className="text-gray-800">{user.total_posts}</span>
            </div>
          </div>
        </div>

        {/*user posts*/}
        <div className="flex gap-4 text-xs text-gray-500 pt-5 items-center">
          <span className="border-t grow"></span>
          <span>All posts</span>
          <span className="border-b grow"></span>
        </div>

        <div className="pt-5 flex flex-col gap-2.5">
          {posts.length !== 0 &&
            posts.map((post: PostType, index: number) => (
              <div className="flex flex-col gap-2 text-xs bg-white border">
                <PostHeader created_at={post.created_at} index={index} />
                <PostBody title={post.title} description={post.description} />
                <PostToolbar
                  upvotes={post.upvotes}
                  downvotes={post.downvotes}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
