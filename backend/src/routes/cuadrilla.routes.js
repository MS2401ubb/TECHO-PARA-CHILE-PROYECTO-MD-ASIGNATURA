import { Router } from "express";
import {
	getCuadrillas,
	getCuadrillaByCodigo,
	editCuadrilla,
	deleteCuadrilla,
	asignarVoluntarioACuadrilla,
	asignarJefeCuadrillaACuadrilla,
	getTokenCuadrilla,
	getTokenVoluntario
} from "../controllers/cuadrilla.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.get(
	"/",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"]),
	getCuadrillas
);
router.post("/token/canjear",getTokenVoluntario);
router.get(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"]),
	getCuadrillaByCodigo
);
router.post("/:codigo/token",authenticateJwt,verifyRoles(["Jefe de Cuadrilla"]),getTokenCuadrilla);
router.post(
	"/:codigo/asignar-voluntario",
	authenticateJwt,
	verifyRoles(["Encargado de Voluntarios", "Encargado de Central"]),
	asignarVoluntarioACuadrilla
);
router.post(
	"/:codigo/asignar-jefe-cuadrilla",
	authenticateJwt,
	verifyRoles(["Encargado de Voluntarios", "Encargado de Central"]),
	asignarJefeCuadrillaACuadrilla
);
router.patch(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	editCuadrilla
);
router.delete(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	deleteCuadrilla
);


export default router;