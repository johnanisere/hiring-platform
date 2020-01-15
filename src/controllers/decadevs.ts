import User from '../models/User';
import HiringPartner from '../models/HiringPartner';
// import Cycle from '../models/Cycle';
import { Response, Request } from 'express';
import { IUser } from '../models/User';

/**
 * @route    GET api/decadevs.
 * @Desc     GET all decadevs.
 * @access   authorized.
 */

export default async function getAllDecadevs(req: Request, res: Response) {
  let { pod, isNext } = req.query;

  pod = `${pod}`.toLowerCase();

  try {
    const partner = await HiringPartner.findById(req.body.id);
    let allDecadevs = await User.find({ role: 'dev', pod, hired: false })
      .populate('employments')
      .populate('skills')
      .populate('portfolio')
      .populate('publications')
      .populate('interviews')
      .populate('education')
      .exec();

    const currentInviteCount = partner!.currentInviteCount;
    const inviteCountLength = currentInviteCount.length;
    let returnNew = isNext ? isNext : false;

    let thePod = currentInviteCount.filter(item => item.pod === pod);

    if (thePod.length && isNext) {
      for (let i = 0; i < inviteCountLength; i++) {
        if (
          currentInviteCount[i].pod === pod &&
          currentInviteCount[i].count > 1
        ) {
          currentInviteCount[i].count = 0;
          currentInviteCount[i].next = true;
        } else {
          currentInviteCount[i].next = isNext ? isNext : true;
          currentInviteCount[i].count = 0;
        }
      }
    } else if (!thePod.length) {
      returnNew = true;
    } else {
      returnNew = false;
    }

    console.log(thePod.length);
    console.log(returnNew);

    await partner!.save();

    if (returnNew) {
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

      partner!.currentDevsInView = new Map();
      partner!.currentDevsInView.set(pod, fourDecaDev);
      let podCountFound = false;
      partner!.currentInviteCount.forEach(inviteCount => {
        if (inviteCount.pod == pod) {
          podCountFound = true;
        }
      });
      if (podCountFound) {
        partner!.save();
      } else {
        partner!.currentInviteCount.push({ pod, count: 0, next: true });
        partner!.save();
      }

      return res.send({
        allDecadevs: fourDecaDev,
        pod,
        total: allDecadevs.length,
      });
    } else {
      const devs = partner!.currentDevsInView.get(pod);

      let devIds = await devs!.map(dev => dev.email);

      let result: any = [];

      //Filter from partners dev in view ids to get the user dev
      allDecadevs.forEach(dev => {
        devIds.forEach(email => {
          if (email == dev.email) {
            result.push(dev);
          }
        });
      });

      return res.send({
        allDecadevs: result,
        pod,
        total: allDecadevs.length,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: 'No Decadevs found!',
    });
  }
}
