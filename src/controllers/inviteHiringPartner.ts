import User from '../models/User';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response } from 'express';
import sendInviteMail from '../utils/sendInviteMail';

export default async function inviteHiringPartner(req: Request, res: Response) {
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

  sendInviteMail(req, token);
  res.json({
    ...data.toObject(),
    id: data._id,
    token: token,
  });
}
