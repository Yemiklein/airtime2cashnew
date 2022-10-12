import express from 'express';
const router = express.Router();
import { adminAuth } from '../middleware/adminAuth';
import { credit, twoFactorAuth } from '../controller/credit';

router.post('/credit', adminAuth, credit
)
router.post('/', adminAuth, twoFactorAuth)
// router.post('/generate', adminAuth, generate)
// router.post('/verify',adminAuth, verify)

export default router