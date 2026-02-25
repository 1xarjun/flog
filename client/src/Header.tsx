import { Link } from "react-router";
import useUser from "./query/user";
import { Avatar, AvatarImage } from "./components/ui/avatar";

export default function Header() {
  const { data: user } = useUser();

  return (
    <div className="fixed inset-x-0 bg-white border-b">
      <div className="max-w-6xl mx-auto py-2.5 flex justify-between items-center h-14">
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
          <div className="flex gap-2 items-center text-xs">
            <Avatar size="lg">
              <AvatarImage src={user.pfp} />
            </Avatar>
            <p>{user.username}</p>
          </div>
        )}
      </div>
    </div>
  );
}
