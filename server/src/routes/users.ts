import express from 'express';
import {registerUser} from "../controller/userController"

const router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

router.post('/',registerUser)

export default router;
