import API from "@/api";
import type { Post } from "@/PostsN";

export async function CreatePost(post: Post) {
  const res = await fetch(`${API}/posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(post),
  });
  return res.json();
}
