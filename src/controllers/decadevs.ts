import User from '../models/User';
import Cycle from '../models/Cycle';
import { Response, Request } from 'express';

/**
 * @route    GET api/decadevs.
 * @Desc     GET all decadevs.
 * @access   authorized.
 */
export default async function getAllDecadevs(_req: Request, res: Response) {
  try {
    //get cycle count
    let activeCycle = await Cycle.findOne({ name: 'default' });
    let activeCycleCount = activeCycle ? activeCycle.count : 1;
    let prevCycle = activeCycleCount - 1;
    let allDecadevs = await User.find({ role: 'dev', count: prevCycle });

    if (allDecadevs.length < 1 && activeCycle) {
      activeCycle.count = activeCycleCount + 1;
      await activeCycle.save();
      activeCycleCount = activeCycle ? activeCycle.count : 1;
      prevCycle = activeCycleCount - 1;
      allDecadevs = await User.find({ role: 'dev', count: prevCycle });
    }

    //return just four decadev for now
    const fourDecaDev = allDecadevs.slice(0, 4);

    //update the current count for each of the four
    const updateCycle = fourDecaDev.map(async elem => {
      elem.count = activeCycleCount;
      return await elem.save();
    });

    await Promise.all(updateCycle);

    return res.send({ allDecadevs: fourDecaDev });
  } catch {
    return res.status(400).json({
      message: 'No Decadevs found!',
    });
  }
}
