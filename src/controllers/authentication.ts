import User from '../models/User';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response, NextFunction } from 'express';

export default async function createUser(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const user = new User(req.body);
  const data = await user.save();
  const token = jwt.sign(
    {
      id: data.id,
      email: data.email,
      name: data.name,
    },
    PRIVATE_KEY,
    {
      expiresIn: '1h',
    },
  );

  res.json({
    ...data.toObject(), //res is a mongoose doc, so we turn it to an object.
    id: data._id,
    token: token,
  });
}
