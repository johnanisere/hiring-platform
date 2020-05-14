import User from '../models/User';
import { Request, Response } from 'express';
import joi from '@hapi/joi';
import httpStatus from 'http-status';

import feedbackMail from '../utils/feedBackMail';
import sendResponse from '../utils/response';

const hireDevReqBodySchema = joi.object().keys({
  hired: joi.boolean().required(),
  email: joi.string().required(),
});

export default async function hiredDev(req: Request, res: Response) {
  const { user, ...rest } = req.body;

  const { value, error } = hireDevReqBodySchema.validate(rest);

  if (error) {
    res.status(httpStatus.BAD_REQUEST).send(
      sendResponse({
        message: 'Please provide valid decadev email',
        error,
      }),
    );
    return;
  }

  try {
    const { hired, email } = value;

    /**Here we find and update the decadev's hired field */
    const decadev = await User.findOneAndUpdate(
      { email },
      {
        hired,
      },
    );

    /**If the Decadev is not found, we send that as a response to the client  */
    if (!decadev) {
      res.status(httpStatus.NOT_FOUND).send(
        sendResponse({
          message: 'decadev not found!',
        }),
      );
      return;
    }

    /**Here we first check if the 'hired' value is true, this endpoint also works for if someone is now out of job and the admin wants to put the person back on the platform. */
    if (hired) {
      const name = decadev!.name;
      const id = decadev!.id;

      /**Here we send the Feedback email, using this method in the utils folder */

      if (process.env.NODE_ENV !== 'test') {
        feedbackMail(email, name, id);
      }
      await decadev!.save();

      /**Here we send a response saying the decadev has been hired! */

      res.status(httpStatus.OK).send(
        sendResponse({
          message: `${decadev.name} has been hired`,
          payload: { decadev: decadev.name },
        }),
      );
      return;
    }

    res.status(httpStatus.OK).send(
      sendResponse({
        message: `${decadev.name} has been added back to the platform`,
        payload: { decadev: decadev.name },
      }),
    );

    return;
  } catch (err) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send(
      sendResponse({
        message: 'Process Failed',
        error,
      }),
    );
    return;
  }
}
