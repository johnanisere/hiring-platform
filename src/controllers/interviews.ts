import Interviews from '../models/Interviews';
import { Request, Response } from 'express';
import User from '../models/User';

export const scheduleInterview = async (req: Request, res: Response) => {
  const interview = new Interviews(req.body);
  try {
    const hiringPartner = await User.findOne({ email: req.body.hiringPartner });
    hiringPartner && hiringPartner.interviews.push(interview._id);
    hiringPartner && (await hiringPartner.save());
  } catch (err) {
    res.status(400).send(err);
  }

  try {
    const decaDev = await User.findOne({ email: req.body.decaDev });
    decaDev && decaDev.interviews.push(interview._id);
    decaDev && (await decaDev.save());
  } catch (error) {
    res.status(400).send(error);
  }

  try {
    const savedInterview = await interview.save();

    return res.status(201).json({
      hiringPartner: savedInterview.hiringPartner,
      decaDev: savedInterview.decaDev,
      location: savedInterview.location,
      time: savedInterview.time,
      description: savedInterview.description,
      accepted: savedInterview.accepted,
      id: savedInterview._id,
    });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};
