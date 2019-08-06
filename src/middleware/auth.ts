import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No Token!!!' });
  }

  const decodedToken = jwt.verify(token, PRIVATE_KEY);

  if (!decodedToken) {
    return res.status(401).json({ message: 'Unsuccessfull!' });
  }

  return next();
}
