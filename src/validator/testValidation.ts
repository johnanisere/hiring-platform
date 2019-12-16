import joi from '@hapi/joi';

export const testValidation = (data: any) => {
  const schema = {
    hiringPartner: joi
      .string()
      .required()
      .email(),
    decaDev: joi
      .string()
      .required()
      .email(),

    description: joi
      .string()
      .required()
      .max(500),
    nameOfOrg: joi.string().required(),
    testUrl: joi.string(),
    startTime: joi.string(),
    endTime: joi.string(),
    startDate: joi.string(),
    endDate: joi.string(),
    duration: joi.string(),
  };

  return joi.validate(data, schema);
};
