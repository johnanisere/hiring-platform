import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

export default async function updatePassword(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { email } = req.body.user;
    const user = await User.findOne({ email });

    if (!user) {
      res.send('User not found!!!');
    } else {
      user.password = req.body.newPassword;
      const updated = await user.save();

      res.status(200).send({
        message: 'Password updated',
        updated: {
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
        },
      });
    }
  } catch (err) {
    res.status(400).send({
      message: 'Password update failed!!!',
      error: err.message,
    });
  }
}
