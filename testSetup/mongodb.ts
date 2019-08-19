import mongoose from 'mongoose';

function connectMongoDB() {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  return mongoose
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

function disconnectMongoDB() {
  mongoose.connection.db.dropDatabase();

  mongoose.connection.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
