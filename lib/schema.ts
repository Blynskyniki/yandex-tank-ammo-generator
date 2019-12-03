import * as  Joi from'@hapi/joi';

export default Joi.object({
  name: Joi.string().required(),
  host: Joi.string().required(),
  data: Joi.array().items(
    Joi.object({
      headers:Joi.object().optional(),
      method: Joi.string().required(),
      body: [Joi.string().optional(), Joi.allow(null)],
      path: Joi.string().required(),
    }),
  ),
})

