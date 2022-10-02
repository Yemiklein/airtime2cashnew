import express from 'express';
const router = express.Router();
import { auth } from '../middleware/auth';
import { postSellAirtime } from '../controller/sellAirtime';

router.post('/sellairtime', auth, postSellAirtime);
router.get('/sellairtime', auth, () => {});

export default router;
