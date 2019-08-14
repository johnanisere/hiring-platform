import User from '../models/User';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response } from 'express';
import sendInviteMail from './sendMail';

export default async function inviteHiringPartner(req: Request, res: Response) {
  const user = new User(req.body);

  const data = await user.save();
  const token = jwt.sign(
    {
      userId: data.id,
    },
    PRIVATE_KEY,
    {
      expiresIn: '1h',
    },
  );

  sendInviteMail(req);
  res.json({
    ...data.toObject(), //res is a mongoose doc, so we turn it to an object.
    id: data._id,
    token: token,
  });
}