import joi from '@hapi/joi';

export const interviewValidation = (data: any) => {
  const schema = {
    hiringPartner: joi
      .string()
      .required()
      .email(),
    decaDev: joi
      .string()
      .required()
      .email(),
    location: joi.string().required(),
    startTime: joi.string().required(),
    endTime: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
    description: joi
      .string()
      .required()
      .max(500),
    nameOfOrg: joi.string().required(),
    accepted: joi.boolean(),
    declined: joi.boolean(),
    pending: joi.boolean(),
    declineReason: joi.string(),
    id: joi.any(),
  };

  return joi.validate(data, schema);
};
