import User from '../models/User';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response } from 'express';
import sendInviteMail from '../utils/sendInviteMail';

export default async function inviteHiringPartner(req: Request, res: Response) {
  try {
    const user = new User(req.body);
    user.profilePhoto =
      'https://res.cloudinary.com/decagon/image/upload/v1566482410/avatar/images_gjjulr.png';
    user.role = 'hiringpartner';
    const data = await user.save();
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
      sendInviteMail(req, token);
    } catch (err) {
      res.status(400).send({
        see: 'seems to be an issue with sending an email',
        actual: err.message,
        message: 'Unable to send invite emails',
      });
    }
    res.json({
      ...data.toObject(),
      id: data._id,
      token: token,
    });
    return;
  } catch (err) {
    res
      .status(400)
      .json({ actual: err.message, message: 'Error! Process failed' });
  }
}
