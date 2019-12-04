import { Router } from 'express';
import scheduleTest from '../controllers/scheduleTest';

const router = Router();

router.post('/invite', scheduleTest);

export default router;
