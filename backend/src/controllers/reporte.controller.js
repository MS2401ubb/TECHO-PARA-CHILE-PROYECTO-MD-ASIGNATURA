import {
  actualizarEstadoReporteService,
  crearReporteService,
  listarReportesService,
  obtenerReportePorIdService,
} from "../services/reporte.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";
import {
  actualizarEstadoReporteBodyValidation,
  crearReporteBodyValidation,
  listarReportesQueryValidation,
} from "../validations/reporte.validation.js";

export async function crearReporte(req, res) {
  try {
    const rutRemitente = req.user?.rut;
    if (!rutRemitente) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const { error, value } = crearReporteBodyValidation.validate(req.body);
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Datos del reporte inválidos",
        error.details.map((detail) => detail.message),
      );
    }

    const reporte = await crearReporteService(value, rutRemitente);
    handleSuccess(res, 201, "Reporte enviado exitosamente", reporte);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al enviar reporte", error.message);
    }
  }
}

export async function listarReportes(req, res) {
  try {
    const { error, value } = listarReportesQueryValidation.validate(req.query);
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Filtros de reportes inválidos",
        error.details.map((detail) => detail.message),
      );
    }

    const reportes = await listarReportesService(value);
    handleSuccess(res, 200, "Reportes obtenidos exitosamente", reportes);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener reportes", error.message);
  }
}

export async function obtenerReportePorId(req, res) {
  try {
    const reporte = await obtenerReportePorIdService(req.params.id);
    handleSuccess(res, 200, "Reporte encontrado", reporte);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      handleErrorClient(res, 404, error.message);
    } else if (error.message.includes("id del reporte")) {
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener reporte", error.message);
    }
  }
}

export async function actualizarEstadoReporte(req, res) {
  try {
    const { error, value } = actualizarEstadoReporteBodyValidation.validate(req.body);
    if (error) {
      return handleErrorClient(
        res,
        400,
        "Estado de reporte inválido",
        error.details.map((detail) => detail.message),
      );
    }

    const reporte = await actualizarEstadoReporteService(req.params.id, value.estado);
    handleSuccess(res, 200, "Estado de reporte actualizado exitosamente", reporte);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      handleErrorClient(res, 404, error.message);
    } else if (error.message.includes("id del reporte")) {
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, "Error al actualizar estado del reporte", error.message);
    }
  }
}

