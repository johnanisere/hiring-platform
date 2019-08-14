import User from '../models/User';
import { Response, Request, NextFunction } from 'express';

export default async function signUp(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const user = await new User(req.body);
    const newUser = await user.save();
    return res.status(200).json({
      output: 'Sign Up successful.',
      newUser,
    });
  } catch (error) {
    const { message } = error;
    console.log(error.message);
    return res.status(400).json({
      output: 'Sign Up not successful!!!',
      message,
    });
  }
}
