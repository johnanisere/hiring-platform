import mongoose, { Schema } from 'mongoose';

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  role: string;
  name: string;
  profilePhoto: string;
  skills?: [string];
  publications: string;
  cv?: string;
  bio?: string;
  notifications: string;
  contactPerson: string;
  phone: string;
  companyURL?: string;
  address: string;
}

const UserSchema: Schema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String },
    name: { type: String, required: true },
    profilePhoto: { type: String },
    skills: { type: mongoose.Schema.Types.ObjectId, ref: 'Skills' },
    publications: { type: mongoose.Schema.Types.ObjectId, ref: 'Publications' },
    cv: { type: String },
    bio: { type: String },
    notifications: { type: String },
    contactPerson: { type: String },
    phone: { type: String, required: true },
    companyURL: { type: String },
    address: { type: String, required: true },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>('User', UserSchema);
