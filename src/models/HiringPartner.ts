import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { IUser } from './User';

export interface InviteCount {
  pod: String;
  count: number;
  next: Boolean;
}

export interface IHiringPartner extends mongoose.Document {
  name: String;
  email: String;
  nameOfOrg: String;
  designation: String;
  website?: String;
  industry: String;
  phone: String;
  numberOfTalentsRequired: String;
  deadline: String;
  verified: Boolean;
  active: Boolean;
  password: String;
  interestLanguage: Array<String>;
  interviews: Array<String>;
  currentInviteCount: Array<InviteCount>;
  currentDevsInView: Map<String, Array<IUser>>;
}

const HiringPartnerSchema: Schema = new Schema(
  {
    name: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    nameOfOrg: { type: String, required: true },
    designation: { type: String, required: true },
    website: { type: String },
    industry: { type: String, required: true },
    phone: { type: String, required: true },
    currentInviteCount: {
      type: [
        {
          pod: { type: String },
          count: { type: Number },
          next: { type: Boolean },
        },
      ],
    },
    currentDevsInView: {
      type: Map,
      of: Array,
    },
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
    password: {
      type: String,
    },
    interestLanguage: {
      type: [String],
      required: true,
    },
    interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interviews' }],
  },
  { timestamps: true },
);

HiringPartnerSchema.pre<IHiringPartner>('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password.toString(), salt);
  }
});

export default mongoose.model<IHiringPartner>(
  'HiringPartner',
  HiringPartnerSchema,
);
