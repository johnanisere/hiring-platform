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
    time: joi.string().required(),
    profilePhoto: joi.string().required(),
    description: joi
      .string()
      .required()
      .max(100),
  };

  return joi.validate(data, schema);
};
