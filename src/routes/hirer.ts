import { Router } from 'express';
import { getAllUnverified } from '../controllers/getAllUnverified';
import { verifyHirer } from '../controllers/verifyHiringPartner';
import hirerSignUp from '../controllers/hirerSignUp';

const router = Router();

router
  .get('/unverified', getAllUnverified)
  .put('/verifyhirer', verifyHirer)
  .post('/signup', hirerSignUp);

export default router;
