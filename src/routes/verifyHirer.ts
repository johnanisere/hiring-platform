import { Router } from 'express';
import { getAllUnverified } from '../controllers/hiringPartners';

const router = Router();

router.get('/unverified', getAllUnverified);

export default router;
