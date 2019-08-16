import User from '../models/User';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';

export default async function changePassword(req: Request, res: Response) {
  try {
    // check if the user is valid
    const { email, newPassword, confirmPassword } = req.body;

    const checkUser = await User.findOne({ email: email });
    if (!checkUser) return res.status(401).json({ error: `User not found !` });

    if (newPassword !== confirmPassword)
      return res.status(401).json({ error: `Password doesn't match` });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(newPassword, salt);

    await User.updateOne({ _id: checkUser._id }, { $set: { password: hash } });
    return res.status(200).json({ message: `Password updated successfully` });
  } catch (err) {
    console.log(err.message);
    return res.status(400).json({
      error: 'Password update failed!!!',
    });
  }
}
