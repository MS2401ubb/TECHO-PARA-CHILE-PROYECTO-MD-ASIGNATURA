import { Router } from "express";
import { getMateriales, getMaterialByCodigo, editMaterial, deleteMaterial } from "../controllers/material.controller.js";

const router = Router();

router.get("/", getMateriales);
router.get("/:codigo", getMaterialByCodigo);
router.patch("/:codigo", editMaterial);
router.delete("/:codigo", deleteMaterial);

export default router;