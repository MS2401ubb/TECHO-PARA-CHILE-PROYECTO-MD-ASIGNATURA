import Joi from "joi";

export const validarDatosDeCentralTransporte = Joi.object({
    codigoCiudad: Joi.number()
        .integer()
        .positive()
        .required()
        .messages({
            "number.base": "El código de ciudad debe ser un número",
            "any.required": "El código de ciudad es obligatorio"
        }),
    trasladoPuntoOrigen: Joi.string()
        .required()
        .messages({
            "string.base": "El punto de origen debe ser una cadena de texto",
            "any.required": "El punto de origen es obligatorio"
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});

export const validarDatosProvisionAlimentos = Joi.object({
    rutEncargado: Joi.string()
        .pattern(/^\d{7,8}-[kK\d]$/)
        .required()
        .messages({
            "string.pattern.base": "El RUT debe tener el formato XXXXXXXX-X",
            "any.required": "El RUT del encargado es obligatorio"
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});
