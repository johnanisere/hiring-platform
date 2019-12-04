import Skill from '../models/Skills';
import User from '../models/User';

import { Request, Response, NextFunction } from 'express';

export default async function updateSkillInfo(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id, type, description } = request;

    await Skill.findOneAndUpdate(
      { _id: request.id },
      { _id: id, type, description },
    );
    const user = await User.findOne({ email })
      .populate('skills')
      .populate('employments')
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
      message: 'Skill Info update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function newSkill(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { type, description } = request;
    const newSkill = new Skill({
      type,
      description,
    });
    const createdSkill = await newSkill.save();
    const dev = await User.findOne({ email });
    if (dev !== null) {
      dev.skills.push(createdSkill._id);
      await dev.save();
    }
    const user = await User.findOne({ email })
      .populate('skills')
      .populate('employments')
      .populate('portfolio')
      .populate('publication')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });
    if (user !== null) {
      const updatedUser = await user.save();

      res.status(200).send({
        message: 'New Skill Details have been successfully added',
        user: updatedUser,
      });
      return;
    }
  } catch (err) {
    res.status(400).send({
      message: 'Skill Info update failed!!!',
      error: err.message,
    });
    return;
  }
}

export async function deleteSkill(
  req: Request,
  res: Response,
  _next: NextFunction,
) {
  try {
    const email = req.params.email;
    const request = req.body;
    const { id } = request;
    await Skill.findOneAndDelete({ _id: id });
    const user = await User.findOne({ email })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publication')
      .populate('education')
      .select({ __v: 0, _id: 0, createdAt: 0, updatedAt: 0, password: 0 });

    user ? await user.save() : console.log('Dev not found');
    res.status(200).send({
      message: 'Skill successfully deleted',
      user,
    });
    return;
  } catch (err) {
    res.status(400).send({
      message: 'Skill Info delete failed!!!',
      error: err.message,
    });
    return;
  }
}
