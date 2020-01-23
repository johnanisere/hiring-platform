import { Request, Response } from 'express';
import User from '../models/User';
import devsMailInvite from '../utils/devinvite';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

const sendInviteEmail = (emails: []) => {
  const invites = emails.map(async (email: string) => {
    let array = email.split(',');
    const user = new User({
      password: 'newPassword',
      role: 'dev',
      name: array[0],
      profilePhoto:
        'https://res.cloudinary.com/decagon/image/upload/v1574531245/avatar-1577909_960_720_v012qj.png',
      email: array[1],
      pod: array[2],
    });
    const newDev = await user.save();
    const token = jwt.sign(
      {
        email: array[1],
        userId: newDev._id,
      },
      PRIVATE_KEY,
      {
        expiresIn: '1h',
      },
    );
    await devsMailInvite(token, array[0], array[1]);
  });

  Promise.all(invites);
};
export const inviteDevs = async (req: Request, res: Response) => {
  try {
    const emails = req.body;
    sendInviteEmail(emails);
    return res.json({
      message: `Your invites have been sent`,
    });
  } catch (error) {
    return res
      .status(404)
      .json({ actual: error.message, message: 'Error! Process failed' });
  }
};
