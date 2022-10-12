import express, { Request, Response, NextFunction } from 'express';
import { Twilio } from "twilio";

export const sendSMS = async (req: Request, res: Response, next: NextFunction) => {


  const accountSid = process.env.TWILIO_ACCOUNT_SID as string;
  const authToken = process.env.TWILIO_AUTH_TOKEN as string;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER as string;``

  const client = new Twilio(accountSid, authToken);

  return new Promise((resolve, reject) => {
    try {
      const { message, phone } = req.body;
      const sms = client.messages.create({
        from:twilioNumber,
        to: phone,
        body:message,
      });
      if (sms) {

        resolve({
          status: 'success',
          message: 'SMS sent successfully',
          data: sms,
        });
      }
    } catch (error) {
      reject({
        status: 'error',
        message: 'internal server error',
        error
      });
    }
  })

}

