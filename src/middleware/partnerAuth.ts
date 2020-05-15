import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import HiringPartner from '../models/HiringPartner';

export default function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.headers['authorization'];

  if (!token) {
    res.status(401).send({ message: 'UnAuthorised User' });

    return;
  }

  const actualToken = token.split(' ')[1];

  jwt.verify(
    actualToken,
    `${process.env.ACCESS_TOKEN_SECRET}`,
    async (err: any, payload: any) => {
      if (err) {
        res.status(401).send(err);
      }

      let doc = await HiringPartner.findOne({ email: payload.email }).select({
        password: 0,
      });
      if (doc) {
        req.body.id = doc._id;
        next();
      } else {
        res.status(401).send({ error: 'Unauthorized User' });
      }
    },
  );
}
