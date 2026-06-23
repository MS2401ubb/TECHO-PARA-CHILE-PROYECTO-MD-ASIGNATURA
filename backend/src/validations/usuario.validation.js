import Joi from "joi";

const ROLES_VALIDOS = [
    "Voluntario",
    "Jefe de Cuadrilla",
    "Encargado de Voluntarios",
    "Encargado de Central",
    "admin"
];

export const editUserBodyValidation = Joi.object({
    password: Joi.string()
        .min(8)
        .messages({
            "string.min": "La contraseña debe tener al menos 8 caracteres",
        }),
    nombre: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre no puede exceder los 100 caracteres"
        }),
    primerApellido: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.min": "El primer apellido debe tener al menos 2 caracteres",
            "string.max": "El primer apellido no puede exceder los 100 caracteres",
        }),
    segundoApellido: Joi.string()
        .optional()
        .min(2)
        .max(100)
        .messages({
            "string.min": "El segundo apellido debe tener al menos 2 caracteres",
            "string.max": "El segundo apellido no puede exceder los 100 caracteres"
        }),
    fechaNacimiento: Joi.date()
        .messages({
            "date.empty": "La fecha de nacimiento no puede estar vacía",
        }),
    email: Joi.string()
        .email()
        .messages({
            "string.email": "Debe ser un email válido",
            "string.empty": "El email no puede estar vacío",
        }),
    telefono: Joi.string()
        .pattern(/^\d{9}$/)
        .messages({
            "string.pattern.base": "El teléfono debe tener 9 dígitos",
            "string.empty": "El teléfono no puede estar vacío",
        }),
    rol: Joi.string()
        .valid(...ROLES_VALIDOS)
        .messages({
            "any.only": `El rol debe ser uno de: ${ROLES_VALIDOS.join(", ")}`
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});

export const assignRoleBodyValidation = Joi.object({
    rol: Joi.string()
        .valid(...ROLES_VALIDOS)
        .required()
        .messages({
            "any.only": `El rol debe ser uno de: ${ROLES_VALIDOS.join(", ")}`,
            "any.required": "El rol es obligatorio"
        })
}).options({
    stripUnknown: true,
    abortEarly: false
});
