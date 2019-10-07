import HiringPartner from '../models/HiringPartner';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response } from 'express';
import sendSignUpMail from '../utils/sendSignUpMail';

export default async function hirerSignUp(req: Request, res: Response) {
  try {
    const hirer = new HiringPartner(req.body);
    const data = await hirer.save();
    const token = jwt.sign(
      {
        userId: data.id,
        email: data.email,
      },
      PRIVATE_KEY,
      {
        expiresIn: '1h',
      },
    );
    try {
      sendSignUpMail(req, token);
    } catch (err) {
      res.status(400).send({
        see: `seems to be an issue with sending an email to ${req.body.email}!`,
        error: err.message,
      });
    }
    res.status(200).json({
      message:
        'Success!. An email has been sent to you. Please click link to verify your account.',
      data,
      token: token,
    });
    return;
  } catch (err) {
    res.status(400).send({
      see: 'seems to be an issue in hirerSignUp controller',
      error: err.message,
    });
    return;
  }
}
