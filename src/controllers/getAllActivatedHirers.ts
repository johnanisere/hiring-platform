import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export default async function getAllActivatedHirers(
  _req: Request,
  res: Response,
) {
  try {
    const activatedHirers = await HiringPartner.find({ active: true });
    if (activatedHirers[0]) {
      res.status(200).send(activatedHirers);
      return;
    }
    res.status(204).json({ message: 'No activated Hiring Partner' });
    return;
  } catch (err) {
    res.status(400).json({
      actual: err.message,
      message: 'Error getting all activated partners',
    });
    return;
  }
}
