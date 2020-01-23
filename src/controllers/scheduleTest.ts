import Test from '../models/Test';
import { Request, Response } from 'express';
import User from '../models/User';
import { testValidation } from '../validator/testValidation';
import scheduleTestMail from '../utils/scheduleTestMail';

export default async function scheduleTest(req: Request, res: Response) {
  try {
    const { error } = testValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const test = new Test(req.body);

    const testDuration = req.body.duration
      ? req.body.duration
      : `${req.body.startTime} on ${req.body.startDate}  -  ${req.body.endTime} on ${req.body.endDate}`;

    try {
      const hiringPartner = await User.findOne({
        email: req.body.hiringPartner,
      });

      hiringPartner && hiringPartner.tests.push(test._id);
      hiringPartner && (await hiringPartner.save());
    } catch (error) {
      res.status(400).send({
        actaual: error,
        message: 'unable to find hirer',
      });
    }

    try {
      const decaDev = await User.findOne({ email: req.body.decaDev });

      if (decaDev) {
        decaDev.tests.push(test._id);
        await decaDev.save();
        scheduleTestMail(req, decaDev, testDuration, test._id);
      }
    } catch (error) {
      res
        .status(400)
        .send({ actual: error, message: 'unable to find decadev' });
    }

    try {
      const savedTest = await test.save();

      return res.status(201).json({
        testData: {
          hiringPartner: savedTest.hiringPartner,
          decaDev: savedTest.decaDev,
          description: savedTest.description,
          id: savedTest._id,
          scheduled: savedTest.startDate,
        },
        message: "Test details have been sent to Decadev's email",
      });
    } catch (error) {
      return res.status(404).json({
        actual: error.message,
        message: 'Unable to save tests',
      });
    }
  } catch (err) {
    res.send(400).send({
      message: 'Please make sure you have the right inputs',
      actual: err.message,
    });
    return;
  }
}
