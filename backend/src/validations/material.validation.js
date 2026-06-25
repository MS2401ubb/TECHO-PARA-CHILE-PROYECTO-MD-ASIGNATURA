import Joi from "joi";

export const editMaterialBodyValidation = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre no puede exceder los 100 caracteres"
        }),
    tipo: Joi.string()
        .valid("Herramienta", "Material")
        .messages({
            "any.only": "El tipo debe ser: Herramienta o Material"
        }),
    stock_digital: Joi.number()
        .min(0)
        .messages({
            "number.min": "El stock digital no puede ser menor a 0"
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});
