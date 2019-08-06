import { Router } from 'express';
import { scheduleInterview } from '../controllers/interviews';

const router = Router();

router.post('/interview/invite', scheduleInterview);

export default router;
