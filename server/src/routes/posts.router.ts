import { Router } from "express";
import {
  handleGetPosts,
  handleCreate,
  handleGetPostsMeta,
} from "../controllers/posts.controller";
import isAuthenticated from "../middleware/is-authenticated";

const router = Router();

router.get("/", handleGetPosts);
router.get("/meta-data", handleGetPostsMeta);
router.post("/", handleCreate);

export default router;
