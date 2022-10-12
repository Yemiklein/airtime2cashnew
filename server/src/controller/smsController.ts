import express, { Request, Response, NextFunction } from 'express';
import { optional } from 'joi';
import { Twilio } from "twilio";
import { userInstance } from '../model/userModel';
import { emailTemplate } from './emailController';


const generateOtp = async(req: Request | any, res: Response, next: NextFunction) =>{
  const otp = Math.floor(100000 + Math.random() * 900000);
  const {id} = req.user;
  const user = await userInstance.findOne({where:{id}});
  if (user){
    await user.update({otp, otpExpires: Date.now()+ 300000})

    //SEND OTP TO USR EMAIL
    const emailData = {
      to: req.body.email,
      subject: "airtime2Cash otp",
      html: "This is your otp: " + otp + "it expires in 5minutes"
    }
    emailTemplate(emailData);
    return {otp, phoneNumber: user.phoneNumber};
  }
  return res.status(404).json({message: "User not found"});
}

export const sendSMS = async (req: Request, res: Response, next: NextFunction) => {

  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;``

  const client = new Twilio(accountSid, authToken);

    try {
      const {otp, phoneNumber} = generateOtp(req, res, next)  
      const { message, phone } = req.body;
      const sms = await client.messages.create({
        from:twilioNumber,
        to: phoneNumber,
        body:otp,
      });
      if (sms) {
        return res.status(201).json({
          status: 'success',
          message: 'SMS sent successfully',
          data: otp,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: 'error',
        message: 'internal server error',
        error
      });
    }
  }

