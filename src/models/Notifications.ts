import mongoose, { Schema } from 'mongoose';

export interface INotifications extends mongoose.Document {
  message: String;
}

const NotificationSchema: Schema = new Schema({
  message: { type: String },
});

export default mongoose.model<INotifications>(
  'Notifications',
  NotificationSchema,
);
