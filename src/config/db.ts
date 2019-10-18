import mongoose from 'mongoose';
import { MONGO_URL } from './index';
const condition = process.env.NODE_ENV !== 'test';

if (condition) {
  mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
}
const connection = mongoose.connection;

export default connection;
