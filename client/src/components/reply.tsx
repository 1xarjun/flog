import { useSearchParams } from "react-router";
import Editor from "./editor";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Reply() {
  const [searchParams] = useSearchParams();

  const postId = searchParams.get("postId");

  const { data, isLoading, error } = useQuery({
    queryKey: ["post"],
    queryFn: () =>
      fetch(`http://localhost:3000/posts?id=${postId}`).then((res) =>
        res.json(),
      ),
    staleTime: 0,
  });

  const post = data ? data[0] : undefined;

  useEffect(() => {
    // for scrolling to top when rendering this page
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col gap-4 justify-start items-center border">
      {error && <p>Error: {error.message}</p>}
      {isLoading && <p>Loading...</p>}
      {/*<p>{post ? post.title : "postId not found"}</p>*/}

      <div className="max-w-6xl">
        <Editor replyTo={post} />
      </div>
    </div>
  );
}
