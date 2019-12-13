import { Request, Response } from 'express';
import Interviews from '../models/Interviews';

export async function whyDecline(req: Request, res: Response) {
  try {
    const { interviewId, declineReason } = req.body;
    await Interviews.findOneAndUpdate(
      {
        _id: interviewId,
      },
      {
        declineReason,
      },
      {
        new: true,
      },
    );

    res.status(200).send({
      message: 'Interview Invitation has been declined',
    });
    return;
  } catch (error) {
    res.status(400).send({
      see: 'seems to be an error in whyDecline controller',
      actual: error.message,
      message: "Error! Process failed"
    });
  }
}
