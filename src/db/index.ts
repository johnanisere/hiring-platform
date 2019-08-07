import mongoose from 'mongoose';
import { MONGO_URL } from '../config/index';

mongoose.connect(MONGO_URL, { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;

export default connection;
