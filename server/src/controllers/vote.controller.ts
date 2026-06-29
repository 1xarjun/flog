import { Request, Response } from "express";
import errorResponse, { ErrorResponse } from "../helpers/error-response";
import { AppError } from "./auth.controller";
import Vote from "../models/vote.model";
import successResponse from "../helpers/success-response";

export async function handleNewVote(req: Request, res: Response) {
  try {
    const { user_id, type, post_id } = req.body;
    const vote = await Vote.create({ user_id, type, post_id });
    return successResponse({ res, data: vote });
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

export async function handleVoteUpdate(req: Request, res: Response) {
  try {
    const { post_id, type } = req.body;
    const user_id = req.user!._id;

    const vote = await Vote.findOne({ post_id, user_id });

    if (vote && vote.type === type) {
      await Vote.findOneAndDelete({
        post_id,
        user_id,
      });
      return res.status(200).json({ message: "Removed vote document" });
    }

    const response = await Vote.findOneAndUpdate(
      { post_id, user_id }, // filter
      { type }, // update
      { upsert: true }, // this will auto create if it doesnt find a document by the filter above
    );

    res.status(200).json({ message: "Vote registered" });
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
