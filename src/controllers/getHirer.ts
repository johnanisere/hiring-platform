import HiringPartner from '../models/HiringPartner';

import { Response, Request } from 'express';

export default async function getHirer(req: Request, res: Response) {
  let { id } = req.body;

  const partner = await HiringPartner.findById(id);

  return res.status(200).json({ partner, message: 'Partner found' });
}
