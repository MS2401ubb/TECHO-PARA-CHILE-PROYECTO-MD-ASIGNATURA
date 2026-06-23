import {
  obtenerListaPostulantes,
  obtenerListaVoluntarios,
  obtenerVoluntarioPorRut,
  obtenerVoluntarioConDetallesCompletos,
  aprobarVoluntario,
  rechazarVoluntario,
  obtenerVoluntariosDisponiblesPorZona,
} from "../services/voluntario.service.js";
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

export async function obtenerDetallesVoluntario(req, res) {
  try {
    const { rut } = req.params;
    const data = await obtenerVoluntarioConDetallesCompletos(rut);
    handleSuccess(res, 200, "Detalles del voluntario obtenidos exitosamente", data);
  } catch (error) {
    if (error.message === "Voluntario no encontrado.") {
      handleErrorClient(res, 404, error.message);
    } else {
      handleErrorServer(res, 500, "Error al obtener detalles del voluntario", error.message);
    }
  }
}

export async function aprobarPostulante(req, res) {
  try {
    const { rut } = req.params;
    const rutEncargado = req.user?.rut;

    if (!rutEncargado) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const data = await aprobarVoluntario(rut, rutEncargado);
    handleSuccess(res, 200, "Voluntario aprobado exitosamente", data);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      handleErrorClient(res, 404, error.message);
    } else if (error.message.includes("No se puede aprobar")) {
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, "Error al aprobar voluntario", error.message);
    }
  }
}

export async function rechazarPostulante(req, res) {
  try {
    const { rut } = req.params;
    const { motivo } = req.body;
    const rutEncargado = req.user?.rut;

    if (!rutEncargado) {
      return handleErrorClient(res, 401, "Usuario no autenticado");
    }

    const data = await rechazarVoluntario(rut, motivo, rutEncargado);
    handleSuccess(res, 200, "Voluntario rechazado exitosamente", data);
  } catch (error) {
    if (error.message.includes("no encontrado")) {
      handleErrorClient(res, 404, error.message);
    } else if (error.message.includes("No se puede rechazar")) {
      handleErrorClient(res, 400, error.message);
    } else {
      handleErrorServer(res, 500, "Error al rechazar voluntario", error.message);
    }
  }
}

export async function obtenerDisponiblesPorZona(req, res) {
  try {
    const { codigoCiudad } = req.params;
    const data = await obtenerVoluntariosDisponiblesPorZona(codigoCiudad);
    handleSuccess(res, 200, "Voluntarios disponibles obtenidos exitosamente", data);
  } catch (error) {
    if (error.message.includes("codigoCiudad")) {
      return handleErrorClient(res, 400, error.message);
    }
    handleErrorServer(res, 500, "Error al obtener voluntarios disponibles", error.message);
  }
}



