/*
vote schema
user_id    vote_type     post_id
e515185g   up | down     e511ngs
*/

import { InferSchemaType, model, Schema } from "mongoose";

const VoteSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["up", "down"],
      lowercase: true,
      required: true,
    },
    post_id: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true },
);

export type Vote = InferSchemaType<typeof VoteSchema>;
const Vote = model<Vote>("Vote", VoteSchema);
export default Vote;
