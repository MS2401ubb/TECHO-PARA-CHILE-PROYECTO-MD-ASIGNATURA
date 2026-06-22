import { getCuadrillasService, getCuadrillaByCodigoService, editCuadrillaService, deleteCuadrillaService } from "../services/cuadrilla.service.js";
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