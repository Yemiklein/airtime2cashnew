import express from 'express';
import {
  registerUser,
  updateUser,
  forgetPassword,
  resetPassword,
  userLogin,
  verifyUser,
} from '../controller/userController';
import { auth } from '../middleware/auth';

const router = express.Router();

//Routes
router.post('/register', registerUser);
router.get('/verify/:token', verifyUser);
router.post('/login', userLogin);
router.post('/forgetPassword', forgetPassword);
router.patch('/update/:id', auth, updateUser);
router.patch('/resetPassword', resetPassword);

export default router;
