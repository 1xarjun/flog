import { Router } from "express";
import AuthRouter from "./auth.router";
import PostsRouter from "./posts.router";
import VoteRouter from "./votes.router";
import UsersRouter from "./users.router";
import isAuthenticated from "../middleware/is-authenticated";
import Vote from "../models/vote.model";
import { Types } from "mongoose";
import Post from "../models/post.model";

const router = Router();

router.use("/auth", AuthRouter);
router.use("/posts", PostsRouter);
router.use("/votes", VoteRouter);
router.use("/users", UsersRouter);

export default router;
