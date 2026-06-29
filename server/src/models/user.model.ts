import { model, Model, Document, Schema, InferSchemaType } from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  username: string;
  email: string;
  hashedPassword: string;
  pfp: string | null;
  likes: string[] | [];
  status: string | null;
  city: string | null;
}

export interface IUserDocument extends IUser, Document {
  setPassword: (password: string) => Promise<void>;
  verifyPassword: (password: string) => Promise<boolean>;
}

export interface IUserModel extends Model<IUserDocument> {
  findByEmail: (email: string) => Promise<IUserDocument>;
}

const UserSchema: Schema<IUserDocument> = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // basic email check
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /.+\@.+\..+/,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    pfp: {
      type: String,
      default: null,
    },
    likes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

UserSchema.methods.verifyPassword = async function (password: string) {
  const result = await bcrypt.compare(password, this.hashedPassword);
  return result;
};

UserSchema.methods.setPassword = async function (password: string) {
  const hashed = await bcrypt.hash(password, 10);
  this.hashedPassword = hashed;
  await this.save();
};

UserSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email });
};

export type UserType = InferSchemaType<typeof UserSchema>;
const User = model<IUserDocument, IUserModel>("User", UserSchema);
export default User;
