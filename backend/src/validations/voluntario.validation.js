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

