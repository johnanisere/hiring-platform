import { Router } from 'express';
import { getAllUnactivated } from '../controllers/getAllUnactivateded';
import { activateHirer } from '../controllers/activateHiringPartner';
import hirerSignUp from '../controllers/hirerSignUp';
import verifyHirer from '../controllers/verifyHirer';
import hirerLogin from '../controllers/hirerLogin';

const router = Router();

router
  .get('/unactivated', getAllUnactivated)
  .put('/activatehirer', activateHirer)
  .post('/signup', hirerSignUp)
  .put('/verifyhirer', verifyHirer)
  .post('/login', hirerLogin);

export default router;
