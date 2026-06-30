import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { formattedDate } from "@/constants";
import type { Post, Post as PostType } from "@/PostsN";
import PostHeader from "./post-header";
import PostBody from "./post-body";
import PostToolbar from "./post-toolbar";
import { useEffect } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import useUser from "@/query/user";
import API from "@/api";

export default function Profile() {
  const { data } = useUser();
  const userId = data?._id;
  // const { userId } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["session_user"],
    queryFn: () => fetch(`${API}/users/${userId}`).then((res) => res.json()),
    staleTime: 0,
  });

  const {
    data: postsData,
    fetchNextPage,
    hasNextPage,
    // @ts-expect-error -- ignore it for now
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isFetchingNextPage,
    isFetchNextPageError,
  } = useInfiniteQuery({
    queryKey: ["userPosts"],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await fetch(
        `${API}/posts?userId=${userId}&cursor=${cursor ?? ""}`,
      );
      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.data?.nextCursor;
    },
  });

  // if (isLoading || isFetchingNextPage) {
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Loading...
      </div>
    );
  }

  if (error || isFetchNextPageError) {
    return (
      <div className="min-h-screen w-full flex justify-center items-center">
        Error: {error?.message}
      </div>
    );
  }

  const user = userData?.data;
  const posts = postsData?.pages.flatMap((item) => item.data.posts); // joins arrays returned by map;

  if (!user || !posts) return <div>User or user's posts not found!</div>;
  // return <div>{JSON.stringify(user)}</div>;

  return (
    <div className="min-h-screen py-8 px-6 bg-[#fefefe]">
      <div className="max-w-6xl mx-auto">
        <div className="grid gap-4 grid-cols-6 border rounded overflow-hidden bg-[#fbfbfb]">
          <div className="flex flex-col items-center col-span-1 px-2.5 pt-3">
            <div className="rounded-full border bg-white overflow-hidden">
              {/*<img
                className="rounded-full size-35 overflow-hidden object-center object-cover"
                src={user.pfp}
                alt={`${user.username}'s profile`}
              />*/}

              {user.pfp ? (
                <img
                  className="size-30 rounded-full overflow-hidden object-center object-cover"
                  src={user.pfp}
                  alt={`${user.username}'s profile`}
                />
              ) : (
                <div className="size-30 text-6xl flex justify-center items-center rounded-full">
                  {user.email?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}
            </div>
          </div>

          <div className="col-span-5 text-sm px-2.5 pt-5">
            <div className="flex flex-col gap-1">
              <span className="text-xl font-semibold text-violet-400 max-w-28 truncate">
                {user.username}
              </span>
              <p className=" text-gray-700 max-w-full truncate">
                {user.status || "None"} <span className="mx-1">&bull;</span>{" "}
                From {user.city || "None"}
              </p>
            </div>

            <ul className="text-gray-500 flex flex-col gap-1 pt-1">
              <li className="flex gap-2">
                Posts:
                <span className="text-gray-700">
                  {user?.stats.numberOfPosts || "None"}
                </span>
              </li>
              <li className="flex gap-2">
                Likes:
                <span className="text-gray-700 text-right">
                  {user.likes?.join(", ") || "None"}
                </span>
              </li>

              <li className="flex gap-2">
                Joined:
                <span className="text-gray-700 text-right">
                  {formattedDate(user.createdAt)}
                </span>
              </li>
            </ul>
          </div>

          <div className="col-span-6 flex justify-between bg-white border-t text-xs text-gray-500 px-6 py-1.5">
            <div className="flex flex-col items-center">
              Mentions{" "}
              <span className="text-gray-700">
                {user?.stats.mentions || "None"}
              </span>
            </div>
            <div>
              <div className="flex flex-col items-center">
                Upvoted{" "}
                <span className="text-gray-700">
                  {user.stats.upvotedByUser || "None"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center">
              Score{" "}
              <span className="text-gray-700">
                {user?.stats.scoreOfUser || "None"}
              </span>
            </div>
          </div>
        </div>

        {/*<div className="flex flex-col gap-2.5">*/}
        <div className="flex gap-4 items-center mt-8 mb-4">
          {/*<span className="border-t w-5" />*/}
          <span className="text-base">All Posts</span>
          {/*<span className="flex-1 border-b" />*/}
        </div>

        <div className="flex flex-col gap-2.5">
          {posts.length !== 0 &&
            posts.map((post: PostType, index: number) => (
              <Link
                to={`/?highlight=${post._id}&page=${post.pageNo}`}
                key={index}
                className="flex flex-col gap-2 text-xs bg-white border *:pointer-events-none"
              >
                <PostHeader
                  postId={post._id!.toString()}
                  created_at={post.createdAt!}
                  index={index}
                  share={false}
                />
                <PostBody
                  content={post.content}
                  repliedTo={post.repliedTo as Post}
                />
                <PostToolbar post={post} reply={false} />
              </Link>
            ))}

          {hasNextPage && (
            <div className="flex items-center justify-center">
              <Button
                onClick={() => {
                  // setCursor(postsData?.data.nextCursor);
                  fetchNextPage();
                }}
                variant={"outline"}
                className="w-30"
              >
                Load more
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
