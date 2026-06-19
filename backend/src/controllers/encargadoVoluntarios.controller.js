import encargadoVoluntariosService from '../services/encargadoVoluntarios.service.js';
import encargadoVoluntariosValidation from '../validations/encargadoVoluntarios.validation.js';

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
    return res.status(200).json(postulantes);
  } catch (error) {
    return responderError(res, error);
  }
}

export async function obtenerListaVoluntarios(req, res) {
  try {
    const voluntarios = await encargadoVoluntariosService.obtenerListaVoluntarios();
    return res.status(200).json(voluntarios);
  } catch (error) {
    return responderError(res, error);
  }
}

export async function obtenerPostulante(req, res) {
  try {
    const postulante = await encargadoVoluntariosService.obtenerPostulante(req.params.rut);
    return res.status(200).json(postulante);
  } catch (error) {
    return responderError(res, error);
  }
}

export async function obtenerVoluntario(req, res) {
  try {
    const voluntario = await encargadoVoluntariosService.obtenerVoluntario(req.params.rut);
    return res.status(200).json(voluntario);
  } catch (error) {
    return responderError(res, error);
  }
}

export async function aprobarIngresoPostulante(req, res) {
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
    const resultado = await encargadoVoluntariosService.aprobarPostulante(req.params.rut, value);
    return res.status(200).json({
      message: 'Postulante aprobado y solicitud activada correctamente.',
      data: resultado,
    });
  } catch (serviceError) {
    return responderError(res, serviceError);
  }
}

const obtenerVoluntariosPorZonaRiesgo = async (req,res) =>{

};

const asignarCuadrilla = async (req,res) =>{

};