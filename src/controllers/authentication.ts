import User from '../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response, NextFunction } from 'express';

export default async function createUser(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  const salt = await bcrypt.genSalt(10);
  req.body.password = await bcrypt.hash(req.body.password, salt);

  const user = new User(req.body);
  const data = await user.save();
  console.log(data);

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

  console.log(token);

  res.json({
    ...data.toObject(), //res is a mongoose doc, so we turn it to an object.
    id: data._id,
    token: token,
  });
}
