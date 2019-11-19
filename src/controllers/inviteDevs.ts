import { Request, Response } from 'express';
import User from '../models/User';
import devsMailInvite from '../utils/devinvite';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';

const sendInviteEmail = (emails: []) => {
  const invites = emails.map(async (email: string) => {
    let array = email.split(',');
    const user = await new User({
      password: 'newPassword',
      role: 'dev',
      name: array[0],
      profilePhoto:
        'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_thumb,g_face,r_20,e_sepia/l_cloudinary_icon,g_south_east,x_5,y_5,w_50,o_60,e_brightness:200/a_10/front_face.png',
      email: array[1],
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
    return res.status(404).json(`Error: ${error}`);
  }
};
