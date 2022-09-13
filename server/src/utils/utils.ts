
import Joi from "Joi"
import jwt from "jsonwebtoken"
export const sendEmail = Joi.object().keys({
  from: Joi.string(),
  to: Joi.string().required(),
  subject: Joi.string().required(),
  text: Joi.string(),
  html: Joi.string().required(),
});


export const signUpSchema = Joi.object().keys({
    firstName:Joi.string().required(),
    lastName:Joi.string().required(),
    userName:Joi.string().required(),
    email:Joi.string().trim().lowercase().required(),
    phoneNumber:Joi.string().required(),
    avatar:Joi.string(),
    isVerified:Joi.boolean(),
    password:Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
    confirmPassword:Joi.ref("password")
}).with('password', 'confirmPassword')


export const options ={  
    abortEarly:false,
    errors:{
        wrap:{
            label: ''
        }
    }
}
