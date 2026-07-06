import Joi from "joi";

export const userRegisterBodyValidation = Joi.object({
    rut: Joi.string()
        .pattern(/^\d{7,8}-[\dkK]$/)
        .required()
        .messages({
            "string.pattern.base": "El RUT debe tener formato 12345678-9 o 12345678-k",
            "string.empty": "El RUT no puede estar vacío",
            "any.required": "El RUT es obligatorio"
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.empty": "La contraseña no puede estar vacía",
            "any.required": "La contraseña es obligatoria"
        }),
    nombre: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            "string.empty": "El nombre no puede estar vacío",
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre no puede exceder los 100 caracteres",
            "any.required": "El nombre es obligatorio"
        }),
    primerApellido: Joi.string()
        .required()
        .min(2)
        .max(100)
        .messages({
            "string.empty": "El primer apellido no puede estar vacío",
            "string.min": "El primer apellido debe tener al menos 2 caracteres",
            "string.max": "El primer apellido no puede exceder los 100 caracteres",
            "any.required": "El primer apellido es obligatorio"
        }),
    segundoApellido: Joi.string()
        .optional()
        .min(2)
        .max(100)
        .messages({
            "string.empty": "El segundo apellido no puede estar vacío",
            "string.min": "El segundo apellido debe tener al menos 2 caracteres",
            "string.max": "El segundo apellido no puede exceder los 100 caracteres"
        }),
    fechaNacimiento: Joi.date()
        .required()
        .messages({
            "date.empty": "La fecha de nacimiento no puede estar vacía",
            "any.required": "La fecha de nacimiento es obligatoria"
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            "string.email": "Debe ser un email válido",
            "string.empty": "El email no puede estar vacío",
            "any.required": "El email es obligatorio"
        }),
    telefono: Joi.string()
        .pattern(/^\d{9}$/)
        .required()
        .messages({
            "string.pattern.base": "El teléfono debe tener 9 dígitos",
            "string.empty": "El teléfono no puede estar vacío",
            "any.required": "El teléfono es obligatorio"
        }),
    rol: Joi.string()
        .valid("Voluntario")
        .required()
        .messages({
            "any.only": "El rol permitido para registro público es: Voluntario"
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});

export const userLoginBodyValidation = Joi.object({
    rut: Joi.alternatives()
        .try(
            Joi.string().pattern(/^\d{7,8}-[\dkK]$/),
            Joi.string().valid('admin')
        )
        .required()
        .messages({
            "string.pattern.base": "El RUT debe tener formato 12345678-9 o 12345678-k",
            "string.empty": "El campo no puede estar vacío",
            "any.required": "El RUT o rol es obligatorio"
        }),
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            "string.min": "La contraseña debe tener al menos 8 caracteres",
            "string.empty": "La contraseña no puede estar vacía",
            "any.required": "La contraseña es obligatoria"
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});
