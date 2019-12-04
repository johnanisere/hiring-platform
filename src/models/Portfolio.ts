import mongoose, { Schema } from 'mongoose';

export interface IPortfolio extends mongoose.Document {
  title: String;
  languages: String;
  link: String;
}

export const PortfolioSchema: Schema = new Schema({
  title: { type: String },
  languages: { type: String },
  link: { type: String },
});

export default mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);
