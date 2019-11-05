import { Router } from 'express';
import { scheduleInterview, acceptInterview } from '../controllers/interviews';
import { interviewInviteResponse } from '../controllers/interviewInviteResponse';
import getAllInterviews from '../controllers/getAllInterviews';
import { whyDecline } from '../controllers/whyDecline';

const router = Router();

router.post('/invite', scheduleInterview);
router
  .get('/response/:intent/:email/:interviewId', interviewInviteResponse)
  .get('/get-interviews', getAllInterviews)
  .put('/why-decline', whyDecline);

router.put('/invite/:interviewId', acceptInterview);

export default router;
