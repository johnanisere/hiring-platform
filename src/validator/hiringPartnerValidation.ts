import joi from '@hapi/joi';

const hiringPartnerSchema: any = {
  name: joi.string().required(),
  email: joi.string().required(),
  nameOfOrg: joi.string().required(),
  designation: joi.string().required(),
  website: joi.string(),
  industry: joi.string().required(),
  phone: joi.string().required(),
  numberOfTalentsRequired: joi.string().required(),
  deadline: joi.string().required(),
  verified: joi.boolean(),
  active: joi.boolean(),
  password: joi.string().required(),
  interestLanguage: joi.array().required(),
  interviews: joi.array(),
};

export default hiringPartnerSchema;
