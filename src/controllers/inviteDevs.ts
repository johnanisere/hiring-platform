import { Request, Response } from 'express';

export const inviteDevs = async (req: Request, res: Response) => {
  try {
    const { squadNo } = req.body;
    return res.json({ Squad: squadNo });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};
