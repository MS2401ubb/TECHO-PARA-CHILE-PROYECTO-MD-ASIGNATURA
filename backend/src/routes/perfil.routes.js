import { Router } from "express";
import { x } from "../controllers/perfil.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", editUser);
router.delete("/:id", deleteUser);

export default router;