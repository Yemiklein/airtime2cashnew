import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { postSellAirtime, allTransactions } from '../controller/sellAirtime';
import { adminAuth } from '../middleware/adminAuth';

router.post('/sellairtime', auth, postSellAirtime);
router.get('/alltransactions', adminAuth, allTransactions);

export default router;
