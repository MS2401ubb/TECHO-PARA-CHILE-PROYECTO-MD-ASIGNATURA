import { Router } from "express";
import { getViviendas, getViviendaByCodigo, editVivienda, deleteVivienda } from "../controllers/vivienda.controller.js";

const router = Router();

router.get("/", getViviendas);
router.get("/:codigo", getViviendaByCodigo);
router.patch("/:codigo", editVivienda);
router.delete("/:codigo", deleteVivienda);

export default router;