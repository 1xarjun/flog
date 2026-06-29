import API from "@/api";
import type { User } from "@/PostsN";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async (): Promise<User | null> => {
      const response = await fetch(`${API}/auth/whoami`);
      const result = await response.json();
      return result.data ? result.data : null;
    },
    staleTime: Infinity,
  });
}
