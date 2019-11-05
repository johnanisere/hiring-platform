import Interviews from '../models/Interviews';
import { Request, Response } from 'express';
import User from '../models/User';
import { interviewValidation } from '../validator/interviewValidation';
import interviewInvitationMail from '../utils/interviewInvitation';
export const scheduleInterview = async (req: Request, res: Response) => {
  try {
    const { error } = interviewValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const interview = new Interviews(req.body);

    try {
      const hiringPartner = await User.findOne({
        email: req.body.hiringPartner,
      });

      hiringPartner && hiringPartner.interviews.push(interview._id);
      hiringPartner && (await hiringPartner.save());
    } catch (err) {
      res.status(400).send(err);
    }

    try {
      const decaDev = await User.findOne({ email: req.body.decaDev });

      if (decaDev) {
        decaDev.interviews.push(interview._id);
        await decaDev.save();
        interviewInvitationMail(req, decaDev, interview._id);
      }
    } catch (error) {
      res.status(400).send(error);
    }

    try {
      const savedInterview = await interview.save();

      return res.status(201).json({
        interviewData: {
          hiringPartner: savedInterview.hiringPartner,
          decaDev: savedInterview.decaDev,
          location: savedInterview.location,
          startTime: savedInterview.startTime,
          endTime: savedInterview.endTime,
          startDate: savedInterview.startDate,
          endDate: savedInterview.endDate,
          description: savedInterview.description,
          id: savedInterview._id,
        },
        message: "Interview has been sent to Decadev's email",
      });
    } catch (error) {
      return res.status(404).json(`Error: ${error}`);
    }
  } catch (err) {
    return console.log({ error: err.message });
  }
};

export const acceptInterview = async (req: Request, res: Response) => {
  try {
    const interview = await Interviews.findByIdAndUpdate(
      req.params.interviewId,
      req.body,
      { new: true },
    );
    return res.status(200).json({ interview });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};
