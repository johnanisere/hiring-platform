import User from '../models/User';
// import Cycle from '../models/Cycle';
import { Response, Request } from 'express';
import { IUser } from '../models/User';

/**
 * @route    GET api/decadevs.
 * @Desc     GET all decadevs.
 * @access   authorized.
 */

export default async function getAllDecadevs(req: Request, res: Response) {
  let { pod } = req.query;

  pod = pod ? `${pod}`.toLowerCase() : '';

  try {
    const onPodNotPassed = !pod || pod === 'all';

    let allDecadevs = onPodNotPassed
      ? await User.find({ role: 'dev' })
          .populate('employments')
          .populate('skills')
          .populate('portfolio')
          .populate('publications')
          .populate('education')
      : await User.find({ role: 'dev', pod })
          .populate('employments')
          .populate('skills')
          .populate('portfolio')
          .populate('publications')
          .populate('education');

    let sortedDevs = allDecadevs.sort(
      (a: IUser, b: IUser): number => a.count - b.count,
    );

    let start = 0;
    let end = 4;
    const fourDecaDev = sortedDevs.slice(start, end);

    const updateCycle = fourDecaDev.map(async elem => {
      ++elem.count;
      return await elem.save();
    });

    await Promise.all(updateCycle);
    (start += 4), (end += 4);

    return res.send({
      allDecadevs: fourDecaDev,
      pod,
      total: allDecadevs.length,
    });
  } catch (error) {
    return res.status(400).json({
      message: 'No Decadevs found!',
    });
  }
}
