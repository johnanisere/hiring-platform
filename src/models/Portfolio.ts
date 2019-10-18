import { Schema } from 'mongoose';

export interface IPortfolio {
  title: String;
  languages: String;
  years: String;
}

export const PortfolioSchema: Schema = new Schema({
  title: { type: String },
  languages: { type: String },
  years: { type: String },
});
