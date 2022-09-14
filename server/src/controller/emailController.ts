import express from 'express';
import nodemailer from 'nodemailer';
<<<<<<< HEAD

import { sendEmail, options } from '../utils/utils';

=======
import {sendEmail,options,} from "../utils/utils";
// EMAIL SERVER CONFIGURATION
>>>>>>> origin/develop
let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USERNAME as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});
<<<<<<< HEAD

export async function sendMail(req: express.Request, res: express.Response) {
  console.log(process.env.EMAIL_PASSWORD as string);

  const { from, to, subject, text, html } = req.body;
  try {
    const validationResult = sendEmail.validate(req.body, options);
=======
// EMAIL SENDING FUNCTION
export const emailTemplate = (emailData:Record<string, string>, res:express.Response, req:express.Request) => {
  const { to, subject, text, html } = emailData;
  const mailOptions = {
    from: 'decgaon_podf_sq11b@outlook.com',
    to,
    subject,
    text,
    html,
  };
  try{
    const validationResult = sendEmail.validate(emailData, options);
>>>>>>> origin/develop
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {

        res.status(400).json({
          message: 'An error occurred',
          err,
        });
      } else { 
        res.status(200).json({
          message: 'email sent successfully',
          info,
        });
      }
    });
  }catch(err){
    console.log(err)
  }
}
<<<<<<< HEAD

export async function passwordRest(req: express.Request, res: express.Response) {}
=======
// DYNAMIC EMAIL SENDING FUNCTION
export async function sendMail(req: express.Request, res: express.Response) {
  emailTemplate(req.body, res, req);
}
>>>>>>> origin/develop
