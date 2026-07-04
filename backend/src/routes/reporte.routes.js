import { Router } from "express";
import {
  actualizarEstadoReporte,
  crearReporte,
  listarReportes,
  obtenerReportePorId,
} from "../controllers/reporte.controller.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

router.post(
  "/",
  authenticateJwt,
  verifyRoles(["Encargado de Voluntarios", "Jefe de Cuadrilla"]),
  crearReporte,
);

router.get(
  "/",
  authenticateJwt,
  verifyRoles(["Encargado de Central", "admin"]),
  listarReportes,
);

router.get(
  "/:id",
  authenticateJwt,
  verifyRoles(["Encargado de Central", "admin"]),
  obtenerReportePorId,
);

router.patch(
  "/:id/estado",
  authenticateJwt,
  verifyRoles(["Encargado de Central", "admin"]),
  actualizarEstadoReporte,
);

export default router;

