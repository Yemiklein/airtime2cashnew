import nodemailer from 'nodemailer';

const sendEmail = async (options: any) => {
  // create a transporter
  const transporter = nodemailer.createTransport({
    /* service: 'Gmail',
      //activate in gmail "less secure app" option

       auth: {
      user: 'Obed',
      pass: '12345678',
    },
  });
   */

    host: 'smtp.mailtrap.io',
    port: 25,
    auth: {
      user: '4a0dce062d9071',
      pass: '01061baddb4ae5',
    },
  });
  // define email options
  const mailOptions = {
    from: 'Obed <obed@obed.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // actually send the mail
  await transporter.sendMail(mailOptions);
};
export default sendEmail;

/*
Host:
smtp.mailtrap.io
Port:
25 or 465 or 587 or 2525
Username:
4a0dce062d9071
Password:
01061baddb4ae5
*/
