import express from 'express';
import nodemailer from 'nodemailer';
import {sendEmail,options,} from "../utils/utils";
// EMAIL SERVER CONFIGURATION
let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USERNAME as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});
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
// DYNAMIC EMAIL SENDING FUNCTION
export async function sendMail(req: express.Request, res: express.Response) {
  emailTemplate(req.body, res, req);
}
