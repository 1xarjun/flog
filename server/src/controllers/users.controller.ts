import { Types } from "mongoose";
import errorResponse, { ErrorResponse } from "../helpers/error-response";
import Post from "../models/post.model";
import User from "../models/user.model";
import Vote from "../models/vote.model";
import { AppError } from "./auth.controller";
import { Request, Response } from "express";

export async function handleUpdateUserData(req: Request, res: Response) {
  try {
    const { id: userId } = req.params;
    // const { pfp, status, city, likes } = req.body;
    const input = req.body;
    const userInSessionId = req.user!._id;
    const isOwner = userId === userInSessionId.toString();
    if (!isOwner) return res.status(401).json({ message: "Invalid" });
    if (!Array.isArray(input.likes))
      return res.status(400).json({ message: "Bad request" });
    // const user = await User.findByIdAndUpdate(userInSessionId, {
    //   pfp,
    //   status,
    //   city,
    //   likes,
    // });
    await User.findByIdAndUpdate(userInSessionId, input);
    res.status(200).json({ message: "Successfully updated user data" });
  } catch (err) {
    console.error(err);
  }
}

export async function handleGetUserData(req: Request, res: Response) {
  try {
    const { id: userId } = req.params;
    const user = await User.findById(userId).select("-hashedPassword");

    const upvotedByUser = await Vote.find({
      user_id: userId,
      type: "up",
    }).countDocuments();

    const userStats = await Post.aggregate([
      { $match: { author: new Types.ObjectId(userId as unknown as string) } },

      {
        $lookup: {
          from: "votes",
          localField: "_id",
          foreignField: "post_id",
          as: "votes",
        },
      },

      {
        $addFields: {
          count: 1,
          score: {
            $subtract: [
              {
                $size: {
                  $filter: {
                    input: "$votes",
                    as: "v",
                    cond: { $eq: ["$$v.type", "up"] },
                  },
                },
              },

              {
                $size: {
                  $filter: {
                    input: "$votes",
                    as: "v",
                    cond: { $eq: ["$$v.type", "down"] },
                  },
                },
              },
            ],
          },
        },
      },

      {
        $group: {
          _id: null,
          mentions: {
            $sum: {
              $cond: [{ $ne: ["$repliedTo", null] }, 1, 0],
            },
          },
          scoreOfUser: {
            $sum: "$score",
          },
          numberOfPosts: { $sum: "$count" },
        },
      },

      { $unset: ["_id"] },
    ]);

    const stats = { ...userStats[0], upvotedByUser };

    return res.status(200).json({ data: { ...user?.toObject(), stats } });
  } catch (error) {
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
