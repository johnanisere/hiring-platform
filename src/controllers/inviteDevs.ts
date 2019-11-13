import { Request, Response } from 'express';
import devsMailInvite from '../utils/devinvite';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

const sendInviteEmail = (emails: []) => {
  const invites = emails.map(async (email: string) => {
    let array = email.split(',');
    const token = jwt.sign(
      {
        email: array[1],
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
    return res.status(404).json(`Error: ${error}`);
  }
};
