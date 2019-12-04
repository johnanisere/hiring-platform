import User from '../models/User';
import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';

export default async function updatePassword(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const { password, confirmPassword, email } = req.body;
    console.log({ email, password, confirmPassword });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "Password doesn't match" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = await User.findOneAndUpdate({ email }, { password: hash });

    if (!user) {
      res.send('User not found!!!');
      return;
    } else {
      const updated = await user.save();

      res.status(200).send({
        message: 'Password updated',
        updated: {
          name: updated.name,
          email: updated.email,
        },
      });
    }
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Password update failed!!!',
      error: err.message,
    });
    return;
  }
}
