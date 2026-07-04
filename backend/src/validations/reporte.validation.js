import Joi from "joi";

export const AREAS_REPORTE = [
  "Voluntarios",
  "Materiales",
  "Viviendas",
  "Jornadas",
  "Logistica",
  "Otro",
];

export const URGENCIAS_REPORTE = ["Baja", "Media", "Alta", "Critica"];
export const CATEGORIAS_REPORTE = ["Fin de Jornada", "Mensual", "Incidente", "Otro"];
export const ESTADOS_REPORTE = ["Recibido", "En Revision", "Resuelto"];

export const crearReporteBodyValidation = Joi.object({
  titulo: Joi.string().min(5).max(150).required().messages({
    "string.empty": "El titulo es obligatorio",
    "string.min": "El titulo debe tener al menos 5 caracteres",
    "string.max": "El titulo no puede exceder los 150 caracteres",
    "any.required": "El titulo es obligatorio",
  }),
  contenido: Joi.string().min(20).required().messages({
    "string.empty": "El contenido es obligatorio",
    "string.min": "El contenido debe tener al menos 20 caracteres",
    "any.required": "El contenido es obligatorio",
  }),
  areaOrganizacion: Joi.string().valid(...AREAS_REPORTE).required().messages({
    "any.only": `El areaOrganizacion debe ser una de: ${AREAS_REPORTE.join(", ")}`,
    "any.required": "El areaOrganizacion es obligatoria",
  }),
  urgencia: Joi.string().valid(...URGENCIAS_REPORTE).required().messages({
    "any.only": `La urgencia debe ser una de: ${URGENCIAS_REPORTE.join(", ")}`,
    "any.required": "La urgencia es obligatoria",
  }),
  categoria: Joi.string().valid(...CATEGORIAS_REPORTE).required().messages({
    "any.only": `La categoria debe ser una de: ${CATEGORIAS_REPORTE.join(", ")}`,
    "any.required": "La categoria es obligatoria",
  }),
  periodo: Joi.string().max(50).allow(null, "").optional().messages({
    "string.max": "El periodo no puede exceder los 50 caracteres",
  }),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const listarReportesQueryValidation = Joi.object({
  areaOrganizacion: Joi.string().valid(...AREAS_REPORTE).optional(),
  urgencia: Joi.string().valid(...URGENCIAS_REPORTE).optional(),
  categoria: Joi.string().valid(...CATEGORIAS_REPORTE).optional(),
  estado: Joi.string().valid(...ESTADOS_REPORTE).optional(),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const actualizarEstadoReporteBodyValidation = Joi.object({
  estado: Joi.string().valid(...ESTADOS_REPORTE).required().messages({
    "any.only": `El estado debe ser uno de: ${ESTADOS_REPORTE.join(", ")}`,
    "any.required": "El estado es obligatorio",
  }),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

