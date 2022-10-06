import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { withdraw, getTransactions, getAllBanksNgs } from '../controller/withdraw';

router.post('/withdraw', auth, withdraw);
router.get('/gettransactions', getTransactions);
router.get('/allbanks', getAllBanksNgs);

export default router;
