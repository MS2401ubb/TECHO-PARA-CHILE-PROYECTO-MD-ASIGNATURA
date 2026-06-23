import {
  getCuadrillasService,
  getCuadrillaByCodigoService,
  editCuadrillaService,
  deleteCuadrillaService,
  asignarVoluntarioACuadrillaService,
  asignarJefeCuadrillaACuadrillaService,
} from "../services/cuadrilla.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getCuadrillas(req, res) {
  try {
    const cuadrillas = await getCuadrillasService();

    if (cuadrillas.length < 1) {
      handleSuccess(res, 200, "No hay cuadrillas registradas");
    }

    handleSuccess(res, 200, "Cuadrillas obtenidas exitosamente", cuadrillas);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener cuadrillas", error.message);
  }
}

export async function getCuadrillaByCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const cuadrilla = await getCuadrillaByCodigoService(codigo);

    handleSuccess(res, 200, "Cuadrilla encontrada", cuadrilla);
  } catch (error) {
    if (error.message === "Cuadrilla no encontrada") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener la cuadrilla", error.message);
    }
  }
}

export async function editCuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const { body } = req;

    if (!body) return handleErrorClient(res, 400, "Debe especificar al menos 1 parámetro");

    const updatedCuadrilla = await editCuadrillaService(codigo, body);

    handleSuccess(res, 200, "Cuadrilla actualizada exitosamente", updatedCuadrilla);
  } catch (error) {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    
  }
}

export async function deleteCuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const result = await deleteCuadrillaService(codigo);

    if (!result) return handleErrorClient(res, 404, "Cuadrilla no encontrada");

    handleSuccess(res, 200, "Cuadrilla eliminada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar cuadrilla", error.message);
  }
}

export async function asignarVoluntarioACuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const { rutVoluntario, fechaInicio } = req.body;

    if (!rutVoluntario) {
      return handleErrorClient(res, 400, "El rutVoluntario es obligatorio");
    }

    const data = await asignarVoluntarioACuadrillaService(rutVoluntario, codigo, fechaInicio);
    handleSuccess(res, 201, "Voluntario asignado a cuadrilla exitosamente", data);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    if (
      error.message.includes("Solo se pueden asignar") ||
      error.message.includes("ya está asignado") ||
      error.message.includes("código") ||
      error.message.includes("fechaInicio")
    ) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al asignar voluntario a cuadrilla", error.message);
  }
}

export async function asignarJefeCuadrillaACuadrilla(req, res) {
  try {
    const { codigo } = req.params;
    const { rutJefeCuadrilla, fechaInicio } = req.body;

    if (!rutJefeCuadrilla) {
      return handleErrorClient(res, 400, "El rutJefeCuadrilla es obligatorio");
    }

    const data = await asignarJefeCuadrillaACuadrillaService(rutJefeCuadrilla, codigo, fechaInicio);
    handleSuccess(res, 201, "Jefe de cuadrilla asignado exitosamente", data);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      return handleErrorClient(res, 404, error.message);
    }
    if (
      error.message.includes("ya lidera") ||
      error.message.includes("ya tiene") ||
      error.message.includes("código") ||
      error.message.includes("fechaInicio")
    ) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al asignar jefe de cuadrilla", error.message);
  }
}