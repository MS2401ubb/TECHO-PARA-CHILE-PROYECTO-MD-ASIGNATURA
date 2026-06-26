import { getMaterialesService, getMaterialByCodigoService, editMaterialService, deleteMaterialService } from "../services/material.service.js";
import { editMaterialBodyValidation } from "../validations/material.validation.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function getMateriales(req, res) {
  try {
    const materiales = await getMaterialesService();

    if (materiales.length < 1) {
      handleSuccess(res, 200, "No hay materiales registrados");
    }

    handleSuccess(res, 200, "Materiales obtenidos exitosamente", materiales);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener materiales", error.message);
  }
}

export async function getMaterialByCodigo(req, res) {
  try {
    const { codigo } = req.params;
    const material = await getMaterialByCodigoService(codigo);

    handleSuccess(res, 200, "Material encontrado", material);
  } catch (error) {
    if (error.message === "Material no encontrado") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener el material", error.message);
    }
  }
}

export async function editMaterial(req, res) {
  try {
    const { codigo } = req.params;
    const { body } = req;

    if (!body) return handleErrorClient(res, 400, "Debe especificar al menos 1 parámetro");

    const { error } = editMaterialBodyValidation.validate(body);

    if (error) return handleErrorClient(res, 400, "Parámetros inválidos", error.message);

    const updatedMaterial = await editMaterialService(codigo, body);

    handleSuccess(res, 200, "Material actualizado exitosamente", updatedMaterial);
  } catch (error) {
    if (error.code === "23505") {
      if (error.detail?.includes("codigo")) {
        return handleErrorClient(res, 409, "El código ya está registrado");
      }
      return handleErrorClient(res, 409, "Ya existe un material con estos datos");
    } else {
      return handleErrorServer(res, 500, "Error interno del servidor", error.message);
    }
  }
}

export async function deleteMaterial(req, res) {
  try {
    const { codigo } = req.params;
    const result = await deleteMaterialService(codigo);

    if (!result) return handleErrorClient(res, 404, "Material no encontrado");

    handleSuccess(res, 200, "Material eliminado exitosamente");
  } catch (error) {
    handleErrorServer(res, 500, "Error al eliminar material", error.message);
  }
}