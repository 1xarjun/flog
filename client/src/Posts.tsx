import Pagination from "./components/pagination";
import Post from "./components/post";
import { useQuery } from "@tanstack/react-query";

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
  created_at: string;
};

export default function Posts() {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: () => fetch("http://localhost:3000/posts").then((r) => r.json()),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <div className="pt-21 pb-8 px-6 bg-[#fefefe]">
      <div className="max-w-6xl mx-auto min-h-screen flex flex-col gap-2.5">
        {posts.length === 0 && (
          <p className="flex w-full h-100 items-center justify-center">
            It&apos;s empty here!
          </p>
        )}

        <Pagination />

        {posts.length !== 0 &&
          posts.map((item: Post, i: number) => (
            <Post key={i} post={item} index={i} />
          ))}

        <Pagination />
      </div>
    </div>
  );
}
