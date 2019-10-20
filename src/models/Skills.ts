import mongoose, { Schema } from 'mongoose';

export interface ISkills extends mongoose.Document {
  type: String;
  description: String;
}

export const SkillSchema: Schema = new Schema({
  type: { type: String },
  description: { type: String },
});
export default mongoose.model<ISkills>('Skill', SkillSchema);
