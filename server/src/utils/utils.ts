import Joi from "joi";
export const sendEmail = Joi.object().keys({
  from: Joi.string(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string().required(),
});

export const options = {
  abortEarly: false,
  error: {
    wrap: {
      label: '',
    },
  },
};
