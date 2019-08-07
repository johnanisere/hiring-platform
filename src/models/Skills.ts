import mongoose, { Schema } from 'mongoose';

export interface ISkills extends mongoose.Document {
  skill: String;
}

const SkillSchema: Schema = new Schema({
  skill: { type: String },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<ISkills>('Skills', SkillSchema);
