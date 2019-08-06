import mongoose, { Schema } from 'mongoose';

export interface IPublications extends mongoose.Document {
  publication: String;
}

const publicationSchema: Schema = new Schema({
  publication: { type: String },
});

export default mongoose.model<IPublications>('Publications', publicationSchema);
