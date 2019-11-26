import { Router } from 'express';
import { getAllUnactivated } from '../controllers/getAllUnactivateded';
import { activateHirer } from '../controllers/activateHiringPartner';
import hirerSignUp from '../controllers/hirerSignUp';
import verifyHirer from '../controllers/verifyHirer';
import hirerLogin from '../controllers/hirerLogin';
import getAllActivatedHirers from '../controllers/getAllActivatedHirers';

const router = Router();

router
  .get('/unactivated', getAllUnactivated)
  .get('/activated', getAllActivatedHirers)
  .put('/activatehirer', activateHirer)
  .post('/signup', hirerSignUp)
  .put('/verifyhirer', verifyHirer)
  .post('/login', hirerLogin);

export default router;
