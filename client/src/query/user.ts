import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    },
    staleTime: Infinity,
  });
}
