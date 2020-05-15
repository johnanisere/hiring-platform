import mongoose from 'mongoose';

import User from '../src/models/User';
import HiringPartner from '../src/models/HiringPartner';

async function connectMongoDB(dbname: string) {
  await mongoose
    .connect(`${process.env.MONGO_URI_TEST}/${dbname}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    })
    .catch((err: any) => {
      console.error(err);
      return;
    });
  console.log('Connected to testDB');
}

async function disconnectMongoDB() {
  await User.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
  });
  await HiringPartner.remove({}, function(err) {
    if (err) {
      console.log(err);
    }
  });
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
