import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ISkills } from './Skills';
import { IEmployment } from './Employment';
import { IExperience, ExperienceSchema } from './Experiences';
import { IPortfolio } from './Portfolio';
import { IPublication } from './Publications';
import { IEducation } from './Education';

export interface IUser extends mongoose.Document {
  email: String;
  password: String;
  role: String;
  name: String;
  profilePhoto: String;
  gender: String;
  github: String;
  linkedIn: String;
  stackOverflow: String;
  website: String;
  location: String;
  skills: Array<ISkills>;
  cv?: String;
  bio?: String;
  notifications: String;
  contactPerson: String;
  phone: String;
  publications?: Array<IPublication>;
  education: Array<IEducation>;
  companyURL?: String;
  address: String;
  interviews: Array<String>;
  tests: Array<String>;
  count: number;
  currentRole?: String;
  joined: String;
  description: String;
  portfolio: Array<IPortfolio>;
  stack: Array<String>;
  experiences: Array<IExperience>;
  employments: Array<IEmployment>;
  pod: String;
  hired: Boolean;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
    password: { type: String, required: true },
    role: { type: String, required: true },
    name: { type: String, required: true },
    profilePhoto: { type: String, required: true },
    gender: { type: String, default: 'male' },
    github: String,
    linkedIn: String,
    stackOverflow: String,
    website: String,
    location: String,
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
    publications: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Publication' },
    ],
    education: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Education' }],
    cv: { type: String },
    bio: { type: String },
    notifications: { type: String },
    contactPerson: { type: String },
    phone: { type: String },
    companyURL: { type: String },
    address: { type: String },
    count: {
      type: Number,
      default: 0,
    },
    interviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Interviews' }],
    tests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tests' }],
    currentRole: {
      type: String,
    },
    joined: {
      type: String,
    },
    description: {
      type: String,
    },
    portfolio: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio' }],
    stack: {
      type: Schema.Types.Mixed,
    },
    experience: { type: [ExperienceSchema] },
    employments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Employment' }],
    pod: { type: String },
    hired: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password.toString(), salt);
  }
});

export default mongoose.model<IUser>('User', UserSchema);
