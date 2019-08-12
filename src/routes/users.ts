import { Router } from 'express';
import createUser from '../controllers/authentication';
import updatePassword from '../controllers/passwordUpdate';
import getAllDecadevs from '../controllers/decadevs';
import changePassword from '../controllers/changePassword';
const router = Router();

router
  .get('/decadevs', getAllDecadevs)
  .post('/hiring-partner/invite', createUser)
  .put('/update-password/', updatePassword)
  .put('/change-password', changePassword);

export default router;
