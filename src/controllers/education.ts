import Education from '../models/Education';
import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export default async function updateEducation(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id, qualification, placeOfEducation, duration } = request;
    await Education.findOneAndUpdate(
      { _id: request.id },
      { _id: id, qualification, placeOfEducation, duration },
    );
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publications')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
    user ? await user.save() : console.log('Dev not found');

    res.status(200).send({
      message: 'Education has been successfully updated',
      user,
    });
  } catch (err) {
    res.status(400).send({
      message: 'Education update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function newEducation(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { qualification, placeOfEducation, duration } = request;
    const newEducation = new Education({
      qualification,
      placeOfEducation,
      duration,
    });

    const createdEducation = await newEducation.save();
    const dev = await User.findOne({ email });
    if (dev !== null && dev.education) {
      dev.education.push(createdEducation._id);
      await dev.save();

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
          message: 'New Education has successfully added',
          user: updatedUser,
        });
        return;
      }
    }

    return;
  } catch (err) {
    res.status(400).send({
      message: 'Education update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function deleteEducation(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id } = request;
    await Education.findOneAndDelete({ _id: id });
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publication')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });

    user ? await user.save() : console.log('Dev not found');
    res.status(200).send({
      message: 'Education successfully deleted',
      user,
    });
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Education delete failed!!!',
      error: err.message,
    });
    return;
  }
}
