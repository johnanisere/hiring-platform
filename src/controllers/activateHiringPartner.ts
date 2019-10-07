import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';
import accountActivateMail from '../utils/accountActivateMail';

export async function activateHirer(req: Request, res: Response) {
  try {
    const hirer = await HiringPartner.findOne({ email: req.body.email });

    if (hirer) {
      await HiringPartner.updateOne(
        {
          email: req.body.email,
        },
        {
          active: true,
        },
      ).exec();

      await hirer.save();
      try {
        accountActivateMail(req);
      } catch (err) {
        res.status(400).send({
          see: 'seems to be an issue with sending an email',
          error: err.message,
        });
      }

      res.status(200).send({
        message: `${req.body.name} has been activated!`,
      });
      return;
    } else {
      res.status(200).send({
        message: `${req.body.name} account activation has been unsuccessful!`,
      });
      return;
    }
  } catch (err) {
    res.status(400).send(err.message);
    return;
  }
}
