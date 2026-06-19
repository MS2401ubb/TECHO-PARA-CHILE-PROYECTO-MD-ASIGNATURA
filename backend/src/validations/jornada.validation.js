import Joi from 'joi';

//Esquema base 

export const finalizarJornadaSchema = Joi.object({
    materiales: Joi.array().items(
        Joi.object({
            id_material: Joi.number().integer().positive().required(),
            cantidad_fisica: Joi.number().integer().min(0).required()
        })
    ).required()
});
// El MIDDLEWARE

export const validarFinalizarJornada = (req,res,next) => {
    const {error} = finalizarJornadaSchema.validate(req.body);


if (error) {
    return res.status(400).json ({
        error: 'Datos de inventario invalidos'
    
    });
}

next ();

};

export default {
    finalizarJornadaSchema,
    validarFinalizarJornada,
};