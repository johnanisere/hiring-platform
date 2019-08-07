import { Router } from 'express';
// import { authMiddleware } from '../middleware/auth';
import createUser from '../controllers/authentication';
import updatePassword from '../controllers/passwordUpdate';

const router = Router();

router
  .post('/hiring-partner/invite', createUser)
  .put('/update-password/', updatePassword);

export default router;
