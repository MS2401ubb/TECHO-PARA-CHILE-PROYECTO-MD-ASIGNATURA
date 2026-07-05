import { Router } from "express";
import {
	getCuadrillas,
	getCuadrillaByCodigo,
	editCuadrilla,
	deleteCuadrilla,
	asignarVoluntarioACuadrilla,
	asignarJefeCuadrillaACuadrilla,
	getTokenCuadrilla,
} from "../controllers/cuadrilla.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.get("/", getCuadrillas);
router.get("/:codigo", getCuadrillaByCodigo);
router.patch("/:codigo", editCuadrilla);
router.delete("/:codigo", deleteCuadrilla);
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

router.post("/:codigo/token",authenticateJwt,verifyRoles(["Jefe de Cuadrilla"]),getTokenCuadrilla);


export default router;