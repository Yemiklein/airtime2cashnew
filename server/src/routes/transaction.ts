import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { postSellAirtime, allTransactions, pendingTransactions } from '../controller/sellAirtime';

router.post('/sellairtime', auth, postSellAirtime);
router.get('/alltransactions', auth, allTransactions);
router.get('/pendingTransactions', auth, pendingTransactions);

export default router;
