import mongoose from 'mongoose';

let connection: any;

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

  connection = mongoose.connection;

  console.log('Connected to testDB');
}

async function disconnectMongoDB() {
  await connection.db.dropDatabase();

  await mongoose.connection.close();

  // await db.close();
}

module.exports = {
  connectMongoDB,
  disconnectMongoDB,
};
