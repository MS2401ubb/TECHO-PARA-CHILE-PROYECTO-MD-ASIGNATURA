import {
  aprobarPostulante,
  obtenerListaPostulantes,
  obtenerListaVoluntarios,
  obtenerPostulante,
  obtenerVoluntario,
} from '../services/EncargadoVoluntarios.service.js';
import { aprobarPostulanteSchema } from '../validations/EncargadoVoluntarios.validation.js';

function obtenerDataSource(req) {
  return req.app.locals.dataSource;
}

function responderError(res, error) {
  return res.status(error.statusCode || 500).json({
    message: error.message,
    details: error.details,
  });
}

async function listarPostulantes(req, res) {
  try {
    const postulantes = await obtenerListaPostulantes(obtenerDataSource(req));
    return res.status(200).json(postulantes);
  } catch (error) {
    return responderError(res, error);
  }
}

async function listarVoluntarios(req, res) {
  try {
    const voluntarios = await obtenerListaVoluntarios(obtenerDataSource(req));
    return res.status(200).json(voluntarios);
  } catch (error) {
    return responderError(res, error);
  }
}

async function mostrarPostulante(req, res) {
  try {
    const postulante = await obtenerPostulante(obtenerDataSource(req), req.params.rut);
    return res.status(200).json(postulante);
  } catch (error) {
    return responderError(res, error);
  }
}

async function mostrarVoluntario(req, res) {
  try {
    const voluntario = await obtenerVoluntario(obtenerDataSource(req), req.params.rut);
    return res.status(200).json(voluntario);
  } catch (error) {
    return responderError(res, error);
  }
}

async function aprobarIngresoPostulante(req, res) {
  const { error, value } = aprobarPostulanteSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    return res.status(400).json({
      message: 'Los datos de aprobacion no son validos.',
      details: error.details.map((detail) => detail.message),
    });
  }

  try {
    const resultado = await aprobarPostulante(obtenerDataSource(req), req.params.rut, value);
    return res.status(200).json({
      message: 'Postulante aprobado y solicitud activada correctamente.',
      data: resultado,
    });
  } catch (serviceError) {
    return responderError(res, serviceError);
  }
}

export default {
  obtenerListaPostulantes: listarPostulantes,
  obtenerListaVoluntarios: listarVoluntarios,
  obtenerPostulante: mostrarPostulante,
  obtenerVoluntario: mostrarVoluntario,
  aprobarIngresoPostulante,
};
