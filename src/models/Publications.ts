import mongoose, { Schema } from 'mongoose';

export interface IPublications extends mongoose.Document {
  publication: String;
}

const PublicationSchema: Schema = new Schema({
  publication: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<IPublications>('Publications', PublicationSchema);
