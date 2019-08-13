const mongoose = require('mongoose');

function connectMongoDB() {
  return mongoose
    .connect(`${process.env.MONGO_URI_TEST}`, {
      useNewUrlParser: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log('Connected');
    })
    .catch((err: any) => {
      console.error(err);

      process.exit(1);
    });
}

function disconnectMongoDB() {
  mongoose.connection.db.dropDatabase();

  mongoose.connection.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
