import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

export default function authCurrentUser(req: Request, res: Response) {
  try {
    const { user } = req.body;
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      PRIVATE_KEY,
      {
        expiresIn: '1h',
      },
    );

    res
      .header('auth-token', token)
      .status(200)
      .send({ ...user, token });
  } catch (error) {
    res.status(400).send({
      error,
    });
  }
}
