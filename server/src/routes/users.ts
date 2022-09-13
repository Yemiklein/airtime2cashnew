import express from 'express';
import {registerUser, updateUser} from "../controller/userController"

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

//Routes
router.post('/register',registerUser)
router.patch('/update/:id',updateUser)


export default router;
