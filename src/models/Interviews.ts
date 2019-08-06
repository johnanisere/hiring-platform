import mongoose, { Schema } from 'mongoose';

export interface IInterviews extends mongoose.Document {
  hiringPartner: String;
  decaDev: String;
  location: String;
  time: String;
  description: String;
  accepted: Boolean;
}

const InterviewsSchema: Schema = new Schema({
  hiringPartner: { type: String, required: true },
  decaDev: { type: String, required: true },
  location: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  accepted: { type: Boolean },
});

export default mongoose.model<IInterviews>('Interviews', InterviewsSchema);
