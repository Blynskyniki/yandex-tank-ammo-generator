import * as Joi from '@hapi/joi';

export default Joi.object({
  elastic: Joi.object()
    .keys({
      auth: Joi.string().optional(),
      uri: Joi.string().required(),
    })
    .required(),
  host: Joi.string().required(),
  index: Joi.string().required(),
  limit: Joi.number().required(),

  query: Joi.object()
    .keys({
      sort: Joi.object().keys({
        field: Joi.string()
          .trim()
          .required(),
        type: Joi.string().valid(['DESC', 'ASC']),
      }),
    })
    .required(),
  routes: Joi.array().items(
    Joi.object({
      method: Joi.string().required(),
      route: Joi.string().required(),
    }),
  ),
});
