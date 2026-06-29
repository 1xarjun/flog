import { IUserDocument } from "../models/user.model";

declare global {
  namespace Express {
    interface User extends Omit<IUserDocument, "hashedPassword"> {
      /* nothing new just IUserDocument without hashedPassword */
    }
  }
}
