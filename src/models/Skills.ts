import { Schema } from 'mongoose';

export interface ISkills {
  type: String;
  description: String;
}

export const SkillSchema: Schema = new Schema({
  type: { type: String },
  description: { type: String },
});
