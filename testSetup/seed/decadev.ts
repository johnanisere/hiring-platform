import User from '../../src/models/User';

const users = [
  {
    email: 'doe@example.com',
    name: 'John Doe',
    phone: '08074583218',
    password: 'mysecret2',
    role: 'admin',
    profilePhoto:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcqjP8a8EfGrtkCX0CJXJ4HRltM5u8Jdhkz_TneWdb4rfPsMi',
  },

  {
    email: 'decadev@example.com',
    name: 'Jane Mary',
    phone: '08074583218',
    password: 'mysecret2',
    role: 'dev',
    profilePhoto:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIcqjP8a8EfGrtkCX0CJXJ4HRltM5u8Jdhkz_TneWdb4rfPsMi',
    pod: 'android',
  },
];

export const seedUsers = async () => {
  try {
    const allUsers = users.map(async user => {
      const newUser = new User(user);
      return newUser.save();
    });

    const res = await Promise.all(allUsers);
    return res;
  } catch (err) {
    return err;
  }
};

const seed = async () => {
  try {
    const res = await seedUsers();
    console.log(`Database has been seeded with ${res.length} users`);
  } catch (err) {
    console.log({ err });
  }
};

export default seed;
