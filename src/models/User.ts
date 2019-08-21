import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends mongoose.Document {
  email: String;
  password: String;
  role: String;
  name: String;
  profilePhoto: String;
  gender: string;
  skills?: [String];
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
    gender: { type: String, required: true },
    skills: { type: mongoose.Schema.Types.ObjectId, ref: 'Skills' },
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
