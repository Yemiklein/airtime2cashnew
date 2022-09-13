import express from 'express';
import {registerUser, forgetPassword, resetPassword } from "../controller/userController"

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/',registerUser)
router.post('/forgetPassword',forgetPassword)
router.patch('/resetPassword',resetPassword)

export default router;
