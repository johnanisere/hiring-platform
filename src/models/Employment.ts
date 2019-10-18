import mongoose, { Schema } from 'mongoose';

export interface IEmployment extends mongoose.Document {
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

export default mongoose.model<IEmployment>('Employment', EmploymentSchema);

// var childSchema = new Schema({ name: 'string' });
