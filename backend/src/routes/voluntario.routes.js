import { Router } from "express";
import {
  listaPostulantes,
  listaVoluntarios,
  voluntarioPorRut,
  obtenerDetallesVoluntario,
  aprobarPostulante,
  rechazarPostulante,
  obtenerDisponiblesPorZona,
} from "../controllers/voluntario.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

// Rutas públicas (requieren JWT pero no rol específico)
router.get("/postulantes", authenticateJwt, listaPostulantes);
router.get("/voluntarios", authenticateJwt, listaVoluntarios);
router.get("/voluntario/:rut", authenticateJwt, voluntarioPorRut);
router.get("/:rut/detalles", authenticateJwt, obtenerDetallesVoluntario);

// Rutas protegidas solo para Encargado de Voluntarios
router.post(
  "/:rut/aprobar",
  authenticateJwt,
  verifyRoles(["Encargado de Voluntarios"]),
  aprobarPostulante
);

router.post(
  "/:rut/rechazar",
  authenticateJwt,
  verifyRoles(["Encargado de Voluntarios"]),
  rechazarPostulante
);

router.get(
  "/disponibles-zona/:codigoCiudad",
  authenticateJwt,
  verifyRoles(["Encargado de Voluntarios"]),
  obtenerDisponiblesPorZona
);

export default router;
