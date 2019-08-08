import Interviews from '../models/Interviews';
import { Request, Response } from 'express';
import User from '../models/User';
import { interviewValidation } from '../validator/interviewValidation';
//import { celebrate, Joi } from 'celebrate';

export const scheduleInterview = async (req: Request, res: Response) => {
  const { error } = interviewValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const interview = new Interviews(req.body);
  try {
    const hiringPartner = await User.findOne({ email: req.body.hiringPartner });
    hiringPartner && hiringPartner.interviews.push(interview._id);
    hiringPartner && (await hiringPartner.save());
  } catch (err) {
    res.status(400).send(err);
  }

  try {
    const decaDev = await User.findOne({ email: req.body.decaDev });
    decaDev && decaDev.interviews.push(interview._id);
    decaDev && (await decaDev.save());
  } catch (error) {
    res.status(400).send(error);
  }

  try {
    const savedInterview = await interview.save();

    return res.status(201).json({
      hiringPartner: savedInterview.hiringPartner,
      decaDev: savedInterview.decaDev,
      location: savedInterview.location,
      time: savedInterview.time,
      description: savedInterview.description,
      accepted: savedInterview.accepted,
      id: savedInterview._id,
    });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};

export const acceptInterview = async (req: Request, res: Response) => {
  try {
    const interview = await Interviews.findByIdAndUpdate(
      req.params.interviewId,
      req.body,
      { new: true },
    );
    return res.status(200).json({ interview });
  } catch (error) {
    return res.status(404).json(`Error: ${error}`);
  }
};

// export const validator = celebrate({
//   body: Joi.object().keys({
//     hiringPartner: Joi.string().required().email(),
//     decaDev: Joi.string().required().email(),
//     location: Joi.string().required(),
//     time: Joi.string().required(),
//     description: Joi.string().required()
//   }),
// });

// export default validator
