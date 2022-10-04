import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { postSellAirtime, allTransactions } from '../controller/sellAirtime';

router.post('/sellairtime', auth, postSellAirtime);
router.get('/sellairtime', auth, () => {});
router.get('/alltransactions', auth, allTransactions);

export default router;
