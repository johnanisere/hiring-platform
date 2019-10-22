import { Router } from 'express';
import { scheduleInterview, acceptInterview } from '../controllers/interviews';
import { interviewInviteResponse } from '../controllers/interviewInviteResponse';
import getAllInterviews from '../controllers/getAllInterviews';

const router = Router();

router.post('/invite', scheduleInterview);
router
  .get('/response/:intent/:email/:interviewId', interviewInviteResponse)
  .get('/get-interviews', getAllInterviews);

router.put('/invite/:interviewId', acceptInterview);

export default router;
