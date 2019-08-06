import User from '../models/User';
import { Request, Response, NextFunction } from 'express';

export default async function updatePassword(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const user = await User.findById(req.body.id);
    console.log(user);

    if (!user) return 'User not found!!!';
    user.password = req.body.newPassword;
    const updated = await user.save();
    return res.status(200).json({
      message: 'Password updated',
      updated,
    });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      message: 'Password update failed!!!',
    });
  }
}
