import { Router } from 'express';
import inviteHiringPartner from '../controllers/inviteHiringPartner';
import updatePassword from '../controllers/passwordUpdate';
import getAllDecadevs from '../controllers/decadevs';
import userLogin from '../controllers/login';
import signUp from '../controllers/signUp';
import changePassword from '../controllers/changePassword';
import authMiddleware from '../middleware/auth';
import updateUserInfo from '../controllers/updateUserInfo';

const router = Router();

router
  .post('/signup', signUp)
  .post('/login', userLogin)
  .get('/decadevs', getAllDecadevs)
  .post('/hiring-partner/invite', inviteHiringPartner)
  .put('/change-password', authMiddleware, changePassword)
  .put('/update-password/', authMiddleware, updatePassword)
  .put('/update-userInfo/:email', authMiddleware, updateUserInfo);

export default router;
