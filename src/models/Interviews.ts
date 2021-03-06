import mongoose, { Schema } from 'mongoose';

export interface IInterviews extends mongoose.Document {
  hiringPartner: String;
  decaDev: String;
  location: String;
  startTime: String;
  endTime: String;
  startDate: String;
  endDate: String;
  description: String;
  nameOfOrg: String;
  accepted: Boolean;
  declined: Boolean;
  pending: Boolean;
  declineReason: String;
}

const InterviewsSchema: Schema = new Schema({
  hiringPartner: { type: String, required: true },
  decaDev: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true },
  nameOfOrg: { type: String, required: true },
  accepted: { type: Boolean, default: false },
  declined: { type: Boolean, default: false },
  pending: { type: Boolean, default: true },
  declineReason: { type: String, enum: ['Time Conflict', 'Health Challenge'] },
});

export default mongoose.model<IInterviews>('Interviews', InterviewsSchema);
