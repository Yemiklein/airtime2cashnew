import express from 'express';
import nodemailer from 'nodemailer';

export async function sendMail(req: express.Request, res: express.Response) {
  const { from, to, subject, text, html } = req.body;
  try {
    let transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: 'decgaon_podf_sq11b@outlook.com',
        pass: 'LiveProject2022',
      },
    });

    let mailOptions = { from: 'decgaon_podf_sq11b@outlook.com', to, subject, text, html };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log(err);

        res.status(400).json({
          message: 'An error occured',
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
