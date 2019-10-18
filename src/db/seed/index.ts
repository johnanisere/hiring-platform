import users from './data/users';
import User from '../../models/User';
import Cycle from '../../models/Cycle';
import Employment from '../../models/Employment';
import employments from './data/employments';

const cleanDb = async () => {
  try {
    await Cycle.deleteMany({});
    await User.deleteMany({});
    return console.log('succesfully cleared db');
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
    const cycle = await new Cycle();
    await cycle.save();
    const res = await Promise.all(allUsers);
    return res;
  } catch (err) {
    return err;
  }
};

export const seedEmployments = async () => {
  try {
    const allEmployments = employments.map(async employment => {
      const newEmployment = await new Employment(employment);
      return newEmployment.save();
    });
    const res: any = await Promise.all(allEmployments);
    const dev: any = await User.findOne({ email: 'sheyiogundijo@gmail.com' });
    res.forEach((employment: any) => dev.employments.push(employment._id));
    await dev.save();
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
    .then(() => {
      return seedEmployments();
    })
    .then(res => {
      console.log(`Database has been seeded with ${res.length} users`);
    })
    .catch(err => {
      console.log({ err });
    });
};

export default seed;
