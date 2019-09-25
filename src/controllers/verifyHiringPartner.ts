import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export async function verifyHirer(req: Request, res: Response) {
  try {
    const unverifiedPartner = await HiringPartner.findOne({
      email: req.body.email,
    });

    if (unverifiedPartner) {
      unverifiedPartner.isVerified = true;
    }
    res.send({ message: 'Hirer not unverified!' });
  } catch (err) {
    res.status(400).send(err.message);
  }
}
