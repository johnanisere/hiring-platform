import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
// import {} from '../controllers/authentication';

const router = Router();

router.post('/', authMiddleware, function(_req, res, _next) {
  // const message = sampleController();
  // res.status(200).json({ message });
});

export default router;
