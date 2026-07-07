import { Router } from "express";
import { getViviendas, getViviendaByCodigo, editVivienda, deleteVivienda, finalizarVivienda } from "../controllers/vivienda.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.get("/", getViviendas);
router.get("/:codigo", getViviendaByCodigo);
router.patch("/:codigo", editVivienda);
router.delete("/:codigo", deleteVivienda);
router.post(
	"/:codigo/finalizar",
	authenticateJwt,
	verifyRoles(["Jefe de Cuadrilla", "Encargado de Central", "admin"]),
	finalizarVivienda
);

export default router;