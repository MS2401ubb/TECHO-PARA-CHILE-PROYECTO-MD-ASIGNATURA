import { getHerramientasService, getHerramientaByCodigoService, editHerramientaService, deleteHerramientaService, validarSuficienciaHerramientasService, confirmarRecepcionService, finalizarJornadaService, autorizarCierreService, crearTareaValidacionService, obtenerTareasValidacionService, obtenerTareaValidacionService, marcarTareaValidacionService, confirmarValidacionTecnicaService } from "../services/herramientas.service.js";
import { editHerramientaBodyValidation } from "../validations/herramientas.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

// ============================================================
// CONTROLADORES CRUD DE HERRAMIENTAS
// ============================================================

export async function getHerramientas(req, res) {
  try {
    const herramientas = await getHerramientasService();

    if (herramientas.length < 1) {
      handleSuccess(res, 200, "No hay herramientas registradas");
    }

    handleSuccess(res, 200, "Herramientas obtenidas exitosamente", herramientas);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener herramientas", error.message);
  }
}

export async function getHerramientaByCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const herramienta = await getHerramientaByCodigoService(codigo);

    handleSuccess(res, 200, "Herramienta encontrada", herramienta);
  } catch (error) {
    if (error.message === "Herramienta no encontrada") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener la herramienta", error.message);
    }
  }
}

export async function editHerramienta(req, res) {
  try {
    const { codigo } = req.params;
    const { body } = req;

    if (!body) return handleErrorClient(res, 400, "Debe especificar al menos 1 parámetro");

    const { error } = editHerramientaBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, "Parámetros inválidos", error.message);

    const updatedHerramienta = await editHerramientaService(codigo, body);

    handleSuccess(res, 200, "Herramienta actualizada exitosamente", updatedHerramienta);
  } catch (error) {
    if (error.code === "23505") {
      if (error.detail?.includes("codigo")) {
        return handleErrorClient(res, 409, "El código ya está registrado");
      }
      return handleErrorClient(res, 409, "Ya existe una herramienta con estos datos");
    } else {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

export async function deleteHerramienta(req, res) {
  try {
    const { codigo } = req.params;
    const result = await deleteHerramientaService(codigo);

    if (!result) return handleErrorClient(res, 404, "Herramienta no encontrada");

    handleSuccess(res, 200, "Herramienta eliminada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar herramienta", error.message);
  }
}

export async function validarSuficienciaHerramientas(req, res) {
    try {
        const { codigo_cuadrilla, codigo_vivienda, herramientas } = req.body;
        const rutCentral = req.user?.rut || req.user?.documento || null;

        const resultado = await validarSuficienciaHerramientasService(codigo_cuadrilla, codigo_vivienda, herramientas, rutCentral);

        if (!resultado.puedeAsignarse) {
            return handleErrorClient(
                res,
                409,
                "Asignación bloqueada por déficit de herramientas",
                resultado
            );
        }

        return handleSuccess(res, 200, resultado.mensaje, resultado);
    } catch (error) {
        if (
            error.message.includes("no tiene voluntarios") ||
            error.message.includes("No existe configuración") ||
            error.message.includes("no encontrada") ||
            error.message.includes("codigo de cuadrilla") ||
            error.message.includes("vivienda")
        ) {
            return handleErrorClient(res, 400, error.message);
        }

        return handleErrorServer(res, 500, "Error al validar suficiencia de herramientas", error.message);
    }
}

// ============================================================
// CONTROLADORES DE JORNADA
// ============================================================

/**
 * PASO 1: Jefe confirma recepción de herramientas autorizadas por Central
 */
export async function confirmarRecepcionController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const { codigo_cuadrilla, herramientas } = req.body;
        const rutJefe = req.user.rut || req.user.documento;
        
        if (!rutJefe) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        const resultado = await confirmarRecepcionService(idJornada, codigo_cuadrilla, herramientas, rutJefe);
        return handleSuccess(res, 201, resultado.mensaje, resultado);
    } catch (error) {
        if (error.message.includes("no encontrada") || error.message.includes("no está asignada")) {
            return handleErrorClient(res, 404, error.message);
        }
        if (error.message.includes("validación previa") || error.message.includes("bloqueado")) {
            return handleErrorClient(res, 409, error.message);
        }
        return handleErrorServer(res, 500, "Error al confirmar recepción", error.message);
    }
}

