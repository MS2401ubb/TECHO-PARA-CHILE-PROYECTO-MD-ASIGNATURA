import Joi from 'joi';

export const aprobarPostulanteSchema = Joi.object({
  asignacionAutomatica: Joi.boolean().default(true),
  codigoCuadrilla: Joi.when('asignacionAutomatica', {
    is: false,
    then: Joi.string().trim().max(50).required(),
    otherwise: Joi.string().trim().max(50).optional(),
  }),
});

export default {
  aprobarPostulanteSchema,
};
