import Interviews from '../models/Interviews';

export const scheduleInterview = async (req: any, res: any) => {
  const interview = new Interviews(req.body);
  try {
    const savedInterview = await interview.save();
    savedInterview._id = undefined;
    savedInterview.__v = undefined;
    return res.status(201).json({ interview: savedInterview });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};
