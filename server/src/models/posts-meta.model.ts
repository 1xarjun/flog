import { InferSchemaType, model, Schema } from "mongoose";

const postsMetaSchema = new Schema(
  {
    totalPages: {
      type: Number,
      required: true,
    },

    totalItems: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true },
);

export type PostsMetaSchema = InferSchemaType<typeof postsMetaSchema>;
const postsMeta = model<PostsMetaSchema>("PostsMeta", postsMetaSchema);
