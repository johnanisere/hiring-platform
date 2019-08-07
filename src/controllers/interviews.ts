import Interviews from '../models/Interviews';
import { Request, Response } from 'express';

export const scheduleInterview = async (req: Request, res: Response) => {
  const interview = new Interviews(req.body);
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
