import Joi from "joi";

export const aprobarPostulanteBodyValidation = Joi.object({
  tipoAsignacion: Joi.string()
    .valid("manual", "automatica")
    .default("automatica")
    .messages({
      "any.only": "El tipoAsignacion debe ser manual o automatica",
    }),
  codigoCuadrilla: Joi.when("tipoAsignacion", {
    is: "manual",
    then: Joi.number().integer().positive().required().messages({
      "any.required": "El codigoCuadrilla es obligatorio para asignación manual",
      "number.base": "El codigoCuadrilla debe ser numérico",
      "number.integer": "El codigoCuadrilla debe ser un número entero",
      "number.positive": "El codigoCuadrilla debe ser positivo",
    }),
    otherwise: Joi.number().integer().positive().optional(),
  }),
  fechaInicio: Joi.date().optional().messages({
    "date.base": "La fechaInicio debe ser una fecha válida",
  }),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const rechazarPostulanteBodyValidation = Joi.object({
  motivo: Joi.string().trim().min(5).max(250).required().messages({
    "string.empty": "El motivo de rechazo es obligatorio",
    "string.min": "El motivo de rechazo debe tener al menos 5 caracteres",
    "string.max": "El motivo de rechazo no puede exceder 250 caracteres",
    "any.required": "El motivo de rechazo es obligatorio",
  }),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

export const apelarPostulanteBodyValidation = Joi.object({
  comentarioPostulacion: Joi.string().trim().min(5).max(1000).required().messages({
    "string.empty": "El comentario de apelación es obligatorio",
    "string.min": "El comentario de apelación debe tener al menos 5 caracteres",
    "string.max": "El comentario de apelación no puede exceder 1000 caracteres",
    "any.required": "El comentario de apelación es obligatorio",
  }),
}).options({
  stripUnknown: true,
  abortEarly: false,
});

