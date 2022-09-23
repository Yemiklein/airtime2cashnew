import express from 'express';
const router= express.Router();
import {auth} from '../middleware/auth';
import { CreateAccount, deleteBankAccount, getBankAccounts} from '../controller/accounts';

router.post('/createaccount', auth, CreateAccount);
router.get('/getaccounts', auth, getBankAccounts);
router.get('/deleteaccount/:id', auth, deleteBankAccount);


export default router