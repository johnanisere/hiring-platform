import mongoose, { Schema } from 'mongoose';

export interface IInterviews extends mongoose.Document {
  hiringPartner: string;
  decaDev: string;
  location: string;
  startTime: string;
  endTime: string;
  description: string;
  eventId: string;
}

const InterviewsSchema: Schema = new Schema({
  hiringPartner: { type: String, required: true },
  decaDev: { type: String, required: true },
  location: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  description: { type: String, required: true },
  eventId: { type: String, required: true },
});

export default mongoose.model<IInterviews>('Interviews', InterviewsSchema);
