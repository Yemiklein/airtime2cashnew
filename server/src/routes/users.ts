import express from 'express';
import { registerUser, updateUser, forgetPassword, resetPassword , userLogin, verifyUser } from '../controller/userController';
import { auth } from '../middleware/auth'

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//Routes
router.post('/register', registerUser);
router.patch('/verify/:id', verifyUser);
router.post('/login', userLogin);
router.post('/forgetPassword',forgetPassword)
router.patch('/update/:id', auth, updateUser)
router.patch('/resetPassword',resetPassword)

export default router;
