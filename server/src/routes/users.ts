import express from 'express';
import { registerUser, updateUser, userLogin } from '../controller/userController';
import { auth } from '../middleware/auth'

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//Routes
router.post('/register',registerUser)
router.post('/login', userLogin);
router.patch('/update/:id', auth, updateUser)

export default router;
