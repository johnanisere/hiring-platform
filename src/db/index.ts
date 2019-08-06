import mongoose from 'mongoose';
import { MONGO_URL } from '../config';

mongoose.connect(MONGO_URL, { useNewUrlParser: true });

const connection = mongoose.connection;

export default connection;
