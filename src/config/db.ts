import mongoose from 'mongoose';
import { MONGO_URL } from './index';

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;

export default connection;
