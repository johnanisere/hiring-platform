import mongoose, { Schema } from 'mongoose';

export interface IPublication extends mongoose.Document {
  link: String;
  title: String;
}

const PublicationSchema: Schema = new Schema({
  link: { type: String },
  title: { type: String },
});

export default mongoose.model<IPublication>('Publication', PublicationSchema);
