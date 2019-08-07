import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

export default async function updatePassword(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send('User not found!!!');
    } else {
      user.password = req.body.newPassword;
      const updated = await user.save();
      return res.status(200).send({
        message: 'Password updated',
        updated: {
          name: updated.name,
          email: updated.email,
          phone: updated.phone,
        },
      });
    }
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: 'Password update failed!!!',
    });
  }
}
