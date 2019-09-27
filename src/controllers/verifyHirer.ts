import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';

export default async function verifyHirer(req: Request, res: Response) {
  try {
    const hirer = await HiringPartner.findOne({ email: req.body.email });

    if (hirer) {
      await HiringPartner.updateOne(
        {
          email: req.body.email,
        },
        { verified: true },
      ).exec();

      res.status(200).send({
        message: `${req.body.email}, your account has been verified! You'll hear from us soon.`,
      });
      return;
    } else {
      res.status(200).send({
        message: `${req.body.email}, your account has been verification has been unsuccessful!`,
      });
    }
    return;
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
}
