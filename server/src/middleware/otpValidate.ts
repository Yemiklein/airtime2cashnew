import { Request, Response, NextFunction } from 'express';
import { userInstance } from '../model/userModel';

export async function otpValidate(req: Request | any , res: Response, next: NextFunction) {
  try {
    const { otp } = req.body;
    const { id } = req.user;

if (!otp) {
  return res.status(400).json({
    Error: "Otp is required",
  });
}

    const user = await userInstance.findOne({ where: { id, otp } });
    if (!user) {
      return res.status(401).json({
        Error: 'Invalid OTP',
      });
    }
    if( user.otpExpires < Date.now() ) {
      return res.status(401).json({
        Error: 'OTP expired',
      });
    }
    next();
  } catch (error) {
    res.status(403).json({
      Error: 'User not logged in',
    });
  }

}
