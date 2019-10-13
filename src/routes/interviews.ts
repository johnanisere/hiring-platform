import { Router } from 'express';
import { scheduleInterview, acceptInterview } from '../controllers/interviews';
import { interviewInviteResponse } from '../controllers/interviewInviteResponse';

const router = Router();

router.post('/invite', scheduleInterview);
router.patch('/response/:intent/:email', interviewInviteResponse);

router.put('/invite/:interviewId', acceptInterview);

export default router;
