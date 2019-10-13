import { Request, Response } from 'express';
import Interviews from '../models/Interviews';

export async function interviewInviteResponse(req: Request, res: Response) {
  try {
    const intent = req.params.intent;
    const email = req.params.email;

    if (intent === 'true') {
      await Interviews.updateOne(
        {
          email,
        },
        {
          accepted: true,
        },
      ).exec();
    } else if (intent === 'false') {
      await Interviews.updateOne(
        {
          email,
        },
        {
          declined: true,
        },
      ).exec();
    }

    return;
  } catch (error) {
    res.status(400).send({
      see: 'seems to be an error in the interviewInviteResponse controller',
      message: error.message,
    });
    return;
  }
}
