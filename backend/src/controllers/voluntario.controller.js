import { obtenerListaPostulantes, obtenerListaVoluntarios, obtenerVoluntarioPorRut } from "../services/voluntario.service.js";
import { handleErrorClient, handleErrorServer, handleSuccess } from "../handlers/responseHandlers.js";

export async function listaPostulantes(req, res) {
  try {
    const postulantes = await obtenerListaPostulantes();

    if (postulantes.length < 1) {
      handleSuccess(res, 200, "No hay postulantes registrados");
    }

    handleSuccess(res, 200, "Postulantes obtenidos exitosamente", postulantes);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener postulantes", error.message);
  }
}
export async function listaVoluntarios(req, res) {
  try {
    const voluntarios = await obtenerListaVoluntarios();

    if (voluntarios.length < 1) {
      handleSuccess(res, 200, "No hay voluntarios registrados");
    }

    handleSuccess(res, 200, "Voluntarios obtenidos exitosamente", voluntarios);
  } catch (error) {
    handleErrorServer(res, 500, "Error al obtener voluntarios", error.message);
  }
}

export async function voluntarioPorRut(req, res) {
  try {
    const { rut } = req.params;
    const voluntario = await obtenerVoluntarioPorRut(rut);

    handleSuccess(res, 200, "Voluntario encontrado", voluntario);
  } catch (error) {
    if (error.message === "Voluntario no encontrado") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener el voluntario", error.message);
    }
  }
}



