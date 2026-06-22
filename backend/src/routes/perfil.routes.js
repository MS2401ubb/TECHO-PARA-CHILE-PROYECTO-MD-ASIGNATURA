import { Router } from "express";
import { getUsers,getUserById,editUser,deleteUser } from "../controllers/perfil.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:id", getUserById);
router.patch("/:id", editUser);
router.delete("/:id", deleteUser);

export default router;