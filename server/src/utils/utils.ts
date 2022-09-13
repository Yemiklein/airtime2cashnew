import Joi from "joi";
export const sendEmail = Joi.object().keys({
  from: Joi.string(),
  to: Joi.string().required(),
  passenger_email: Joi.string(),
  passenger_phone: Joi.string(),
  payment_status: Joi.string(),
  booking_status: Joi.string(),
  seat_number: Joi.number()
});

