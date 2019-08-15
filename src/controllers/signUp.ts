import User from '../models/User';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Response, Request, NextFunction } from 'express';
import sendSignUpMail from '../controllers/sendSignUpMail';

export default async function signUp(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const user = await new User(req.body);
    user.profilePhoto =
      'https://res.cloudinary.com/demo/image/upload/w_150,h_150,c_thumb,g_face,r_20,e_sepia/l_cloudinary_icon,g_south_east,x_5,y_5,w_50,o_60,e_brightness:200/a_10/front_face.png';
    user.role = 'dev';
    const newUser = await user.save();
    const token = jwt.sign(
      {
        userId: newUser.id,
      },
      PRIVATE_KEY,
      {
        expiresIn: '1h',
      },
    );

    res.status(200).json({
      output: 'Sign Up successful.',
      newUser,
    });

    sendSignUpMail(req, token);
    res.json({
      ...newUser.toObject(),
      id: newUser._id,
      token: token,
    });
  } catch (error) {
    const { message } = error;
    console.log(error.message);
    res.status(400).json({
      output: 'Sign Up not successful!!!',
      message,
    });
  }
}
