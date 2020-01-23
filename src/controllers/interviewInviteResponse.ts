import { Request, Response } from 'express';
import Interviews from '../models/Interviews';

export async function interviewInviteResponse(req: Request, res: Response) {
  try {
    const { intent, interviewId } = req.params;

    if (intent === 'true') {
      await Interviews.findOneAndUpdate(
        {
          _id: interviewId,
        },
        {
          accepted: true,
        },
        {
          new: true,
        },
      ).exec();
      await Interviews.findOneAndUpdate(
        {
          _id: interviewId,
        },
        {
          pending: false,
        },
        {
          new: true,
        },
      ).exec();

      res.status(200).send({
        message: 'Interview Invitation has been accepted',
      });
      return;
    } else if (intent === 'false') {
      await Interviews.findOneAndUpdate(
        {
          _id: interviewId,
        },
        {
          declined: true,
        },
      ).exec();
      await Interviews.findOneAndUpdate(
        {
          _id: interviewId,
        },
        {
          pending: false,
        },
      ).exec();
      res.status(200).send({
        message: 'Interview Invitation has beeen declined',
      });
      return;
    }
  } catch (error) {
    res.status(400).send({
      see: 'seems to be an error in the interviewInviteResponse controller',
      actual: error.message,
      message: 'Error! Could not send response',
    });
    return;
  }
}
