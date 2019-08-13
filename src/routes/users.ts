import { Router } from 'express';
import inviteHiringPartner from '../controllers/inviteHiringPartner';
import updatePassword from '../controllers/passwordUpdate';
import getAllDecadevs from '../controllers/decadevs';
import signUp from '../controllers/signUp';

const router = Router();

router
  .get('/decadevs', getAllDecadevs)
  .post('/signup', signUp)
  .post('/hiring-partner/invite', inviteHiringPartner)
  .put('/update-password/', updatePassword);

export default router;
