import { Router } from "express";
import { getUsers, getUserByRut, editUser, deleteUser, asignarRolUsuario } from "../controllers/usuario.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.get("/", getUsers);
router.get("/:rut", getUserByRut);
router.patch(
	"/:rut/asignar-rol",
	authenticateJwt,
	verifyRoles(["admin", "Encargado de Central"]),
	asignarRolUsuario
);
router.patch("/:rut", editUser);
router.delete("/:rut", deleteUser);

export default router;