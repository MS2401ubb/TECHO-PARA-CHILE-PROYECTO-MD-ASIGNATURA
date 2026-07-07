import { Router } from "express";
import { login, register, logout } from "../controllers/auth.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";

const router = Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", authenticateJwt, logout);

export default router;