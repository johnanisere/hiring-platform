import { Router } from 'express';
import { inviteDevs } from '../controllers/inviteDevs';

const router = Router();
router.post('/invite/devs', inviteDevs);

export default router;
