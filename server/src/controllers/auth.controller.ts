import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcrypt";
import passport from "passport";
import errorResponse from "../helpers/error-response";
import successResponse from "../helpers/success-response";
import { ErrorResponse } from "../helpers/error-response";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message); // call Error consturctor(message)
    this.statusCode = statusCode;
  }
}

export function whoAmI(req: Request, res: Response) {
  return successResponse<Express.User>({ res, data: req.user! });
}

export async function handleRegister(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const {
    username,
    email,
    password,
  }: { username: string; email: string; password: string } = req.body;

  if (!username || !email || !password)
    return errorResponse(res, "Invalid user data", "INVALID_INPUT", 400);
  if (password.length < 4)
    return errorResponse(
      res,
      "Password must be atleast 4 characters long",
      "INVALID_INPUT",
      400,
    );

  try {
    const exist = await User.findByEmail(email);
    if (exist)
      return errorResponse(
        res,
        "Email already exists, try logging in",
        "DUPLICATE_ENTRY",
        409,
      );

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, hashedPassword });

    req.logIn(user, (error) => {
      if (error) return next(error);
      // session saved by default
      // so now just return the user

      const { hashedPassword: _, ...rest } = user.toObject();

      return successResponse({
        res,
        statusCode: 201,
        message: "User registered successfully!",
        data: rest,
      });
    });
  } catch (error: any) {
    console.error(error);
    if (error instanceof AppError)
      return errorResponse(
        res,
        error.message,
        error.name as ErrorResponse.Code,
        error.statusCode,
      );

    return errorResponse(res);
  }
}

export function handleLogin(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    "local",
    (error: Error, user: Express.User, info?: { message: string }) => {
      if (error) return next(error);

      if (!user)
        return errorResponse(res, "Invalid credentials", "FORBIDDEN", 401);

      req.logIn(user, (error) => {
        if (error) return next(error);

        const { hashedPassword: _, ...rest } = user.toObject();

        return successResponse({
          res,
          message: "User logged in successfully!",
          data: rest,
        });
      });
    },
  )(req, res, next);
}

export function handleLogout(req: Request, res: Response, next: NextFunction) {
  req.logOut((error: any) => {
    if (error) return next(error);
    res.status(200).json({ message: "User logged out successfully!" });
  });
}
