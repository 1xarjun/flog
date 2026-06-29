import { Router } from "express";
import {
  handleGetUserData,
  handleUpdateUserData,
} from "../controllers/users.controller";
import isAuthenticated from "../middleware/is-authenticated";

const r = Router();

r.get("/:id", handleGetUserData);
r.post("/:id", isAuthenticated, handleUpdateUserData);

export default r;
