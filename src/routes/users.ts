import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { createUser } from '../controllers/authentication';

const router = Router();

router.post('/', async function(req, res, _next) {
  const operation = await createUser(req.body);

  res.json(operation);
});

router.get('/profile', authMiddleware, async function(_req, res, _next) {
  res.json({ message: 'Hurray, you made it!' });
});

router.post('/', async function(_req, res, _next) {
  res.send('update password');
});

export default router;
