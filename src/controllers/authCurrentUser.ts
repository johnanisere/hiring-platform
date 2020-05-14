import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export default function authCurrentUser(req: Request, res: Response) {
  try {
    const { user } = req.body;
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      `${process.env.ACCESS_TOKEN_SECRET}`,
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
      actual: error.message,
      message: 'Authentication Error',
    });
  }
}
