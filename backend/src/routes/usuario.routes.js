import { Router } from "express";
import { getUsers, getUserByRut, editUser, deleteUser } from "../controllers/usuario.controller.js";

const router = Router();

router.get("/", getUsers);
router.get("/:rut", getUserByRut);
router.patch("/:rut", editUser);
router.delete("/:rut", deleteUser);

export default router;