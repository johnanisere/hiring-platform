import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export async function activateHirer(req: Request, res: Response) {
  try {
    await HiringPartner.updateOne(
      {
        email: req.body.email,
      },
      { activate: true },
    ).exec();

    res.status(200).send({
      message: `${req.body.name} has been activated!`,
    });
    return;
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
}
