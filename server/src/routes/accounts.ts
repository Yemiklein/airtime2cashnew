import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import {
  CreateAccount,
  getAllAccounts,
  deleteBankAccount,
  getBankAccounts,
  getUserAccount,
  updateAccount,
} from '../controller/accounts';

router.get('/allAccount', getAllAccounts);
router.post('/createaccount', auth, CreateAccount);
router.post('/updateaccount', auth, updateAccount);
router.get('/getaccounts/:id', auth, getBankAccounts);
router.delete('/deleteaccount/:id', auth, deleteBankAccount);
router.get('/getuseraccount/:id', auth, getUserAccount);

export default router;
