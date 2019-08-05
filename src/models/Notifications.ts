import mongoose, { Schema } from 'mongoose';

export interface INotifications extends mongoose.Document {
  message: String;
}

const NotificationSchema: Schema = new Schema({
  message: { type: String, required: true, unique: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
});

export default mongoose.model<INotifications>(
  'Notifications',
  NotificationSchema,
);
