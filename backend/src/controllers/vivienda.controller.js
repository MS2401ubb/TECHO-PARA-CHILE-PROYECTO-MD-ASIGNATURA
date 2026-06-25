import { getViviendasService, getViviendaByCodigoService, editViviendaService, deleteViviendaService } from "../services/vivienda.service.js";
import { editViviendaBodyValidation } from "../validations/vivienda.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getViviendas(req, res) {
  try {
    const viviendas = await getViviendasService();

    if (viviendas.length < 1) {
      handleSuccess(res, 200, "No hay viviendas registradas");
    }

    handleSuccess(res, 200, "Viviendas obtenidas exitosamente", viviendas);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener viviendas", error.message);
  }
}

export async function getViviendaByCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const vivienda = await getViviendaByCodigoService(codigo);

    handleSuccess(res, 200, "Vivienda encontrada", vivienda);
  } catch (error) {
    if (error.message === "Vivienda no encontrada") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener la vivienda", error.message);
    }
  }
}

export async function editVivienda(req, res) {
  try {
    const { codigo } = req.params;
    const { body } = req;

    if (!body) return handleErrorClient(res, 400, "Debe especificar al menos 1 parámetro");

    const { error } = editViviendaBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, "Parámetros inválidos", error.message);

    const updatedVivienda = await editViviendaService(codigo, body);

    handleSuccess(res, 200, "Vivienda actualizada exitosamente", updatedVivienda);
  } catch (error) {
    if (error.code === "23505") {
      if (error.detail?.includes("codigo")) {
        return handleErrorClient(res, 409, "El código ya está registrado");
      }
      return handleErrorClient(res, 409, "Ya existe una vivienda con estos datos");
    } else {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

export async function deleteVivienda(req, res) {
  try {
    const { codigo } = req.params;
    const result = await deleteViviendaService(codigo);

    if (!result) return handleErrorClient(res, 404, "Vivienda no encontrada");

    handleSuccess(res, 200, "Vivienda eliminada exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar vivienda", error.message);
  }
}
