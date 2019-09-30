import mongoose, { Schema } from 'mongoose';

export interface IHiringPartner extends mongoose.Document {
  contactPerson: String;
  email: String;
  name: String;
  designation: String;
  Website?: String;
  phone: String;
  numberOfTalentsRequired: String;
  deadline: String;
  verified: Boolean;
  active: Boolean;
}

const HiringPartnerSchema: Schema = new Schema(
  {
    contactPerson: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    name: { type: String, required: true },
    designation: { type: String, required: true },
    website: { type: String },
    phone: { type: String },
    numberOfTalentsRequired: {
      type: String,
      enum: ['1-5', '6-10', '11-20', '21 and above'],
      required: true,
    },
    deadline: {
      type: String,
      enum: [
        'Within 1 Month',
        'Within 2-3 Months',
        'It depends',
        "Let's Talk First",
      ],
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IHiringPartner>(
  'HiringPartner',
  HiringPartnerSchema,
);
