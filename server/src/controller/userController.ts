import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { signUpSchema, updateUserSchema, options, agenerateToken, loginSchema,resetPasswordSchema } from '../utils/utils';
import { userInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
import { emailTemplate } from './emailController';
import cloudinary from 'cloudinary'

export async function registerUser(req: Request, res: Response, next: NextFunction) {
  const id = uuidv4();
  try {
    const validationResult = signUpSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }
    const duplicateEmail = await userInstance.findOne({ where: { email: req.body.email } });
    if (duplicateEmail) {
      return res.status(409).json({
        msg: 'Email is used, please change email',
      });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);
    const record = await userInstance.create({
      id: id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      userName: req.body.userName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: passwordHash,
      avatar: req.body.avatar,
      isVerified: req.body.isVerified,
    });
    res.status(201).json({
      message: 'Successfully created a user',
      record,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'failed to register',
      route: '/register',
    });
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
   cloudinary.v2.config({
    cloudName: process.env.CLOUDINARY_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
   })

   const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
    //formats allowed for download
    allowed_formats: ['jpg', 'png', 'svg', 'jpeg'],
    //generates a new id for each uploaded image
    public_id: '',
    //fold where the images are stored
    folder: 'live-project-podf'
   })
   if (!result){
    throw new Error("Image is not a valid format. Only jpg, png, svg and jpeg allowed")
   }
    const {id} = req.params
    const record = await userInstance.findOne({ where:  {id}  });

    const { firstName, lastName, phoneNumber } = req.body;
    const validationResult = updateUserSchema.validate(req.body, options);

    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message,
      });
    }

    if (!record) {
      return res.status(404).json({
        msg: 'cannot find user',
      });
    }
    const updatedRecord = await record?.update({
      firstName,
      lastName,
      phoneNumber,
      avatar: result.url,
    });

    return res.status(202).json({
      message: 'successfully updated user details',
      updatedRecord,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'failed to update user details' })
  }

}

export async function userLogin(req: Request, res: Response, next: NextFunction) {
  try {
    const validate = loginSchema.validate(req.body, options);
    if (validate.error) {
      return res.status(401).json({ Error: validate.error.details[0].message });
    }
    let validUser;
    if (req.body.userName) {
      validUser = (await userInstance.findOne({
        where: { userName: req.body.userName },
      })) as unknown as { [key: string]: string };
    } else if (req.body.email) {
      validUser = (await userInstance.findOne({
        where: { email: req.body.email },
      })) as unknown as { [key: string]: string };
    } else {
      return res.json({ message: 'Username or email is required' });
    }
    if (!validUser) {
      return res.status(401).json({ msg: 'User is not registered' });
    }
    const { id } = validUser;
    const token = agenerateToken({ id });
    const validatedUser = await bcrypt.compare(req.body.password, validUser.password);
    if (!validatedUser) {
      res.status(401).json({ msg: 'failed to login, wrong user name/password inputed' });
    }
    if (validatedUser) {
      res
        .cookie('jwt', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        })
        .status(200)
        .json({
          message: 'Successfully logged in',
          id,
          token,
          user_info: {
            name: `${validUser.firstName} ${validUser.lastName}`,
            userName: `${validUser.userName}`,
            email: `${validUser.email}`,
          },
        });
    }
  } catch (error) {
    res.status(500).json({ msg: 'failed to login', route: '/login' });
  }
}

export async function forgetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    const user = await userInstance.findOne({ where: { email } });
    console.log(req.body.email)
    if (!user) {
      return res.status(409).json({
        message: 'User not found',
      });
    }
    const token = uuidv4();
    const resetPasswordToken = await userInstance.update({ token }, { where: { email: email } });
    const link = `${process.env.FRONTEND_URL}/reset/${token}`;
    const emailData = {
      to: email,
      subject: 'Password Reset',
      html: ` <div style="max-width: 700px;text-align: center; text-transform: uppercase;
            margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="color: teal;">Welcome To Airtime to Cash</h2>
            <p>Please Follow the link by clicking on the button to verify your email
             </p>
             <div style='text-align:center ;'>
               <a href=${link}
              style="background: #277BC0; text-decoration: none; color: white;
               padding: 10px 20px; margin: 10px 0;
              display: inline-block;">Click here</a>
             </div>
          </div>`,
    };
    emailTemplate(emailData, res, req);
    res.status(200).json({
      msg: 'Reset password token sent to your email',
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'failed to send reset password token',
      route: '/forgetPassword',
    });
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    const validate = resetPasswordSchema.validate(req.body, options);
    if (validate.error) {
        return res.status(400).json({ Error: validate.error.details[0].message });
    }
    const user = await userInstance.findOne({ where: { token } });
    if (!user) {
      return res.status(404).json({
        msg: 'User not found',
      });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const resetPassword = await userInstance.update({ password: passwordHash }, { where: { token } });
    res.status(200).json({
      msg: 'Password reset successfully',
      resetPassword,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: 'failed to reset password',
      route: '/resetPassword',
    });
  }
}
