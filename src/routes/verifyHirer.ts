import { Router } from 'express';
import { getAllUnverified } from '../controllers/getAllUnverified';
import { verifyHirer } from '../controllers/verifyHiringPartner';

const router = Router();

router.get('/unverified', getAllUnverified).put('/verifyhirer', verifyHirer);

export default router;
