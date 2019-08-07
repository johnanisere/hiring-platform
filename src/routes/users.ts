import { Router } from 'express';
// import { authMiddleware } from '../middleware/auth';
import createUser from '../controllers/authentication';
import updatePassword from '../controllers/passwordUpdate';
//import { acceptInterview } from '../controllers/interviews';

const router = Router();

router.post('/', createUser);

router.put('/passwordUpdate/', updatePassword);
//router.get('/acceptInterview/:interviewId/:userId', acceptInterview);

export default router;
