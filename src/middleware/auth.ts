import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import User from '../models/User';

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = `${req.headers['authorization']}`;
  const actualToken = token ? token.split(' ')[1] : '';

  jwt.verify(actualToken, PRIVATE_KEY, (err: any, payload: any) => {
    if (payload) {
      User.findOne({ email: payload.email }).then(doc => {
        req.body.user = doc;
        return next();
      });
    }
    if (err) {
      res.status(401).send(err);
    }
  });
}
