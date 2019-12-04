import mongoose, { Schema } from 'mongoose';

export interface IEducation extends mongoose.Document {
  qualification: String;
  placeOfEducation: String;
  duration: String;
}

const EducationSchema: Schema = new Schema({
  qualification: { type: String, required: true },
  placeOfEducation: { type: String, required: true },
  duration: { type: String, required: true },
});

export default mongoose.model<IEducation>('Education', EducationSchema);
