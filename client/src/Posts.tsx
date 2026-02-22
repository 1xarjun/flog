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
import Post from "./components/post";

export type Post = {
  id: number;
  created_at: string;
  title: string;
  upvotes: number;
  downvotes: number;
  description: string;
  user: User;
};

export type User = {
  username: string;
  email: string;
  status: string;
  pfp: string;
  likes: string[] | [];
  city: string;
  total_posts: number;
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

  return (
    <div className="pt-21 pb-8 px-6 bg-[#fefefe]">
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col gap-2.5">
        {posts.length === 0 && (
          <p className="flex w-full h-100 items-center justify-center">
            It&apos;s empty here!
          </p>
        )}

        {posts.length !== 0 &&
          posts.map((item, i) => <Post key={i} post={item} index={i} />)}
      </div>
    </div>
  );
}
