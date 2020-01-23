import { Request, Response } from 'express';
import Interviews from '../models/Interviews';

export default async function getAllInterviews(_req: Request, res: Response) {
  try {
    const allInterviews = await Interviews.find();
    res.status(200).send({
      allInterviews,
    });
  } catch (error) {
    res.status(400).send({
      see: 'seems to be an error in the getAllInterviews controller',
      message: error.message,
    });
    return;
  }
}
