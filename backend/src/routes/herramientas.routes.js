import { Router } from "express";
import { getHerramientas, getHerramientaByCodigo, editHerramienta, deleteHerramienta, validarSuficienciaHerramientas, confirmarRecepcionController, finalizarJornadaController, autorizarCierreController, setupJornadaController, crearTareaController, obtenerTareasController, obtenerTareaController, marcarTareaController, confirmarValidacionTecnicaController } from "../controllers/herramientas.controller.js";
import { validarCalculoSuficiencia, validarConfirmarRecepcion, validarFinalizarJornada, validarAutorizarCierre, validarCrearTarea, validarMarcarTarea, validarConfirmarValidacionTecnica } from "../validations/herramientas.validation.js";
import { authenticateJwt } from "../middleware/authentication.middleware.js";
import { verifyRoles } from "../middleware/authorization.middleware.js";

const router = Router();

// ============================================================
// RUTAS CRUD DE HERRAMIENTAS
// ============================================================

router.get("/", getHerramientas);
router.get("/:codigo", getHerramientaByCodigo);
router.patch("/:codigo", editHerramienta);
router.delete("/:codigo", deleteHerramienta);
router.post(
    "/validar-suficiencia",
    authenticateJwt,
    verifyRoles(["Encargado de Central", "admin"]),
    validarCalculoSuficiencia,
    validarSuficienciaHerramientas
);

// ============================================================
// RUTAS DE JORNADA
// ============================================================

// PASO 1: Jefe confirma recepción (Mañana)
router.post(
    "/:id/confirmar-recepcion",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla"]),
    validarConfirmarRecepcion,
    confirmarRecepcionController
);

// PASO 1 (Deprecated): Endpoint antiguo setupJornada redirige a confirmar-recepcion
router.post(
    "/:id/setup",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla"]),
    validarConfirmarRecepcion,
    setupJornadaController
);

// PASO 2: Jefe finaliza jornada con validaciones técnicas (Tarde)
router.post(
    "/:id/finalizar",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla"]),
    validarFinalizarJornada,
    finalizarJornadaController
);

// PASO 3: Central autoriza o rechaza cierre si está bloqueado
router.patch(
    "/:id/autorizar-cierre",
    authenticateJwt,
    verifyRoles(["Encargado de Central", "admin"]),
    validarAutorizarCierre,
    autorizarCierreController
);

// ============================================================
// RUTAS DE TAREAS DE VALIDACIÓN TÉCNICA
// ============================================================

// Crear una nueva tarea de validación
router.post(
    "/:id/tareas-validacion",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla"]),
    validarCrearTarea,
    crearTareaController
);

// Obtener todas las tareas de una jornada
router.get(
    "/:id/tareas-validacion",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla", "Encargado de Central", "admin"]),
    obtenerTareasController
);

// Obtener una tarea específica
router.get(
    "/:id/tareas-validacion/:idTarea",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla", "Encargado de Central", "admin"]),
    obtenerTareaController
);

// Marcar o desmarcar una tarea
router.patch(
    "/:id/tareas-validacion/:idTarea",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla"]),
    validarMarcarTarea,
    marcarTareaController
);

// Confirmar validación técnica (bloquea todas las tareas)
router.post(
    "/:id/confirmar-validacion-tecnica",
    authenticateJwt,
    verifyRoles(["Jefe de Cuadrilla"]),
    validarConfirmarValidacionTecnica,
    confirmarValidacionTecnicaController
);

export default router;