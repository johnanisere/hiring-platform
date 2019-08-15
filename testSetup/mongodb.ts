import mongoose from 'mongoose';

async function connectMongoDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/routesTest', {
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log('Connected');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

function disconnectMongoDB() {
  mongoose.connection.db.dropDatabase();

  mongoose.connection.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
