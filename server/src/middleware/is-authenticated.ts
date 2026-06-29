import type { NextFunction, Request, Response } from "express";
import errorResponse from "../helpers/error-response";

export default function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (!req.user)
    return errorResponse(res, "Unauthorized access", "UNAUTHORIZED", 401);
  next();
}
