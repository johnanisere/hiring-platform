import Interviews from '../models/Interviews';
import { Request, Response } from 'express';
import HiringPartner from '../models/HiringPartner';
import User from '../models/User';
import { interviewValidation } from '../validator/interviewValidation';
import interviewInvitationMail from '../utils/interviewInvitation';
export const scheduleInterview = async (req: Request, res: Response) => {
  try {
    const { error, value } = interviewValidation(req.body);
    if (error) return res.status(400).send('Invalid Fields');

    const interview = new Interviews(req.body);
    const savedInterview = await interview.save();

    const hiringPartner = await HiringPartner.findOne({
      email: value.hiringPartner,
    });

    if (!hiringPartner) {
      res.status(404).json({ message: 'partner not found' });
      return;
    }

    hiringPartner.interviews.push(interview._id);
    hiringPartner.markModified('interviews');
    await hiringPartner.save();

    const decaDev = await User.findOne({ email: req.body.decaDev });

    if (!decaDev) return;
    decaDev.interviews.push(interview._id);
    await decaDev.save();
    interviewInvitationMail(req, decaDev, interview._id);

    return res.status(200).json({
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
        scheduled: savedInterview.startDate,
      },
      message: "Interview has been sent to Decadev's email",
    });
  } catch (err) {
    return res.send({ actual: err.message, message: 'Error, Process failed!' });
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
