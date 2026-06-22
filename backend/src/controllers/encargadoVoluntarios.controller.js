import encargadoVoluntariosService from '../services/pass/encargadoVoluntarios.service.js';
import encargadoVoluntariosValidation from '../validations/encargadoVoluntarios.validation.js';

import { handleSuccess, handleErrorClient, handleErrorServer} from '../handlers/responseHandlers.js';

const { aprobarPostulanteSchema } = encargadoVoluntariosValidation;

function responderError(res, error) {
  return res.status(error.statusCode || 500).json({
    message: error.message,
    details: error.details,
  });
}






export async function obtenerListaPostulantes(req, res) {
  try {
    const postulantes = await encargadoVoluntariosService.obtenerListaPostulantes();
    return handleSucces(res, 200, "Lista de postulantes obtenida exitosamente", postulantes);
  } catch (error) {
    return handlerErrorServer(res, 500, "Error del servidor al obtener lista de postulantes", error.message);
  }
}

export async function obtenerListaVoluntarios(req, res) {
  try {
    const voluntarios = await encargadoVoluntariosService.obtenerListaVoluntarios();
    return handleSucces(res, 200, "Lista de voluntarios obtenida exitosamente", voluntarios);
  } catch (error) {
    return handlerErrorServer(res, 500, "Error del servidor al obtener lista de voluntarios", error.message);
  }
}

export async function obtenerPostulante(req, res) {
  try {
    const postulante = await encargadoVoluntariosService.obtenerPostulante(req.params.rut);
    return handleSucces(res, 200, "Postulante obtenido exitosamente", postulante);
  } catch (error) {
    return handlerErrorClient(res, error.statusCode || 400, "Error al obtener postulante", error.message);
  }
}

export async function obtenerVoluntario(req, res) {
  try {
    const voluntario = await encargadoVoluntariosService.obtenerVoluntario(req.params.rut);
    return handleSucces(res, 200, "Voluntario obtenido exitosamente", voluntario);
  } catch (error) {
    return handlerErrorClient(res, error.statusCode || 400, "Error al obtener voluntario", error.message);
  }
}

export async function aprobarIngresoPostulante(req, res) {
  try {
    const { body } = req;
    const { error, value } = aprobarPostulanteSchema.validate(body);

    if (error) {
      return handlerErrorClient(res, 400, "Datos de aprobación inválidos", error.details.map(detail => detail.message).join(', '));
    }
  
    const resultado = await encargadoVoluntariosService.aprobarPostulante(req.params.rut, value);
    return handleSucces(res, 200, "Postulante aprobado exitosamente", resultado);
  } 
  catch (error) {
    return handlerErrorClient(res, error.statusCode || 400, "Error al aprobar postulante", error.message);
  }
}

const obtenerVoluntariosPorZonaRiesgo = async (req,res) =>{

};

const asignarCuadrilla = async (req,res) =>{

};