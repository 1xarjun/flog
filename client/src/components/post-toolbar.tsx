import type { Post } from "@/PostsN";
import useStore from "@/store/useStore";
import { ArrowBigDown, ArrowBigUp, Reply } from "lucide-react";
import { useEditorInstance } from "@/context/constants";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/query/client";
import API from "@/api";

export default function PostToolbar({
  post,
  reply = true,
}: {
  post: Post;
  reply?: boolean;
}) {
  const setReplyingTo = useStore((state) => state.actions.setReplyingTo);
  const editor = useEditorInstance();

  // TODO: Implement the upvote and downvote mechanism

  // const postUpvoteMutation = useMutation({
  //   mutationFn: ({
  //     post_id,
  //     voteType,
  //   }: {
  //     post_id: string;
  //     voteType: string;
  //   }) => {
  //     return fetch(`http://localhost:3000/posts/${post_id}`, {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         upvotes: upvotes,
  //       }),
  //     });
  //   },

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["posts"] }); // TODO: refetching posts just for a mere upvote update
  //   },

  //   onError: (error) => {
  //     console.log("error: ", error);
  //   },

  //   onSettled: () => {
  //     console.log("Mutation finished either with success or error");
  //   },
  // });

  // // const postDownvoteMutation = useMutation({
  // //   mutationFn: ({
  // //     post_id,
  // //     downvotes,
  // //   }: {
  // //     post_id: string;
  // //     downvotes: number;
  // //   }) => {
  // //     return fetch(`http://localhost:3000/posts/${post_id}`, {
  // //       method: "PATCH",
  // //       headers: {
  // //         "Content-Type": "application/json",
  // //       },
  // //       body: JSON.stringify({
  // //         downvotes: downvotes,
  // //       }),
  // //     });
  // //   },

  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["posts"] }); // TODO: refetching posts just for a mere upvote update
  //   },

  //   onError: (error) => {
  //     console.log("error: ", error);
  //   },

  //   onSettled: () => {
  //     console.log("Mutation finished either with success or error");
  //   },
  // });

  // we already have posts data now we just have to mutate it

  // TODO: User page upvote and downvote seems to be not working.

  const postVoteMutation = useMutation({
    mutationFn: ({
      post_id,
      type,
    }: {
      post_id: string;
      type: "up" | "down";
    }) => {
      return fetch(`${API}/votes`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ post_id, type }),
      });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  return (
    <div className="border-t flex items-center bg-[#fbfbfb]">
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <button
            onClick={() => {
              postVoteMutation.mutate({ post_id: post._id!, type: "up" });
            }}
            className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-700 active:text-blue-500"
          >
            <ArrowBigUp
              className={
                post.votedByUser && post.voteType === "up"
                  ? "fill-gray-700 stroke-gray-700"
                  : ""
              }
            />
          </button>
          <span className="text-xs text-gray-500">{post.scoreOfPost}</span>
          <button
            onClick={() => {
              postVoteMutation.mutate({ post_id: post._id!, type: "down" });
            }}
            className="[&_svg]:size-3 px-1.5 h-6 rounded-md  text-gray-500 hover:text-gray-700 active:text-blue-500"
          >
            <ArrowBigDown
              className={
                post.votedByUser && post.voteType === "down"
                  ? "fill-gray-700  stroke-gray-700"
                  : ""
              }
            />
          </button>
        </div>

        {reply && (
          <button
            onClick={async () => {
              setReplyingTo(post);
              await new Promise<void>((resolve) => {
                setTimeout(() => {
                  window.scrollTo({
                    behavior: "smooth",
                    top: document.body.scrollHeight,
                  });
                }, 300); // the delay is necessary since window is not fully loaded

                const checkIfBottom = () => {
                  if (
                    window.innerHeight + window.scrollY >=
                    document.body.scrollHeight
                  ) {
                    window.removeEventListener("scroll", checkIfBottom);
                    resolve();
                  }
                };

                window.addEventListener("scroll", checkIfBottom);
                checkIfBottom(); // if already at bottom
              });
              editor?.commands.focus();
            }}
            className="flex gap-1 items-center [&_svg]:size-3 px-1.5 h-6 rounded-md text-gray-500 hover:text-gray-700 active:text-blue-500"
          >
            <Reply /> Reply
          </button>
        )}
      </div>
    </div>
  );
}
