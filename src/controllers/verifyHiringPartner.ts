import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export async function verifyHirer(req: Request, res: Response) {
  try {
    await HiringPartner.updateOne(
      {
        email: req.body.email,
      },
      { isVerified: true },
    ).exec();

    res.send({
      message: `${req.body.name} has been verified!`,
    });
    return;
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
}
