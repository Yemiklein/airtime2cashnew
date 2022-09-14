import express from 'express';
import nodemailer from 'nodemailer';

import { sendEmail, options } from '../utils/utils';

let transporter = nodemailer.createTransport({
  service: 'hotmail',
  auth: {
    user: process.env.EMAIL_USERNAME as string,
    pass: process.env.EMAIL_PASSWORD as string,
  },
});

export async function sendMail(req: express.Request, res: express.Response) {
  console.log(process.env.EMAIL_PASSWORD as string);

  const { from, to, subject, text, html } = req.body;
  try {
    const validationResult = sendEmail.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    let mailOptions = { from: 'decgaon_podf_sq11b@outlook.com', to, subject, text, html };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);

        res.status(400).json({
          message: 'An error occurred',
          err,
        });
      } else {
        console.log('Email sent:', info.response);
        res.status(200).json({
          message: 'email sent successfully',
          info,
        });
      }
    });
  } catch (err) {
    res.status(500).json({
      message: 'failed to send mail',
      route: '/create',
    });
  }
}

export async function passwordRest(req: express.Request, res: express.Response) {}
