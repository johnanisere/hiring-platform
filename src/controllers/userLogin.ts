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
    console.log(error);
    throw new Error('error!!!!! user is not valid!');
  }

  try {
    const requestedSingleUser = await User.findOne({
      email: value.email,
    }).select({
      password: 0,
      __v: 0,
      isDeleted: 0,
      dateCreated: 0,
      interviews: 0,
    });
    if (!requestedSingleUser) {
      throw new Error('User not found, create account!');
    } else {
      const salt = await bcrypt.genSalt(10);
      value.password = await bcrypt.hash(value.password, salt);
      const suspected = requestedSingleUser.toObject();
      const isMatch = bcrypt.compare(value.password, suspected.password);
      if (!isMatch) {
        throw new Error('wrong password');
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
        res.header('auth-token', token);

        res.status(200).send({ ...suspected, token });
      }
    }
  } catch (err) {
    res.send(err.message);
  }
}
