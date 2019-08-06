import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
    skills: { type: mongoose.Schema.Types.ObjectId, ref: 'Skill' },
    publications: { type: mongoose.Schema.Types.ObjectId, ref: 'Publication' },
    cv: { type: String },
    bio: { type: String },
    notifications: { type: String },
    contactPerson: { type: String },
    phone: { type: String, required: true },
    companyURL: { type: String },
    address: { type: String },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function() {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
});

export default mongoose.model<IUser>('User', UserSchema);
