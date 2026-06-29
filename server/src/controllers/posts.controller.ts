import { Request, Response } from "express";
import errorResponse, { ErrorResponse } from "../helpers/error-response";
import { AppError } from "./auth.controller";
import Post from "../models/post.model";
import successResponse from "../helpers/success-response";
import { Types } from "mongoose";
import Vote from "../models/vote.model";

export async function handleGetPostsMeta(req: Request, res: Response) {
  try {
    // for now this should be fine
    const limit = 10;
    const totalItems = await Post.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    return successResponse({ res, data: { totalPages, totalItems } });
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

export async function handleGetPosts(req: Request, res: Response) {
  const { id, userId, cursor } = req.query;
  const page = Number(req.query.p || req.query.page) || 1;
  const limit = Number(req.query.l || req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const currentUserId = req.user?._id;

  try {
    if (userId) {
      // const mentions = await Post.find({
      //   author: userId,
      //   repliedTo: { $ne: null },
      // }).countDocuments(); // this will find every post of user where repliedTo is not null

      const query: any = {
        author: new Types.ObjectId(String(userId)),
      };
      if (cursor && cursor !== "undefined")
        query._id = { $gt: new Types.ObjectId(String(cursor)) };
      // const posts = await Post.find(query).sort({ _id: 1 }).limit(limit);
      const posts = await Post.aggregate([
        { $match: query },
        { $sort: { _id: 1 } },
        { $limit: limit + 1 },
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
            scoreOfPost: {
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
            currentUserVote: {
              $first: {
                $filter: {
                  input: "$votes",
                  as: "v",
                  cond: { $eq: ["$$v.user_id", currentUserId] },
                },
              },
            },
          },
        },
        {
          $addFields: {
            votedByUser: {
              $cond: [{ $ifNull: ["$currentUserVote", null] }, true, false],
            },
            voteType: { $ifNull: ["$currentUserVote.type", null] },
          },
        },
        { $unset: ["votes", "currentUserVote"] },
        {
          $lookup: {
            from: "users",
            localField: "author",
            foreignField: "_id",
            as: "author",
            pipeline: [{ $project: { hashedPassword: 0 } }],
          },
        },
        { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: "posts",
            localField: "repliedTo",
            foreignField: "_id",
            as: "repliedTo",
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "author",
                  foreignField: "_id",
                  as: "author",
                  pipeline: [{ $project: { hashedPassword: 0 } }],
                },
              },
              // i know preserveNullAndEmptyArrays is not required for author as it will be always there but what if user is deleted?
              {
                $unwind: { path: "$author", preserveNullAndEmptyArrays: true },
              },
            ],
          },
        },
        { $unwind: { path: "$repliedTo", preserveNullAndEmptyArrays: true } },
        {
          $addFields: {
            repliedTo: { $ifNull: ["$repliedTo", null] },
          },
        },
      ]);

      let hasNext;

      if (posts.length > limit) {
        // means next page exist
        hasNext = true;
        posts.pop(); // remove the 11th one
      } else {
        hasNext = false;
      }

      const lastPost = posts[posts.length - 1];
      const data = { posts, nextCursor: hasNext ? lastPost?._id : null };
      return res.status(200).json({ data });
    }

    if (id) {
      const post = await Post.findById(id).populate("author"); // it will check first with users.findOne({ _id: author })
      if (!post) {
        return errorResponse(res, "No such record exists", "NOT_FOUND", 404);
      }
      return successResponse({ res, data: post });
    }

    const items = await Post.aggregate([
      // ascending order
      { $sort: { createdAt: 1 } },
      { $skip: skip },
      { $limit: limit },
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
          scoreOfPost: {
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
          currentUserVote: {
            $first: {
              $filter: {
                input: "$votes",
                as: "v",
                cond: { $eq: ["$$v.user_id", currentUserId] },
              },
            },
          },
        },
      },
      {
        $addFields: {
          votedByUser: {
            $cond: [{ $ifNull: ["$currentUserVote", null] }, true, false],
          },
          voteType: { $ifNull: ["$currentUserVote.type", null] },
        },
      },
      { $unset: ["votes", "currentUserVote"] },
      {
        $lookup: {
          from: "users",
          localField: "author",
          foreignField: "_id",
          as: "author",
          pipeline: [{ $project: { hashedPassword: 0 } }],
        },
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "posts",
          localField: "repliedTo",
          foreignField: "_id",
          as: "repliedTo",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
                pipeline: [{ $project: { hashedPassword: 0 } }],
              },
            },
            // i know preserveNullAndEmptyArrays is not required for author as it will be always there but what if user is deleted?
            { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
          ],
        },
      },
      { $unwind: { path: "$repliedTo", preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          repliedTo: { $ifNull: ["$repliedTo", null] },
        },
      },
    ]);

    const totalItems = await Post.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const payload = {
      items,
      page,
      limit,
      totalItems,
      totalPages,
      hasNext: page + 1 <= totalPages,
      hasPrev: page - 1 >= 1,
    };

    return successResponse({ res, data: payload });
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

export async function handleCreate(req: Request, res: Response) {
  const { content, author, repliedTo, pageNo } = req.body;

  try {
    const post = await Post.create({ content, author, repliedTo, pageNo });
    return successResponse({
      res,
      statusCode: 201,
      message: "Post created successfully!",
      data: post,
    });
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
