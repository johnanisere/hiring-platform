import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export default async function updateUserInfo(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    try {
      let keys = Object.keys(request);
      for (const item of keys) {
        await User.findOneAndUpdate(
          { email: email },
          { [item]: request[item] },
        );
      }
      const user = await User.findOne({ email })
        .populate('employments')
        .populate('skills')
        .populate('portfolio')
        .populate('publications')
        .populate('education')
        .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
      if (user !== null) {
        const updatedUser = await user.save();
        res.status(200).send({
          message: `Details have been successfully updated`,
          user: updatedUser,
        });
        return;
      }
    } catch (err) {
      res.send({
        see: 'seems to be an error with the forIn in UpdateUserInfo controller',
        actual: err.message,
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      message: 'User Info update failed!!!',
      actual: err.message,
    });
    return;
  }
}
