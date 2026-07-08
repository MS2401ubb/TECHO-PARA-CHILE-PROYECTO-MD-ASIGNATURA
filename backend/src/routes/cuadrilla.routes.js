import { Router } from "express";
import {
	getCuadrillas,
	createCuadrilla,
	getCuadrillaByCodigo,
	editCuadrilla,
	deleteCuadrilla,
	asignarCuadrillaAVivienda,
	asignarVoluntarioACuadrilla,
	asignarJefeCuadrillaACuadrilla,
	getMiCuadrillaYVivienda,
	getTokenCuadrilla,
	getTokenVoluntario,
	validarTokenExpress,
	isTokenExist
} from "../controllers/cuadrilla.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";
import { verificarTokenExistente } from "../services/cuadrilla.service.js";

const router = Router();

router.get(
	"/mi-cuadrilla-vivienda",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla"]),
	getMiCuadrillaYVivienda
);

router.get(
	"/",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"]),
	getCuadrillas
);
router.post(
	"/",
	authenticateJwt,
	verifyRoles(["Encargado de Central", "admin"]),
	createCuadrilla
);
router.post("/token/canjear",getTokenVoluntario);
router.get("/token/validar/:token/:rut",validarTokenExpress);
router.get(
	"/:codigo",
	authenticateJwt,
	verifyRoles(["Voluntario", "Jefe de Cuadrilla", "Encargado de Voluntarios", "Encargado de Central", "admin"]),
	getCuadrillaByCodigo
);
router.post(
	"/:codigo/token",
	authenticateJwt,
	verifyRoles(["Jefe de Cuadrilla"]),
	getTokenCuadrilla
);
router.post(
	"/:codigo/asignar-vivienda",
	authenticateJwt,
	verifyRoles(["Encargado de Voluntarios", "Encargado de Central"]),
	asignarCuadrillaAVivienda
);
router.get("/:codigo/existe-token",authenticateJwt,verifyRoles(["Jefe de Cuadrilla"]),isTokenExist);
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