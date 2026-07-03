import Editor from "./components/editorN";
import PaginationN from "./components/paginationN";
import Post from "./components/post";
import { useMutation, useQuery } from "@tanstack/react-query";
import useUser from "./query/user";
import { Link, useNavigate, useSearchParams } from "react-router";
import { CornerDownRight, Loader, X } from "lucide-react";
import useStore from "./store/useStore";
import { CreatePost } from "./actions/create-post";
import { useEditorInstance } from "./context/constants";
import { queryClient } from "./query/client";
import { type JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { generateHTML } from "@tiptap/react";
import { useEffect, useRef } from "react";
import API from "./api";

export type Post = {
  _id?: string;
  content?: JSONContent;
  author: string | User;
  repliedTo: Post | null | string;
  createdAt?: string;
  scoreOfPost?: number;
  votedByUser?: boolean;
  voteType?: "up" | "down" | null;
  pageNo: number;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  status: string;
  pfp: string;
  likes: string[] | [];
  city: string;
  hobbies: string[];
  total_posts: number;
  createdAt: string;
  updatedAt: string;
};

export default function PostsN() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: user } = useUser();
  const replyingTo = useStore((s) => s.replyingTo);
  const setReplyingTo = useStore((s) => s.actions.setReplyingTo);
  const content = useStore((s) => s.content);
  const editor = useEditorInstance();
  const highlightId = searchParams.get("highlight");
  const paramPage = Number(searchParams.get("page")) || 1;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["posts", paramPage],
    queryFn: () =>
      fetch(`${API}/posts?p=${paramPage}`, { credentials: "include" })
        .then((r) => r.json())
        .then((result) => result.data),
    staleTime: 1000 * 60,
  });

  // need global metadata data?.totalPages as it would go stale after navigating to a different page

  const posts = data?.items;

  const { data: postsMeta } = useQuery({
    queryKey: ["posts-meta"],
    queryFn: () =>
      fetch(`${API}/posts/meta-data`, { credentials: "include" })
        .then((r) => r.json())
        .then((result) => result.data),
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!highlightId || isLoading) return;
    let el: HTMLElement | null = null;
    let prev = "";
    let borderTimeoutId: ReturnType<typeof setTimeout> | null = null;
    let observerTimeoutId: ReturnType<typeof setTimeout> | null = null;
    const container = containerRef.current;

    const highlightPost = (el: HTMLElement) => {
      if (borderTimeoutId) {
        clearTimeout(borderTimeoutId);
        el.style.border = prev;
      }

      el.scrollIntoView({ behavior: "smooth", block: "start" });
      prev = getComputedStyle(el).border;
      el.style.border = "1px solid blue";
      borderTimeoutId = setTimeout(() => {
        el.style.border = prev;
        setSearchParams((prev) => {
          prev.delete("highlight");
          return prev;
        });
      }, 3000);
    };

    const observer = new ResizeObserver(() => {
      el = document.getElementById(highlightId) as HTMLElement | null;

      if (el) {
        if (observerTimeoutId) clearTimeout(observerTimeoutId);
        highlightPost(el);
        observerTimeoutId = setTimeout(() => {
          // wait for 500s of no call to ResizeObserver before disconnecting
          observer.disconnect();
        }, 500);
      }
    });

    if (container) observer.observe(container);

    return () => {
      if (borderTimeoutId) {
        if (el) el.style.border = prev;
        setSearchParams((prev) => {
          prev.delete("highlight");
          return prev;
        });
        clearTimeout(borderTimeoutId);
      }

      if (observerTimeoutId) {
        clearTimeout(observerTimeoutId);
        observer.disconnect();
      }
    };
  }, [highlightId, isLoading, paramPage, setSearchParams]);

  const mutation = useMutation({
    mutationFn: CreatePost,
    onSuccess: () => {
      console.log("success on creation of new post");
      //TODO: fix it. queryClient.setQueryData(["posts"], (old: any) => {
      //   if (!old) return old;
      //   return { ...old, items: [...old.items, data] };
      // });
      // queryClient.invalidateQueries({ queryKey: ["posts"] });
    },

    onError: (error) => {
      console.log(error);
    },

    onSettled: () => {
      console.log("mutation done with either success or error");
    },
  });

  if (isLoading) {
    return (
      <div className="w-full h-[calc(100vh-56px)] flex justify-center items-center">
        <Loader className="animate-spin duration-300" />
      </div>
    );
  }

  if (error || !posts) {
    return (
      <div className="w-full h-[calc(100vh-56px)] flex justify-center items-center">
        {error ? error.message : "Something went wrong."}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-screen flex flex-col gap-2.5 py-8">
      <PaginationN
        totalPages={postsMeta?.totalPages}
        hasNext={paramPage + 1 <= postsMeta?.totalPages}
        hasPrev={paramPage - 1 >= 1}
        current={paramPage}
      />

      {posts.length === 0 && (
        <p className="flex w-full h-100 items-center justify-center">
          It&apos;s empty here!
        </p>
      )}

      <div ref={containerRef} className="flex flex-col gap-2.5">
        {posts.length !== 0 &&
          posts.map((item: Post, i: number) => (
            <Post key={item._id!} current={paramPage} post={item} index={i} />
          ))}
      </div>

      <div className="flex justify-between">
        <PaginationN
          totalPages={postsMeta?.totalPages}
          hasNext={data?.hasNext}
          hasPrev={data?.hasPrev}
          current={paramPage}
        />
        {!user && (
          <Link
            to="/auth/login"
            className="px-2.5 py-1 rounded border bg-white hover:bg-[#fbfbfb] text-xs"
          >
            You must be logged in or registered to post a reply here
          </Link>
        )}
      </div>

      {user && (
        <div className="flex flex-col gap-4 py-5 max-w-3xl">
          <p className="text-base">Your Reply</p>

          {replyingTo && (
            <div className="border rounded overflow-hidden">
              <div className="p-3 flex gap-1 flex-col text-xs bg-[#fbfbfb] text-gray-500">
                <div className="flex justify-between items-center [&_svg]:size-3 ">
                  <span className="font-medium [&_svg]:size-3 flex gap-1 items-center text-gray-700">
                    <CornerDownRight />
                    Replying to {(replyingTo.author as User).username}
                  </span>
                  <button onClick={() => setReplyingTo(undefined)}>
                    <X />
                  </button>
                </div>
                <div
                  className="preview line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html: generateHTML(replyingTo.content as JSONContent, [
                      StarterKit,
                    ]),
                  }}
                ></div>
              </div>
            </div>
          )}

          <Editor />
          <div className="text-sm text-gray-700 flex justify-end">
            <button
              type="button"
              disabled={editor?.isEmpty}
              onClick={async () => {
                editor?.commands.setContent("", { emitUpdate: false });

                const { data: post } = await mutation.mutateAsync({
                  content,
                  author: user._id,
                  repliedTo: replyingTo ? replyingTo._id! : null,
                  pageNo:
                    postsMeta.totalItems % data.limit === 0
                      ? postsMeta.totalPages + 1
                      : postsMeta.totalPages,
                });

                if (replyingTo) setReplyingTo(undefined);
                await queryClient.refetchQueries({ queryKey: ["posts"] });
                await queryClient.refetchQueries({ queryKey: ["posts-meta"] });
                navigate(`?highlight=${post._id}&page=${post.pageNo}`);

                // don't touch this :)
                // if (data?.totalItems && data?.totalItems % data.limit === 0) {
                //   navigate(
                //     `?highlight=${post._id}&page=${data?.totalPages + 1}`,
                //   );
                // } else {
                //   // i need to update the data first
                //   await queryClient.refetchQueries({ queryKey: ["posts"] }); // for now it is fine
                //   navigate(
                //     `?highlight=${post._id}&page=${data?.totalPages || paramPage}`,
                //   );
                // }
              }}
              className="disabled:cursor-not-allowed transition-opacity disabled:opacity-70 disabled:hover:bg-blue-500 px-3 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Post Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
