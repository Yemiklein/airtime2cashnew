import express, { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { signUpSchema, updateUserSchema, options } from '../utils/utils';
import { userInstance } from '../model/userModel';
import bcrypt from 'bcryptjs';
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
    console.log('here');
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

    const { firstName, lastName, phoneNumber, avatar } = req.body;
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
      msg: 'successfully updated user details',
      updatedRecord,
    });
  } catch (err) {
    console.log(err)
    res.status(500).json({ message: 'failed to update user details' });
  }
}
