import { Request, Response } from 'express';
import httpStatus from 'http-status';

import Interviews from '../models/Interviews';
import HiringPartner from '../models/HiringPartner';
import User from '../models/User';
import { interviewValidation } from '../validator/interviewValidation';
import interviewInvitationMail from '../utils/interviewInvitation';
import sendResponse from '../utils/response';

export const scheduleInterview = async (req: Request, res: Response) => {
  const { error, value } = interviewValidation(req.body);
  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(
      sendResponse({
        message: 'Please provide valid interview details',
        error,
      }),
    );
    return;
  }

  try {
    const interview = new Interviews(req.body);

    let interviewedUser = await User.findOne({ email: req.body.decaDev });

    if (!interviewedUser) {
      res.status(httpStatus.NOT_FOUND).send(
        sendResponse({
          message: 'decadev not found!',
        }),
      );
      return;
    }

    let podName = interviewedUser!.pod;

    const hiringPartner = await HiringPartner.findOne({
      email: value.hiringPartner,
    });

    if (!hiringPartner) {
      res.status(httpStatus.NOT_FOUND).send(
        sendResponse({
          message: 'partner not found!',
        }),
      );
      return;
    }

    const savedInterview = await interview.save();

    for (
      let i = 0, length = hiringPartner.currentInviteCount.length;
      i < length;
      i++
    ) {
      if (hiringPartner.currentInviteCount[i].pod === podName.toLowerCase()) {
        if (hiringPartner.currentInviteCount[i].count >= 1) {
          ++hiringPartner.currentInviteCount[i].count;
          hiringPartner.currentInviteCount[i].next = false;
        } else {
          ++hiringPartner.currentInviteCount[i].count;
          hiringPartner.currentInviteCount[i].next = true;
        }
      }
    }

    hiringPartner.interviews.push(interview._id);
    hiringPartner.markModified('interviews');
    hiringPartner.markModified('currentInviteCount');
    await hiringPartner.save();

    const decaDev = await User.findOne({ email: req.body.decaDev });

    if (!decaDev) return;
    decaDev.interviews.push(interview._id);
    await decaDev.save();

    if (process.env.NODE_ENV !== 'test') {
      interviewInvitationMail(req, decaDev, interview._id);
    }

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
