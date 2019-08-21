import mongoose, { Schema } from 'mongoose';

export interface CycleChecks extends mongoose.Document {
  count: number;
  name: string;
}

const Cycle: Schema = new Schema({
  name: {
    type: String,
    default: 'default',
  },
  count: {
    type: Number,
    default: 1,
  },
});

export default mongoose.model<CycleChecks>('CycleCounts', Cycle);
