import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import createUser from '../controllers/authentication';
import updatePassword from '../controllers/passwordUpdate';

const router = Router();

router.post('/', createUser);

router.put('/passwordUpdate/', authMiddleware, updatePassword);

export default router;
