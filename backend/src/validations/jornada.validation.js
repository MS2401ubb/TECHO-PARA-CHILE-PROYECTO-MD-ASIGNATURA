import Joi from 'joi';


export const finalizarJornadaSchema = Joi.object({
    materiales: Joi.array().items(
        Joi.object({
            id_material: Joi.number().integer().positive().required(),
            cantidad_fisica: Joi.number().integer().min(0).required()
        })
    ).required()
});


export default {
    finalizarJornadaSchema,
    validarFinalizarJornada,
};