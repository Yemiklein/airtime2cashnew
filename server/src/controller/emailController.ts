import express from 'express';
import nodemailer from 'nodemailer';
import { sendEmail, options } from '../utils/utils';
// EMAIL SERVER CONFIGURATION
let transporter = nodemailer.createTransport({
  // service: 'outlook',
  // port: 587,
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USERNAME as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
  tls: {
    rejectUnauthorized: false
}

});
// EMAIL SENDING FUNCTION
export const emailTemplate = async (emailData: Record<string, string>) => {
  return new Promise((resolve, reject) => {
    const { from, to, subject, text, html } = emailData;
    !from && (emailData.from = process.env.EMAIL_USERNAME as string);
    const mailOptions = {
      from,
      to,
      subject,
      text,
      html,
    };
    try {
      const validationResult = sendEmail.validate(emailData, options);
      if (validationResult.error) {
        reject({
          Error: validationResult.error.details[0].message,
        });
      }
      transporter
        .sendMail(mailOptions)
        .then((info) => {
          resolve({
            message: 'email sent successfully',
            info,
          });
        })
        .catch((err) => {
          resolve({
            message: 'An error occurred',
            err,
          });
        });
    } catch (err) {
      reject(err);
    }
  });
};
// DYNAMIC EMAIL SENDING FUNCTION
export async function sendMail(req: express.Request, res: express.Response) {
  emailTemplate(req.body)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
}

export function tokenNotification(firstname: string, lastname: string, token: string): string {
  const str = `Hello ${firstname} ${lastname}, someone attempt to credit a wallet from your dashboard. <b><i>Kindly enter this token: ${token} </i></b>to confirm that it is you and to verify the transaction. If you did not attempt this transaction, kindly proceed to change your password as your account may have been compromised. This time, I recommend you use a very strong password. consider trying something similar to but not exactly as: 1a2b3c4d53!4@5#6$7%8^9&0*1(2)3_4+5-6=7{8};4'5,6.7/8?9`;
  let temp = `
       <div style="max-width: 700px;margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
       <h2 style="text-align: center; text-transform: uppercase;color: teal;">Airtime to Cash Admin Transaction Notification</h2>
        <p>${str}
        </p>
         </div>
  `;
  return temp;
}