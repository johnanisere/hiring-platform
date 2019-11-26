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
    duration: joi.string().required(),
    description: joi
      .string()
      .required()
      .max(500),
    nameOfOrg: joi.string().required(),
    testUrl: joi.string(),
    startTime: joi.string().required(),
    endTime: joi.string().required(),
    startDate: joi.string().required(),
    endDate: joi.string().required(),
  };

  return joi.validate(data, schema);
};
