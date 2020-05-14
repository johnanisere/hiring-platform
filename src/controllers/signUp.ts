import User from '../models/User';
import jwt from 'jsonwebtoken';
import { Response, Request, NextFunction } from 'express';
import sendSignUpMail from '../utils/sendSignUpMail';

export default async function signUp(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const iUser = await User.findOne({ email: req.body.email });
    if (iUser) {
      res.status(400).json({ error: ` Email ${iUser.email} already exists.` });
    } else {
      const user = new User(req.body);
      user.profilePhoto =
        'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_thumb,g_face,r_20,e_sepia/l_cloudinary_icon,g_south_east,x_5,y_5,w_50,o_60,e_brightness:200/a_10/front_face.png';
      user.role = 'dev';

      const newUser = await user.save();
      const token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
        },
        `${process.env.ACCESS_TOKEN_SECRET}`,
        {
          expiresIn: '1h',
        },
      );

      sendSignUpMail(req, token);
      res.status(200).json({
        message:
          'Sign Up successful. An email has been sent to you.Please click link to verify your account.',
        newUser,
        token: token,
      });
    }
    return;
  } catch (error) {
    res.status(400).json({ actual: error.message, message: 'Signup failed!' });
    return;
  }
}