/**
 * PASO 2: Jefe finaliza jornada con conteo y validaciones técnicas
 * Devuelve 202 si está bloqueado (descuadre detectado)
 * Devuelve 200 si cierra correctamente
 */
export async function finalizarJornadaController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const { montajeEstructural, habilidadTecnica, conexionesBasicas, observaciones, herramientas } = req.body;
        const rutJefe = req.user.rut || req.user.documento;

        if (!rutJefe) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        const resultado = await finalizarJornadaService(
            idJornada, 
            herramientas, 
            montajeEstructural, 
            habilidadTecnica, 
            conexionesBasicas, 
            observaciones,
            rutJefe
        );

        // Si está bloqueado: devolver 202 (Accepted, pending approval)
        if (resultado.estado_respuesta === 'BLOQUEADO') {
            return res.status(resultado.httpStatus).json({
                estado: resultado.estado_respuesta,
                mensaje: resultado.mensaje,
                detalles_descuadre: resultado.detalles_descuadre,
                instruccion: resultado.instruccion
            });
        }

        // Si cerró sin problemas: devolver 200
        return handleSuccess(res, resultado.httpStatus, resultado.mensaje, {
            estado: resultado.estado_respuesta,
            jornadaId: resultado.jornadaId,
            validacionesRegistradas: resultado.validacionesRegistradas
        });

    } catch (error) {
        if (error.message.includes("Validación técnica")) {
            return handleErrorClient(res, 400, error.message);
        } else if (error.message.includes("Stock no coincide") || error.message.includes("Error:")) {
            return handleErrorClient(res, 409, error.message);
        } else if (error.message.includes("no encontrada") || error.message.includes("no hay registro")) {
            return handleErrorClient(res, 404, error.message);
        }
        return handleErrorServer(res, 500, "Error al finalizar jornada", error.message);
    }
}

/**
 * PASO 3: Central autoriza o rechaza el cierre si hay bloqueado
 */
export async function autorizarCierreController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const { autorizado, motivo_autorizacion } = req.body;
        const rutCentral = req.user.rut || req.user.documento;

        if (!rutCentral) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        // Solo Central/Encargado puede autorizar
        const userRole = req.user.rol || req.user.role;
        if (!['Encargado de Central', 'admin'].includes(userRole)) {
            return handleErrorClient(res, 403, "Solo la Central puede autorizar cierres");
        }

        const resultado = await autorizarCierreService(idJornada, autorizado, motivo_autorizacion, rutCentral);
        return handleSuccess(res, 200, resultado.mensaje, resultado);

    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        } else if (error.message.includes("No hay registros bloqueados")) {
            return handleErrorClient(res, 409, error.message);
        }
        return handleErrorServer(res, 500, "Error al autorizar cierre", error.message);
    }
}

// CONTROLADORES ANTIGUOS (MANTENER POR COMPATIBILIDAD)
export async function setupJornadaController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const { codigo_cuadrilla, codigo_vivienda, herramientas } = req.body;
        const rutJefe = req.user.rut || req.user.documento;
        
        if (!rutJefe) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        const resultado = await confirmarRecepcionService(idJornada, codigo_cuadrilla, codigo_vivienda, herramientas, rutJefe);
        return handleSuccess(res, 201, resultado.mensaje, resultado);
    } catch (error) {
        if (error.message.includes("no encontrada") || error.message.includes("no está asignada")) {
            return handleErrorClient(res, 404, error.message);
        }
        return handleErrorServer(res, 500, "Error al confirmar recepción", error.message);
    }
}

