import { formattedDate } from "@/constants";
import type { User } from "@/PostsN";
import { Link } from "react-router";

export default function UserInfo({ user }: { user: User }) {
  return (
    <>
      <div className="flex flex-col items-center p-2">
        <div className="rounded-full border bg-white overflow-hidden">
          {user.pfp ? (
            <img
              className="rounded-full size-25 overflow-hidden object-center object-cover"
              src={user.pfp}
              alt={`${user.username}'s profile`}
            />
          ) : (
            <div className="size-25 text-3xl flex justify-center items-center font-bold text-white bg-linear-to-br from-indigo-500 to-pink-500">
              {user.email?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}
        </div>

        <Link
          // TODO: there's been a glitch where page of the pagination is also sent with u/user_id
          to={`u/${user._id}`}
          className="text-[16px] font-semibold text-violet-400 max-w-28 truncate hover:underline"
        >
          {user.username ?? "username"}
        </Link>
        <p className="text-xs max-w-29 truncate">
          {/*status if provided 12 chars is the limit*/}
          {user?.status ?? "None"}
        </p>
      </div>

      <ul className="text-xs text-gray-500 py-2">
        <li className="flex justify-between px-2">
          Location:
          <span className="text-gray-700 text-right">
            {user?.city?.split(" ").join("\n") || "Bankura"}
          </span>
        </li>

        <li className="flex justify-between px-2">
          Likes:
          <span className="text-gray-700 text-right">
            {user?.likes?.join(", ") || "nothing"}
          </span>
        </li>
        <li className="flex justify-between px-2">
          Joined:
          <span className="text-gray-700">
            {formattedDate(user?.createdAt)}
          </span>
        </li>
      </ul>
    </>
  );
}
