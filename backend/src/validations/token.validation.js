import Joi from "joi";

export const tokenCanjeoBodyValidation = Joi.object({
    tipoVoluntario: Joi.string()
    .valid("Espontáneo","General")
    .required()
    .messages({
        "any.only": "El tipo de voluntario debe ser 'Espontáneo' o 'General'",
        "any.required": "El tipo de voluntario es obligatorio"
    }),

    datosUsuarioNuevo: Joi.object({
        rut: Joi.string()
        .pattern(/^\d{7,8}-[\dkK]$/)
        .required()
        .message({
            "string.pattern.base": "El RUT debe tener formato 12345678-9 o 12345678-k",
            "any.required": "El RUT es obligatorio"
        }),
        nombre: Joi.string()
        .min(2)
        .max(50)
        .required()
        .messages({
            "string.empty": "El nombre no puede estar vacío",
            "any.required": "El nombre es obligatorio"
        }),
        primerApellido: Joi.string().
        min(2)
        .max(100)
        .required()
        .messages({
            "string.empty": "El primer apellido no puede estar vacío",
            "any.required": "El primer apellido es obligatorio"
        })
        ,
        telefono: Joi.string()
        .pattern(/^\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "El teléfono debe tener exactamente 9 dígitos",
            "any.required": "El teléfono es obligatorio"
        })
    })
    .required()
    .messages({
        "any.required": "Los datos del usuario son obligatorios"
    }),
    tokenEntregado: Joi.string()
    .required()
    .max(10)
    .messages({
        "string.empty": "El token no puede estar vacío",
        "any.required": "El token entregado es obligatorio"
    })
}).options({
    stripUnknown: true,
    abortEarly: true
});