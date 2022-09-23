import express from 'express';
import router= express.Router();
import {auth} from '../middleware/auth';
import { CreateAccount, deleteBankAccount, getBankAccount, updateBankAccount } from '../controllers/accounts';

router.post('/createaccount', auth, CreateAccount);
router.get('/getaccounts', auth, getBankAccount);
router.get('/deleteaccount/:id', auth, deleteBankAccount);


export default router