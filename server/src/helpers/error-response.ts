import { Response } from "express";

export namespace ErrorResponse {
  export type Code =
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "INVALID_INPUT"
    | "INTERNAL_SERVER_ERROR"
    | "DUPLICATE_ENTRY";
  // overkill but whatever
}

export default function errorResponse(
  res: Response,
  message: string = "Something went wrong",
  code: ErrorResponse.Code = "INTERNAL_SERVER_ERROR",
  statusCode: number = 500,
) {
  return res.status(statusCode).json({ error: { message, code } });
}
