import { Link } from "react-router";
import useUser from "./query/user";
import { Avatar, AvatarImage } from "./components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOutIcon, User } from "lucide-react";
import { queryClient } from "./query/client";
import { useMutation } from "@tanstack/react-query";
import API from "./api";

export default function Header() {
  const { data: user } = useUser();

  // TODO: there seems to be a issue with the cache of the user / posts fix it!

  const logout = async () => {
    try {
      const res = await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Request failed!");
    } catch (error) {
      console.error(error);
    }
  };

  const logoutMutation = useMutation({
    mutationFn: async () => await logout(),
    onSuccess: async () => {
      // queryClient.clear();
      // there might be some stale data in the UI
      queryClient.invalidateQueries(); // for invalidating all queries
      // await queryClient.invalidateQueries({ queryKey: ["user"] });
      // await queryClient.invalidateQueries({ queryKey: ["posts"] });
      console.log("successfully logged out the user");
    },
  });

  return (
    <div className="fixed inset-x-0 bg-white border-b z-30">
      <div className="max-w-full sm:max-w-6xl mx-4 sm:mx-auto py-2.5 flex justify-between items-center h-14">
        <div>
          <Link to="/" className="text-xl font-semibold">
            Flog
          </Link>
        </div>

        {!user ? (
          <div className="flex gap-2">
            <Link
              to="/auth/login"
              className="outline outline-blue-500 hover:bg-blue-500 px-4 py-2 text-sm text-blue-500 hover:text-white transition-colors rounded"
            >
              Login
            </Link>
            <Link
              to="/auth/register"
              className="bg-green-600 active:bg-green-700 px-4 py-2 text-sm text-white rounded transition-colors"
            >
              Register
            </Link>
          </div>
        ) : (
          <div className="flex gap-2 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {user.pfp ? (
                  <Avatar size="lg">
                    <AvatarImage className="object-cover" src={user.pfp} />
                  </Avatar>
                ) : (
                  <div
                    role="button"
                    className="flex justify-center items-center text-white size-10 text-lg font-bold bg-linear-to-br from-indigo-500 to-pink-500 rounded-full"
                  >
                    {user.email.charAt(0).toUpperCase() ?? "?"}
                  </div>
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="left"
                sideOffset={4}
                className="mt-12 w-50 text-gray-700"
              >
                <DropdownMenuLabel className="text-xs sm:text-sm">
                  {user ? user.email : "My Account"}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link to={`u/${user._id}`}>
                  <DropdownMenuItem className="text-xs sm:text-sm">
                    <User className="mr-1 sm:mr-2 size-3 sm:size-4" /> Profile
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  role="button"
                  className="text-xs sm:text-sm"
                  onClick={async () => await logoutMutation.mutateAsync()}
                >
                  <LogOutIcon className="mr-1 sm:mr-2 size-3 sm:size-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
