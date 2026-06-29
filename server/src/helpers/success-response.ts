import { Response } from "express";

export default function successResponse<T = any>({
  res,
  statusCode = 200,
  message,
  data,
}: {
  res: Response;
  statusCode?: number;
  message?: string;
  data: T;
}) {
  const payload: { message?: string; data: T } = { data };
  if (message) payload.message = message;

  return res.status(statusCode).json(payload);
}
