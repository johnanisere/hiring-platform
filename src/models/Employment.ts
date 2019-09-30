import { Schema } from 'mongoose';

export interface IEmployment {
  title: String;
  duration: String;
  location: String;
  achievements: Array<String>;
}

export const EmploymentSchema: Schema = new Schema({
  title: { type: String },
  duration: { type: String },
  location: { type: String },
  achievements: { type: Schema.Types.Mixed },
});
