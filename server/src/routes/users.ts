import express from 'express';
import { registerUser, userLogin } from '../controller/userController';

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/', registerUser);
router.post('/login', userLogin);

export default router;
