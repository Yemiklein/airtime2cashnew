import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { CreateAccount, withdraw, deleteBankAccount, getBankAccounts, getUserAccount } from '../controller/accounts';

router.post('/createaccount', auth, CreateAccount);
router.post('/withdraw', auth, withdraw);
router.get('/getaccounts/:id', auth, getBankAccounts);
router.delete('/deleteaccount/:id', auth, deleteBankAccount);
router.get('/getuseraccount/:id', auth, getUserAccount);

export default router;
