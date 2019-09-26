import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export async function getAllUnverified(_req: Request, res: Response) {
  try {
    const unverifiedHirers = await HiringPartner.find({ isVerified: false });
    if (unverifiedHirers[0]) {
      res.status(200).send(unverifiedHirers);
      return;
    }
    res.status(204).send({ message: 'No unverified Hiring Partner' });
    return;
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
}
