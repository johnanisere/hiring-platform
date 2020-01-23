import { Request, Response } from 'express';
import Interviews from '../models/Interviews';

export async function whyDecline(req: Request, res: Response) {
  try {
    const { interviewId, declineReason } = req.body;

    const updatedInterview = await Interviews.findOneAndUpdate(
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

    if (!updatedInterview) return;
    updatedInterview.save();

    res.status(200).send({
      message: 'Interview Invitation has been declined',
    });
    return;
  } catch (error) {
    if (error.status === 401 || error.status === 404)
      return 'Error! Process failed';
    return res.status(400).json({
      see: 'seems to be an error in whyDecline controller',
      actual: error.message,
      message: 'Error! Process failed',
    });
  }
}