// ============================================================
// CONTROLADORES DE TAREAS DE VALIDACIÓN JORNADA
// ============================================================

/**
 * Crear una nueva tarea de validación
 */
export async function crearTareaController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const { descripcion, observaciones } = req.body;
        const rutJefe = req.user.rut || req.user.documento;

        if (!Number.isInteger(idJornada) || idJornada <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de jornada debe ser un número entero positivo");
        }

        if (!rutJefe) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        const resultado = await crearTareaValidacionService(idJornada, descripcion, observaciones, rutJefe);
        return handleSuccess(res, 201, "Tarea creada exitosamente", resultado);
    } catch (error) {
        if (error.message.includes("Jornada no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        if (error.message.includes("jornada finalizada")) {
            return handleErrorClient(res, 409, error.message);
        }
        return handleErrorServer(res, 500, "Error al crear tarea", error.message);
    }
}

/**
 * Obtener todas las tareas de una jornada
 */
export async function obtenerTareasController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);

        if (!Number.isInteger(idJornada) || idJornada <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de jornada debe ser un número entero positivo");
        }

        const tareas = await obtenerTareasValidacionService(idJornada);
        return handleSuccess(res, 200, "Tareas obtenidas exitosamente", tareas);
    } catch (error) {
        return handleErrorServer(res, 500, "Error al obtener tareas", error.message);
    }
}

/**
 * Obtener una tarea específica
 */
export async function obtenerTareaController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const idTarea = parseInt(req.params.idTarea);

        if (!Number.isInteger(idJornada) || idJornada <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de jornada debe ser un número entero positivo");
        }

        if (!Number.isInteger(idTarea) || idTarea <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de tarea debe ser un número entero positivo");
        }

        const tarea = await obtenerTareaValidacionService(idTarea);
        return handleSuccess(res, 200, "Tarea obtenida exitosamente", tarea);
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        return handleErrorServer(res, 500, "Error al obtener tarea", error.message);
    }
}

/**
 * Marcar o desmarcar una tarea
 */
export async function marcarTareaController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const idTarea = parseInt(req.params.idTarea);
        const { marcar } = req.body;
        const rutJefe = req.user.rut || req.user.documento;

        if (!Number.isInteger(idJornada) || idJornada <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de jornada debe ser un número entero positivo");
        }

        if (!Number.isInteger(idTarea) || idTarea <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de tarea debe ser un número entero positivo");
        }

        if (!rutJefe) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        const resultado = await marcarTareaValidacionService(idTarea, marcar, rutJefe);
        return handleSuccess(res, 200, `Tarea marcada como ${marcar ? 'completada' : 'pendiente'}`, resultado);
    } catch (error) {
        if (error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        if (error.message.includes("confirmada")) {
            return handleErrorClient(res, 409, error.message);
        }
        return handleErrorServer(res, 500, "Error al marcar tarea", error.message);
    }
}

/**
 * Confirmar validación técnica (bloquea todas las tareas)
 */
export async function confirmarValidacionTecnicaController(req, res) {
    try {
        const idJornada = parseInt(req.params.id);
        const rutJefe = req.user.rut || req.user.documento;

        if (!Number.isInteger(idJornada) || idJornada <= 0) {
            return handleErrorClient(res, 400, "Parámetros inválidos", "El id de jornada debe ser un número entero positivo");
        }

        if (!rutJefe) {
            return handleErrorClient(res, 401, "No se encontró identificación de usuario en el token");
        }

        const resultado = await confirmarValidacionTecnicaService(idJornada, rutJefe);
        return handleSuccess(res, 200, resultado.mensaje, resultado);
    } catch (error) {
        if (error.message.includes("No hay tareas") || error.message.includes("no encontrada")) {
            return handleErrorClient(res, 404, error.message);
        }
        if (error.message.includes("pendiente")) {
            return handleErrorClient(res, 400, error.message);
        }
        return handleErrorServer(res, 500, "Error al confirmar validación técnica", error.message);
    }
}