import Joi from "joi";

// ============================================================
// VALIDACIONES PARA CRUD DE HERRAMIENTAS
// ============================================================

export const editHerramientaBodyValidation = Joi.object({
    nombre: Joi.string()
        .min(2)
        .max(100)
        .messages({
            "string.min": "El nombre debe tener al menos 2 caracteres",
            "string.max": "El nombre no puede exceder los 100 caracteres"
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

const calculoSuficienciaSchema = Joi.object({
    codigo_cuadrilla: Joi.number().integer().positive().required().messages({
        "number.positive": "El código de cuadrilla debe ser un número positivo",
        "any.required": "El código de cuadrilla es requerido"
    }),
    codigo_vivienda: Joi.string().trim().min(3).max(50).required().messages({
        "any.required": "El código de vivienda es requerido"
    }),
    herramientas: Joi.array().items(
        Joi.object({
            id_herramienta: Joi.number().integer().positive().required(),
            cantidad_asignada: Joi.number().integer().min(1).required()
        })
    ).min(1).required().messages({
        "array.min": "Debe ingresar al menos 1 herramienta para validar"
    })
});

// ============================================================
// VALIDACIONES PARA OPERACIONES DE JORNADA
// ============================================================

const confirmarRecepcionSchema = Joi.object({
    codigo_cuadrilla: Joi.number().integer().positive().required().messages({
        "number.positive": "El código de cuadrilla debe ser un número positivo",
        "any.required": "El código de cuadrilla es requerido"
    }),
    herramientas: Joi.array().items(
        Joi.object({
            id_herramienta: Joi.number().integer().positive().required(),
            cantidad_inicial: Joi.number().integer().min(1).required()
        })
    ).min(1).required().messages({
        "array.min": "Debe confirmar al menos 1 herramienta"
    })
});

const iniciarJornadaSchema = Joi.object({
    codigo_cuadrilla: Joi.number().integer().positive().required().messages({
        "number.positive": "El código de cuadrilla debe ser un número positivo",
        "any.required": "El código de cuadrilla es requerido"
    })
});

const finalizarJornadaSchema = Joi.object({
    montajeEstructural: Joi.boolean().required().messages({
        "any.required": "Debe indicar si el montaje estructural está completo"
    }),
    habilidadTecnica: Joi.boolean().required().messages({
        "any.required": "Debe indicar si la habilidad técnica está validada"
    }),
    conexionesBasicas: Joi.boolean().required().messages({
        "any.required": "Debe indicar si las conexiones básicas están completas"
    }),
    observaciones: Joi.string().max(1000).allow('', null).optional().messages({
        "string.max": "Las observaciones no pueden exceder 1000 caracteres"
    }),
    herramientas: Joi.array().items(
        Joi.object({
            id_herramienta: Joi.number().integer().positive().required(),
            cantidad_fisica_final: Joi.number().integer().min(0).required(),
            incidencia: Joi.string().allow('', null).optional()
        })
    ).min(1).required().messages({
        "array.min": "Debe ingresar al menos 1 herramienta contada"
    })
});

const autorizarCierreSchema = Joi.object({
    autorizado: Joi.boolean().required().messages({
        "any.required": "Debe indicar si aprueba o rechaza"
    }),
    motivo_autorizacion: Joi.string().max(500).allow('', null).optional().messages({
        "string.max": "El motivo no puede exceder 500 caracteres"
    })
});

export const validarConfirmarRecepcion = (req, res, next) => {
    const { error } = confirmarRecepcionSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Datos inválidos para confirmar recepción', detalle: error.details[0].message });
    next();
};

export const validarIniciarJornada = (req, res, next) => {
    const { error, value } = iniciarJornadaSchema.validate(req.body, {
        abortEarly: false,
        convert: true,
        stripUnknown: true
    });
    if (error) return res.status(400).json({ error: 'Datos inválidos para iniciar jornada', detalle: error.details[0].message });
    req.body = value;
    next();
};

export const validarCalculoSuficiencia = (req, res, next) => {
    const { error } = calculoSuficienciaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Datos inválidos para validar suficiencia', detalle: error.details[0].message });
    next();
};

export const validarFinalizarJornada = (req, res, next) => {
    const { error } = finalizarJornadaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Datos inválidos para el cierre', detalle: error.details[0].message });
    next();
};

export const validarAutorizarCierre = (req, res, next) => {
    const { error } = autorizarCierreSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Datos inválidos para la autorización', detalle: error.details[0].message });
    next();
};

// ============================================================
// VALIDACIONES PARA TAREAS DE VALIDACIÓN JORNADA
// ============================================================

const crearTareaSchema = Joi.object({
    descripcion: Joi.string().min(3).max(500).required().messages({
        "string.min": "La descripción debe tener al menos 3 caracteres",
        "string.max": "La descripción no puede exceder 500 caracteres",
        "any.required": "La descripción es requerida"
    }),
    observaciones: Joi.string().max(1000).allow('', null).optional().messages({
        "string.max": "Las observaciones no pueden exceder 1000 caracteres"
    })
});

const marcarTareaSchema = Joi.object({
    marcar: Joi.boolean().required().messages({
        "any.required": "Debe indicar si marca o desmarca la tarea"
    })
});

const confirmarValidacionTecnicaSchema = Joi.object({}).unknown(true);

export const validarCrearTarea = (req, res, next) => {
    const { error } = crearTareaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Datos inválidos para crear tarea', detalle: error.details[0].message });
    next();
};

export const validarMarcarTarea = (req, res, next) => {
    const { error } = marcarTareaSchema.validate(req.body);
    if (error) return res.status(400).json({ error: 'Datos inválidos para marcar tarea', detalle: error.details[0].message });
    next();
};

export const validarConfirmarValidacionTecnica = (req, res, next) => {
    // Esta ruta no requiere body, solo parámetros
    next();
};
