import User from '../models/User';
import { Response, Request } from 'express';

export default async function allDevs(_req: Request, res: Response) {
  try {
    let allDevs = await User.find({ role: 'dev' })
      .populate('education')
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publications')
      .select({
        __v: 0,
        createdAt: 0,
        updatedAt: 0,
        password: 0,
        description: 0,
      });
    res.status(200).send({ allDevs });
  } catch (err) {
    res.status(400).send({
      actual: err.message,
      message: "Error getting all decadevs' info!",
    });
  }
}
