import Interviews from '../models/Interviews';
import { Request, Response } from 'express';

export const scheduleInterview = async (req: Request, res: Response) => {
  const interview = new Interviews(req.body);
  try {
    const savedInterview = await interview.save();
    return res.status(201).json({
      interview: {
        hiringPartner: savedInterview.hiringPartner,
        decaDev: savedInterview.decaDev,
        location: savedInterview.location,
        time: savedInterview.time,
        description: savedInterview.description,
        accepted: savedInterview.accepted,
      },
    });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};

// export const acceptInterview = async (req: Request, res: Response) => {
//   try {
//     const interview = await Interviews.findById(req.params.id);
//     if (!interview) {
//       return res.send('No interview found');
//     } else {
//       interview.accepted = true;
//       const newInterviewStatus = await interview.save();
//       return res.status(200).json({ newInterviewStatus });
//     }
//   } catch (error) {
//     return res.status(404).json(`Error: ${error}`);
//   }
// };
