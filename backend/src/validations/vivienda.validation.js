import Joi from "joi";

export const editViviendaBodyValidation = Joi.object({
    direccion: Joi.string()
        .min(5)
        .max(200)
        .messages({
            "string.min": "La dirección debe tener al menos 5 caracteres",
            "string.max": "La dirección no puede exceder los 200 caracteres"
        }),
    tipoObra: Joi.string()
        .min(5)
        .max(200)
        .messages({
            "string.min": "La dirección debe tener al menos 5 caracteres",
            "string.max": "La dirección no puede exceder los 200 caracteres"
        }),
    estado: Joi.string(),
    
    porcentajeAvance: Joi.number()
        .min(0)
        .max(100)
        .messages({
            "number.min": "El porcentaje de avance no puede ser menor a 0",
            "number.max": "El porcentaje de avance no puede ser mayor a 100"
        }),
    fechaInicioEstimada: Joi.date()
        .messages({
            "date.empty": "La fecha de inicio estimada no puede estar vacía",
        }),
    fechaFinEstimada: Joi.date()
        .messages({
            "date.empty": "La fecha de fin estimada no puede estar vacía",
        }),
    fechaFinReal: Joi.date()
        .messages({
            "date.empty": "La fecha de fin real no puede estar vacía",
        }),
    montajeEstructural: Joi.boolean()
        .messages({
            "boolean.base": "El valor de montaje estructural debe ser verdadero o falso",
        }),
    habilidadTecnica: Joi.boolean()
        .messages({
            "boolean.base": "El valor de habilidad técnica debe ser verdadero o falso",
        }),
    conexionesBasicas: Joi.boolean()
        .messages({
            "boolean.base": "El valor de conexiones básicas debe ser verdadero o falso",
        }),
    observacionesValidacion: Joi.string()
        .max(1000)
        .messages({
            "string.max": "Las observaciones de validación no pueden exceder los 1000 caracteres"
        }),
    codigoCiudad: Joi.string()
        .min(4)
        .max(50)
        .messages({
            "string.min": "El código de ciudad debe tener al menos 4 caracteres",
            "string.max": "El código de ciudad no puede exceder los 50 caracteres"
        })  




}).options({
    stripUnknown: true,
    abortEarly: false
});