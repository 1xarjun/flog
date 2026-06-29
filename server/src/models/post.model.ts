import { InferSchemaType, model, Schema } from "mongoose";

const PostSchema = new Schema(
  {
    content: {
      type: Schema.Types.Mixed,
      required: true,
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    repliedTo: {
      type: Schema.Types.ObjectId,
      ref: "Post",
      required: false,
      // default: null,
    },
    pageNo: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export type Post = InferSchemaType<typeof PostSchema>;
const Post = model<Post>("Post", PostSchema);
export default Post;
