import { Router } from "express";
import {
  handleGetPosts,
  handleCreate,
  handleGetPostsMeta,
} from "../controllers/posts.controller";

const router = Router();

router.get("/", handleGetPosts);
router.get("/meta-data", handleGetPostsMeta);
router.post("/", handleCreate);

export default router;
