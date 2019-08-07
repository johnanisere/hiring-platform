import User from '../models/User';
import { Response, Request } from 'express';

/**
 * @route    GET api/decadevs.
 * @Desc     GET all decadevs.
 * @access   authorized.
 */
export default async function getAllDecadevs(_req: Request, res: Response) {
  try {
    const allDecadevs = await User.find({ role: 'dev' });
    return res.status(200).json({ allDecadevs });
  } catch (err) {
    console.log('Hey!!!!!!!!!!', err.message);
    return res.status(400).json({
      message: 'No Decadevs found!',
    });
  }
}
