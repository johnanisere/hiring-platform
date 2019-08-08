import mongoose, { Schema } from 'mongoose';

export interface IInterviews extends mongoose.Document {
  hiringPartner: string;
  decaDev: string;
  location: string;
  time: string;
  description: string;
  accepted: boolean;
}

const InterviewsSchema: Schema = new Schema({
  hiringPartner: { type: String, required: true },
  decaDev: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  accepted: { type: Boolean, default: false },
});

export default mongoose.model<IInterviews>('Interviews', InterviewsSchema);
