import User from '../models/User';
import { Request, Response } from 'express';

export default async function hiredDev(req: Request, res: Response) {
  try {
    const { hired, email } = req.body;

    const decadev = await User.findOneAndUpdate(
      { email },
      {
        hired,
      },
      {
        new: true,
      },
    );

    if (decadev) {
      await decadev.save();
      res.status(200).send({
        message: 'Decadev has been hired',
        decadev,
      });
    }
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Network Error',
      actual: err.message,
    });
  }
}
