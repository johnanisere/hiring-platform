import Interviews from '../models/Interviews';

export const scheduleInterview = async (req: any, res: any) => {
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
