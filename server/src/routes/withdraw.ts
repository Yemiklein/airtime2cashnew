import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { withdraw } from '../controller/withdraw';

router.post('/withdraw', auth, withdraw);

export default router;
