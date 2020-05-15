import HiringPartner from '../models/HiringPartner';
import joi from '@hapi/joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const hirerLoginSchema: any = {
  email: joi.string().required(),
  password: joi.string().required(),
};

export default async function userLogin(req: Request, res: Response) {
  const { error, value } = joi.validate(req.body, hirerLoginSchema, {
    skipFunctions: true,
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const requestedSingleHirer = await HiringPartner.findOne({
      email: value.email,
    })
      .populate('interviews')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0 });
    if (!requestedSingleHirer || requestedSingleHirer.active === false) {
      res.status(404).send({ error: 'user does not exist' });
      return;
    } else {
      const suspected = requestedSingleHirer.toObject();
      const isMatch = await bcrypt.compare(value.password, suspected.password);

      if (!isMatch) {
        res.status(401).send({ error: 'wrong password' });
        return;
      } else {
        const token = jwt.sign(
          {
            id: suspected.id,
            email: suspected.email,
          },
          `${process.env.ACCESS_TOKEN_SECRET}`,
          {
            expiresIn: '1h',
          },
        );
        const { password, ...rest } = suspected;
        res
          .header('auth-token', token)
          .status(200)
          .send({ ...rest, token });
        return;
      }
    }
  } catch (err) {
    res.status(400).send({ actual: err.message, message: 'Login Error!' });
    return;
  }
}
