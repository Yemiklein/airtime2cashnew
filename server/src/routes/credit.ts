import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { credit } from '../controller/credit';

router.post('/credit', auth, credit)

export default router