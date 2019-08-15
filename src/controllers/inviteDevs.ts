import { Request, Response } from 'express';
import devsMailInvite from '../utils/devinvite';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

const sendInviteEmail = () => {
  const invites = [{ name: 'seun jay', email: 'seunjay92@gmail.com' }].map(
    async ({ name, email }) => {
      const token = jwt.sign(
        {
          email: email,
        },
        PRIVATE_KEY,
        {
          expiresIn: '1h',
        },
      );
      return await devsMailInvite(token, name, email);
    },
  );

  Promise.all(invites);
};
export const inviteDevs = async (req: Request, res: Response) => {
  try {
    const { squadNo } = req.body;
    sendInviteEmail();
    return res.json({
      message: `Your invites have been sent to ${squadNo}`,
    });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};
