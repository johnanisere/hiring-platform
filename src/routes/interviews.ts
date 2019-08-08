import { Router } from 'express';
import { scheduleInterview, acceptInterview } from '../controllers/interviews';

const router = Router();

router.post('/invite', scheduleInterview);
router.put('/invite/:interviewId', acceptInterview);

export default router;
