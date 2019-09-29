import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { ISkills, SkillSchema } from './Skills';
import { EmploymentSchema, IEmployment } from './Employment';
import { IExperience, ExperienceSchema } from './Experiences';
import { IPortfolio, PortfolioSchema } from './Portfolio';

export interface IUser extends mongoose.Document {
  email: String;
  password: String;
  role: String;
  name: String;
  profilePhoto: String;
  gender: string;
  skills?: Array<ISkills>;
  publications: String;
  cv?: String;
  bio?: String;
  notifications: String;
  contactPerson: String;
  phone: String;
  companyURL?: String;
  address: String;
  interviews: Array<String>;
  count: number;
  //******************* */
  currentRole?: String;
  joined: String;
  description: String;
  portfolio: Array<IPortfolio>;
  stack: Array<String>;
  experiences: Array<IExperience>;
  employment: Array<IEmployment>;
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
    skills: { type: [SkillSchema] },
    publications: { type: mongoose.Schema.Types.ObjectId, ref: 'Publications' },
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
    currentRole: {
      type: String,
    },
    joined: {
      type: String,
    },
    description: {
      type: String,
    },
    portfolio: { type: [PortfolioSchema] },
    stack: {
      type: [String],
    },
    experience: { type: [ExperienceSchema] },
    employments: { type: [EmploymentSchema] },
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
