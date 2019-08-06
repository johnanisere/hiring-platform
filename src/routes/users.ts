import { Router } from 'express';
// import { authMiddleware } from '../middleware/auth';
import createUser from '../controllers/authentication';

const router = Router();

router.post('/', createUser);

router.post('/', async function(_req, res, _next) {
  res.send('update password');
});

export default router;
