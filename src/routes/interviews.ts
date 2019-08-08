import { Router } from 'express';
import { scheduleInterview } from '../controllers/interviews';

const router = Router();

router.post('/invite', scheduleInterview);
router.put('/invite/:inter');

export default router;
