import users from './data/users';
import User from '../../models/User';

const cleanDb = async () => {
  try {
    console.log('succesfully cleared db');
    return await User.deleteMany({});
  } catch (err) {
    console.log('Error: occured', err);
    return err;
  }
};

export const seedUsers = async () => {
  try {
    const allUsers = users.map(async user => {
      const newUser = await new User(user);
      return newUser.save();
    });
    const res = await Promise.all(allUsers);
    return res;
  } catch (err) {
    return err;
  }
};

const seed = () => {
  cleanDb()
    .then(() => {
      return seedUsers();
    })
    .then(res => {
      console.log(`Database has been seeded with ${res.length} users`);
    })
    .catch(err => {
      console.log({ err });
    });
};

export default seed;
