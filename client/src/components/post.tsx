import type { Post } from "@/Posts";
import UserInfo from "./user-info";
import PostToolbar from "./post-toolbar";
import PostHeader from "./post-header";
import PostBody from "./post-body";

export default function Post({ post, index }: { post: Post; index: number }) {
  return (
    <div
      id={(index + 1).toString()}
      className="grid grid-cols-8 border rounded-xs"
    >
      <div className="col-span-1 flex flex-col border-r bg-[#f9f9f9]">
        <UserInfo user={post.user} />
      </div>

      <div className="col-span-7 flex flex-col gap-2 text-xs bg-white">
        <PostHeader created_at={post.created_at} index={index} />
        <PostBody title={post.title} description={post.description} />
        <PostToolbar upvotes={post.upvotes} downvotes={post.downvotes} />
      </div>
    </div>
  );
}
