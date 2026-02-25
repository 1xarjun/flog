import type { User } from "@/Posts";
import { Link } from "react-router";

export default function UserInfo({ user }: { user: User }) {
  return (
    <>
      <div className="flex flex-col items-center p-2">
        <div className="rounded-full border">
          <img
            className="rounded-full size-25 overflow-hidden object-center object-cover"
            src={user.pfp}
            alt={`${user.username}'s profile`}
          />
        </div>

        <Link
          to={`users/${user.username}`}
          className="text-[16px] font-semibold text-violet-400 max-w-28 truncate hover:underline"
        >
          {user.username}
        </Link>
        <p className="text-xs text-gray-800 max-w-29 truncate">
          {/*status if provided 12 chars is the limit*/}
          {user.status}
        </p>
      </div>

      <ul className="text-xs text-gray-500 py-2">
        <li className="flex justify-between px-2">
          Posts:
          <span className="text-gray-800">{user.total_posts}</span>
        </li>
        <li className="flex justify-between px-2">
          Location:
          <span className="text-gray-800 text-right">
            {user.city.split(" ").join("\n")}
          </span>
        </li>

        <li className="flex justify-between px-2">
          Likes:
          <span className="text-gray-800 text-right">
            {user.likes.join(", ")}
          </span>
        </li>
      </ul>
    </>
  );
}
