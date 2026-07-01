import { handleVoteUpdate } from "../controllers/vote.controller";
import { Router } from "express";
import isAuthenticated from "../middleware/is-authenticated";

const r = Router();

r.patch("/", isAuthenticated, handleVoteUpdate);

export default r;
