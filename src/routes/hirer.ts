import { Router } from 'express';
import { getAllUnactivated } from '../controllers/getAllUnactivateded';
import { activateHirer } from '../controllers/activateHiringPartner';
import hirerSignUp from '../controllers/hirerSignUp';
import verifyHirer from '../controllers/verifyHirer';

const router = Router();

router
  .get('/unactivated', getAllUnactivated)
  .put('/activatehirer', activateHirer)
  .post('/signup', hirerSignUp)
  .put('/verifyhirer', verifyHirer);

export default router;
