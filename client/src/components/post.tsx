import type { Post, User } from "@/PostsN";
import UserInfo from "./user-info";
import PostToolbar from "./post-toolbar";
import PostHeader from "./post-header";
import PostBody from "./post-body";

export default function Post({
  post,
  index,
  current,
}: {
  post: Post;
  index: number;
  current: number;
}) {
  return (
    <div
      id={post._id}
      className="grid grid-cols-4 sm:grid-cols-8 border rounded overflow-hidden scroll-mt-16.5"
    >
      <div className="col-span-1 flex flex-col border-r bg-[#fbfbfb]">
        <UserInfo user={post.author as User} />
      </div>

      <div className="col-span-3 sm:col-span-7 flex flex-col text-[10px] sm:text-xs bg-white">
        <PostHeader
          postId={post._id!}
          created_at={post.createdAt!}
          index={index}
          current={current}
        />
        <PostBody repliedTo={post.repliedTo as Post} content={post.content} />
        <PostToolbar post={post} />
      </div>
    </div>
  );
}
