import express from 'express';
const router = express.Router();
import { adminAuth } from '../middleware/adminAuth';
import { credit } from '../controller/credit';
import { otpValidate } from '../middleware/otpValidate';

router.post('/credit', adminAuth, otpValidate, credit
)

export default router
