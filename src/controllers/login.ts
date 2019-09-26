import User from '../models/User';
import joi from '@hapi/joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { PRIVATE_KEY } from '../config';

const loginSchema: any = {
  email: joi.string().required(),
  password: joi.string().required(),
};

export default async function userLogin(req: Request, res: Response) {
  const { error, value } = joi.validate(req.body, loginSchema, {
    skipFunctions: true,
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    res.status(400).send({ error });
  }

  try {
    const requestedSingleUser = await User.findOne({
      email: value.email,
    }).select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0 });
    if (!requestedSingleUser) {
      res.status(404).send({ error: 'user does not exist' });
    } else {
      const suspected = requestedSingleUser.toObject();
      const isMatch = await bcrypt.compare(value.password, suspected.password);

      if (!isMatch) {
        res.status(401).send({ error: 'wrong password' });
      } else {
        const token = jwt.sign(
          {
            id: suspected.id,
            email: suspected.email,
          },
          PRIVATE_KEY,
          {
            expiresIn: '1h',
          },
        );
        const { password, ...rest } = suspected;
        res
          .header('auth-token', token)
          .status(200)
          .send({ ...rest, token });
      }
    }
    return;
  } catch (err) {
    res.status(400).send({ err });
    return;
  }
}
