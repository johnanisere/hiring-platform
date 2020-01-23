import HiringPartner from '../models/HiringPartner';
import { Request, Response } from 'express';
import accountActivateMail from '../utils/accountActivateMail';

export async function activateHirer(req: Request, res: Response) {
  try {
    const hirer = await HiringPartner.findOne({ email: req.body.email });

    if (!hirer)
      return res.status(400).json({
        message: `${req.body.name} account not found`,
      });
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
        actual: err.message,
        message: 'Unable to send email!',
      });
    }

    res.status(200).send({
      message: `${req.body.name} has been activated!`,
    });
    return;
  } catch (err) {
    res.status(400).json({ actual: err.message, message: 'Network Error' });
    return;
  }
}
