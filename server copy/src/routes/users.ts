import express from 'express';
import { registerUser, forgetPassword, resetPassword , userLogin } from '../controller/userController';

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', registerUser);
router.post('/login', userLogin);
router.post('/forgetPassword',forgetPassword)
router.patch('/resetPassword',resetPassword)

export default router;
