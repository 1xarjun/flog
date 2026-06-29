import { Router } from "express";
import isAuthenticated from "../middleware/is-authenticated";
import {
  handleLogin,
  handleLogout,
  handleRegister,
  whoAmI,
} from "../controllers/auth.controller";
const router = Router();

router.get("/whoami", isAuthenticated, whoAmI);
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.post("/logout", isAuthenticated, handleLogout);

export default router;
