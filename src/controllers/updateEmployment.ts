import Employment from '../models/Employment';
import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export default async function updateEmploymentInfo(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id, title, location, duration, achievements } = request;
    await Employment.findOneAndUpdate(
      { _id: request.id },
      { _id: id, title, location, duration, achievements },
    );
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
    user ? await user.save() : console.log('Dev not found');

    res.status(200).send({
      message: 'Details have been successfully updated',
      user,
    });
  } catch (err) {
    res.status(400).send({
      message: 'Employment Info update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function newEmployment(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { title, location, duration, achievements } = request;
    const newEmployment = new Employment({
      title,
      location,
      duration,
      achievements,
    });
    const createdEmployment = await newEmployment.save();
    const dev = await User.findOne({ email });
    if (dev !== null) {
      dev.employments.push(createdEmployment._id);
      await dev.save();
    }
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
    if (user !== null) {
      const updatedUser = await user.save();

      res.status(200).send({
        message: 'New Employment Details have been successfully added',
        user: updatedUser,
      });
      return;
    }
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Employment Info update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function deleteEmployment(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id } = request;
    await Employment.findOneAndDelete({ _id: id });
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });

    user ? await user.save() : console.log('Dev not found');
    res.status(200).send({
      message: 'Experience successfully deleted',
      user,
    });
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Employment Info delete failed!!!',
      error: err.message,
    });
    return;
  }
}
