import { Router } from "express";
import { getViviendas, getViviendaByCodigo, editVivienda, deleteVivienda } from "../controllers/vivienda.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.get(
	"/",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"]),
	getViviendas
);
router.get(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"]),
	getViviendaByCodigo
);
router.patch(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	editVivienda
);
router.delete(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	deleteVivienda
);

export default router;