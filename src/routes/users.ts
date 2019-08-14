import { Router } from 'express';
import createUser from '../controllers/authentication';
import updatePassword from '../controllers/passwordUpdate';
import getAllDecadevs from '../controllers/decadevs';
import userLogin from '../controllers/userLogin';

const router = Router();

router
  .get('/decadevs', getAllDecadevs)
  .post('/hiring-partner/invite', createUser)
  .put('/update-password/', updatePassword)
  .post('/user-login', userLogin);

export default router;
