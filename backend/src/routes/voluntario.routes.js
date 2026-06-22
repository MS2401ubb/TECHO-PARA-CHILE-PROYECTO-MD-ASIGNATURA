import { Router } from "express";
import { listaPostulantes, listaVoluntarios, voluntarioPorRut } from "../controllers/voluntario.controller.js";

const router = Router();

router.get("/postulantes", listaPostulantes);
router.get("/voluntarios", listaVoluntarios);
router.get("/voluntario/:rut", voluntarioPorRut);

export default router;