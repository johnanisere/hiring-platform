import mongoose from 'mongoose';

async function connectMongoDB() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose
    .connect('mongodb://localhost:27017/routesTest', {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .catch((err: any) => {
      console.error(err);

      process.exit(1);
    });
  console.log('Connected');
}

async function disconnectMongoDB() {
  await mongoose.connection.db.dropDatabase();

  mongoose.connection.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
