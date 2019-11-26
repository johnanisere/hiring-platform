import mongoose, { Schema } from 'mongoose';

export interface ITests extends mongoose.Document {
  hiringPartner: String;
  decaDev: String;
  duration: String;
  description: String;
  nameOfOrg: String;
  testUrl?: String;
  startTime: String;
  endTime: String;
  startDate: String;
  endDate: String;
}

const TestsSchema: Schema = new Schema({
  hiringPartner: { type: String, required: true },
  decaDev: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  nameOfOrg: { type: String, required: true },
  testUrl: { type: String },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
});

export default mongoose.model<ITests>('Test', TestsSchema);
