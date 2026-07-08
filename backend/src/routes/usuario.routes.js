import { Router } from "express";
import { getUsers, getJefesCuadrilla, getUserByRut, editUser, deleteUser, asignarRolUsuario } from "../controllers/usuario.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.get(
	"/jefes-cuadrilla",
	authenticateJwt,
	verifyRoles(["admin", "Encargado de Central", "Encargado de Voluntarios"]),
	getJefesCuadrilla
);
router.get(
	"/",
	authenticateJwt,
	verifyRoles(["admin", "Encargado de Central"]),
	getUsers
);
router.get(
	"/:rut",
	authenticateJwt,
	verifyRoles(["admin", "Encargado de Central"]),
	getUserByRut
);
router.patch(
	"/:rut",
	authenticateJwt,
	editUser
);
router.patch(
	"/:rut/asignar-rol",
	authenticateJwt,
	verifyRoles(["admin", "Encargado de Central"]),
	asignarRolUsuario
);
router.delete(
	"/:rut",
	authenticateJwt,
	verifyRoles(["admin"]),
	deleteUser
);

export default router;