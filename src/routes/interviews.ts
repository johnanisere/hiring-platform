import { Router } from 'express';
import { scheduleInterview } from '../controllers/interviews';

const router = Router();

router.post('/invite/:userId', scheduleInterview);

export default router;
