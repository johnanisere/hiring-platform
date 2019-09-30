import { Schema } from 'mongoose';

export interface IExperience {
  title: String;
  years: String;
}

export const ExperienceSchema: Schema = new Schema({
  title: { type: String },
  years: { type: String },
});
