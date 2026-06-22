import { Router } from "express";
import { getCuadrillas, getCuadrillaByCodigo, editCuadrilla, deleteCuadrilla } from "../controllers/cuadrilla.controller.js";

const router = Router();

router.get("/", getCuadrillas);
router.get("/:codigo", getCuadrillaByCodigo);
router.patch("/:codigo", editCuadrilla);
router.delete("/:codigo", deleteCuadrilla);

export default router;