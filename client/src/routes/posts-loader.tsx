import { queryOptions, type QueryClient } from "@tanstack/react-query";
import type { LoaderFunction } from "react-router";

export const loader =
  (queryClient: QueryClient) =>
  async ({ requests }: LoaderFunctionArgs) => {
    await queryClient.ensureQueryData(postsQuery());
  };

const fetchPosts = async () => {
  const response = await fetch("http://localhost:3000/posts");
  const posts = await response.json();
  return { posts };
};

export const postsQuery = () =>
  queryOptions({
    queryKey: ["posts"],
    queryFn: () => fetchPosts(),
  });
