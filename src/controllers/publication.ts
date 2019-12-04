import Publication from '../models/Publications';
import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export default async function updatePublication(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id, link, title } = request;
    await Publication.findOneAndUpdate(
      { _id: request.id },
      { _id: id, link, title },
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
      message: 'Publication has been successfully updated',
      user,
    });
  } catch (err) {
    res.status(400).send({
      message: 'Publication update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function newPublication(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { link, title } = request;
    const newPublication = new Publication({
      link,
      title,
    });

    const createdPublication = await newPublication.save();
    const dev = await User.findOne({ email });
    if (dev !== null && dev.publications) {
      dev.publications.push(createdPublication._id);
      await dev.save();
      console.log({ publications: dev.publications });
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
          message: 'New Publication has successfully added',
          user: updatedUser,
        });
        return;
      }
    }

    return;
  } catch (err) {
    res.status(400).send({
      message: 'Publication update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function deletePublication(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id } = request;
    await Publication.findOneAndDelete({ _id: id });
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publications')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });

    user ? await user.save() : console.log('Dev not found');
    res.status(200).send({
      message: 'Publication successfully deleted',
      user,
    });
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Publication delete failed!!!',
      error: err.message,
    });
    return;
  }
}
