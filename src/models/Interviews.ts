import mongoose, { Schema } from 'mongoose';

export interface IInterviews extends mongoose.Document {
  hiringPartner: String;
  decaDev: String;
  location: String;
  startTime: String;
  endTime: String;
  description: String;
  nameOfOrg: String;
  accepted: Boolean;
  declined: Boolean;
  pending: Boolean;
}

const InterviewsSchema: Schema = new Schema({
  hiringPartner: { type: String, required: true },
  decaDev: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: { type: String, required: true },
  nameOfOrg: { type: String, required: true },
  accepted: { type: Boolean, default: false },
  declined: { type: Boolean, default: false },
  pending: { type: Boolean, default: true },
});

export default mongoose.model<IInterviews>('Interviews', InterviewsSchema);
