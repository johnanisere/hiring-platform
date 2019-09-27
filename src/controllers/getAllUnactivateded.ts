import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export async function getAllUnactivated(_req: Request, res: Response) {
  try {
    const unactivatedHirers = await HiringPartner.find({ active: false });
    if (unactivatedHirers[0]) {
      res.status(200).send(unactivatedHirers);
      return;
    }
    res.status(204).send({ message: 'No unactivated Hiring Partner' });
    return;
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
}
