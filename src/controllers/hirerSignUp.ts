import HiringPartner from '../models/HiringPartner';
import jwt from 'jsonwebtoken';
import { PRIVATE_KEY } from '../config';
import { Request, Response } from 'express';
import sendSignUpMail from '../utils/sendSignUpMail';
import joi from '@hapi/joi';
import hiringPartnerSchema from '../validator/hiringPartnerValidation';

export default async function hirerSignUp(req: Request, res: Response) {
  const { error } = joi.validate(req.body, hiringPartnerSchema, {
    skipFunctions: true,
    stripUnknown: true,
    abortEarly: false,
  });
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const hirer = new HiringPartner(req.body);
    const savedData = await hirer.save();
    const data = await HiringPartner.findOne({ _id: savedData._id }).select({
      __v: 0,
      _id: 0,
      createdAt: 0,
      updatedAt: 0,
      password: 0,
      phone: 0,
      designation: 0,
      nameOfOrg: 0,
      numberOfTalentsRequired: 0,
      deadline: 0,
      interestLanguage: 0,
    });

    if (data) {
      const token = jwt.sign(
        {
          userId: savedData._id,
          email: data.email,
        },
        PRIVATE_KEY,
        {
          expiresIn: '1h',
        },
      );
      try {
        sendSignUpMail(req, token);
      } catch (err) {
        res.status(400).send({
          see: `seems to be an issue with sending an email to ${req.body.email}!`,
          error: err.message,
        });
      }
      res.status(200).json({
        message:
          'Success!. An email has been sent to you. Please click link to verify your account.',
        token,
        data,
      });
    }
    return;
  } catch (err) {
    res.status(400).send({
      see: 'seems to be an issue in hirerSignUp controller',
      message: 'Network Error',
      actual: err.message,
    });
    return;
  }
}
