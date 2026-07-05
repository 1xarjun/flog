import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import type { Post, User } from "@/PostsN";
import { formattedDate } from "@/constants";
import type { Post as PostType } from "@/PostsN";
import PostHeader from "./post-header";
import PostBody from "./post-body";
import PostToolbar from "./post-toolbar";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Link } from "react-router";
import { Check, Pencil } from "lucide-react";
import useUser from "@/query/user";
import { queryClient } from "@/query/client";
import API from "@/api";

export default function User() {
  type InputState = {
    pfp: string;
    status: string;
    city: string;
    likes: string[] | [];
  };

  const { data: userInSession } = useUser();
  const { userId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [input, setInput] = useState<InputState>({
    pfp: "",
    status: "",
    city: "",
    likes: [],
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user_profile", userId],
    queryFn: () => fetch(`${API}/users/${userId}`).then((res) => res.json()),
    staleTime: 0,
    refetchOnMount: "always",
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
    queryKey: ["user_posts", userId],
    queryFn: async ({ pageParam: cursor }) => {
      const res = await fetch(
        `${API}/posts?userId=${userId}&cursor=${cursor ?? ""}`,
        { credentials: "include" },
      );
      return res.json();
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => {
      return lastPage.data?.nextCursor;
    },
    staleTime: 0,
    refetchOnMount: "always",
  });

  const updateProfile = async (input: InputState) => {
    try {
      const res = await fetch(`${API}/users/${userId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("user data update request failed");
    } catch (err) {
      console.error(err);
    }
  };

  const userProfileMutation = useMutation({
    mutationFn: async (input: InputState) => await updateProfile(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user_profile", userId] });
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

  const isOwner = userInSession?._id === userData?.data._id;

  return (
    <div className="min-h-screen py-8 sm:px-6 bg-[#fefefe]">
      <div className="max-w-full sm:max-w-6xl mx-2 sm:mx-auto">
        <div className="grid gap-2 sm:gap-4 grid-cols-3 sm:grid-cols-6 border rounded overflow-hidden bg-[#fbfbfb]">
          <div className="flex flex-col justify-center sm:justify-start items-center col-span-1 px-2.5 pt-3">
            <div className="relative">
              {input.pfp || user.pfp ? (
                <img
                  referrerPolicy="no-referrer"
                  className="size-20 sm:size-30 rounded-full border object-center object-cover overflow-hidden"
                  src={input.pfp || user.pfp}
                  alt={`${user.username}'s profile`}
                />
              ) : (
                <div className="border font-bold text-white bg-linear-to-br from-indigo-500 to-pink-500 size-20 sm:size-30 text-6xl flex justify-center items-center rounded-full">
                  {user.email?.charAt(0).toUpperCase() ?? "?"}
                </div>
              )}

              {isEditing && (
                <button
                  onClick={() => {
                    try {
                      const input = prompt("Enter a image url: ");
                      if (!input) return;
                      const url = new URL(input);
                      if (url)
                        setInput((p) => ({
                          ...p,
                          pfp: input,
                        }));
                    } catch (error) {
                      console.error(error);
                      alert(error);
                    }
                  }}
                  className="absolute bottom-0 right-0 rounded-full border bg-white p-2 hover:bg-gray-50 transition-colors duration-300"
                >
                  <Pencil className="size-5" />
                </button>
              )}
            </div>
          </div>

          <div className="col-span-2 sm:col-span-5 text-xs sm:text-sm px-2.5 pt-5 relative">
            <div>
              <div className="flex flex-col gap-1">
                <span className="text-lg sm:text-xl font-semibold text-violet-400 max-w-28 truncate">
                  {user.username}
                </span>
                {/*<p className=" text-gray-700 max-w-full truncate">*/}
                <div className=" text-gray-700">
                  <span
                    // TODO: fix contenteditable error
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const content = e.currentTarget.textContent;
                      setInput((p) => ({
                        ...p,
                        status: content ? content : "",
                      }));
                    }}
                    className={`${isEditing ? "outline-0 ring-2 rounded" : ""}`}
                  >
                    {input.status || user.status || "Status"}
                  </span>{" "}
                  <span className="mx-1">&bull;</span> From{" "}
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const content = e.currentTarget.textContent;
                      setInput((p) => ({
                        ...p,
                        city: content ? content : "",
                      }));
                    }}
                    className={`${isEditing ? "outline-0 ring-2 rounded" : ""}`}
                  >
                    {input.city || user.city || "City"}
                  </span>
                </div>
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
                  <span
                    contentEditable={isEditing}
                    suppressContentEditableWarning
                    className={`${isEditing ? "outline-0 ring-2 rounded" : ""} text-gray-700 text-right`}
                    onBlur={(e) => {
                      // problemm is in this
                      // fix it :TODO
                      const $ = e.currentTarget;
                      const txt = $.textContent;
                      if (!txt) return;
                      if (txt.includes(",")) {
                        setInput((p) => ({
                          ...p,
                          likes: txt.split(","),
                        }));
                      } else {
                        setInput((p) => ({ ...p, likes: [txt] }));
                      }
                    }}
                  >
                    {/*TODO: fix it fast*/}
                    {input.likes?.join(", ") ||
                      user?.likes?.join(", ") ||
                      "Likes"}
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

            <div className="absolute bottom-0 -right-4 sm:right-4 flex gap-2">
              {isOwner && (
                // TODO: fix input.likes.join error
                <Button
                  disabled={isEditing}
                  onClick={() => {
                    setInput({
                      pfp: user.pfp,
                      status: user.status,
                      city: user.city,
                      likes: user.likes,
                    });
                    setIsEditing(true);
                  }}
                  variant="outline"
                  className="bg-transparent"
                >
                  <Pencil />
                </Button>
              )}

              {isEditing && (
                <Button
                  hidden={!isEditing}
                  onClick={() => {
                    setIsEditing(false);
                    userProfileMutation.mutate(input);
                  }}
                  variant="outline"
                  className="bg-transparent"
                >
                  <Check />
                </Button>
              )}
            </div>
          </div>

          <div className="col-span-6 flex justify-between bg-white border-t text-[10px] sm:text-xs text-gray-500 px-6 py-1.5">
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
        <div className="flex gap-4 items-center justify-center mt-8 mb-5">
          {/*<span className="border-t w-5" />*/}
          <span className="text-sm sm:text-base">All posts</span>
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
                  current={0} // for now
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
