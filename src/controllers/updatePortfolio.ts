import Portfolio from '../models/Portfolio';
import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export default async function updatePortfolioInfo(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id, title, languages, link } = request;
    await Portfolio.findOneAndUpdate(
      { _id: request.id },
      { _id: id, id, title, languages, link },
    );
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publication')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
    user ? await user.save() : console.log('Dev not found');

    res.status(200).send({
      message: 'Details have been successfully updated',
      user,
    });
  } catch (err) {
    res.status(400).send({
      message: 'Portfolio Info update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function newPortfolio(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { title, languages, link } = request;
    const newPortfolio = new Portfolio({
      title,
      languages,
      link,
    });
    const createdPortfolio = await newPortfolio.save();
    const dev = await User.findOne({ email });
    if (dev !== null) {
      dev.portfolio.push(createdPortfolio._id);
      await dev.save();
    }
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publication')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
    if (user !== null) {
      const updatedUser = await user.save();

      res.status(200).send({
        message: 'New Portfolio Details have been successfully added',
        user: updatedUser,
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      message: 'Portfolio Info update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function deletePortfolio(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id } = request;
    await Portfolio.findOneAndDelete({ _id: id });
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publication')
      .populate('education')
      .select({
        __v: 0,
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        password: 0,
      });

    user ? await user.save() : console.log('Dev not found');
    res.status(200).send({
      message: 'Project successfully deleted',
      user,
    });
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Portfolio Info delete failed!!!',
      error: err.message,
    });
    return;
  }
}
