import Joi from 'Joi';
import jwt from 'jsonwebtoken';
export const sendEmail = Joi.object().keys({
  from: Joi.string(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string().required(),
});

export const signUpSchema = Joi.object()
  .keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    phoneNumber: Joi.string().required(),
    avatar: Joi.string(),
    isVerified: Joi.boolean(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirmPassword: Joi.ref('password'),
  })
  .with('password', 'confirmPassword');

export const updateUserSchema = Joi.object().keys({
  firstName: Joi.string(),
  lastName: Joi.string(),
  phoneNumber: Joi.string(),
  avatar: Joi.string(),
  userName: Joi.string(),
});

export const loginSchema = Joi.object().keys({
  userName: Joi.string().trim().lowercase(),
  email: Joi.string().trim().lowercase(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const resetPasswordSchema = Joi.object()
  .keys({
    token: Joi.string(),
    password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmPassword: Joi.ref('password'),
  })
  .with('password', 'confirmPassword');

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: '',
    },
  },
};

export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  const expiresIn = process.env.JWT_DURATION as string;
  return jwt.sign(user, pass, { expiresIn });
};
